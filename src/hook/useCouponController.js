import { useState, useEffect } from "react";
import {
    collection,
    query,
    where,
    orderBy,
    startAfter,
    limit,
    getDocs,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    arrayUnion,
    getDoc,
    setDoc,
} from "firebase/firestore";
import { db } from "@/utils/config/configFirebase";
import { message } from "antd";
const useCouponController = ({ params }) => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalElements, setTotalElements] = useState(0);
    const [defaultParams] = useState({ size: 10, page: 1 });

    useEffect(() => {
        fetchCoupons();
    }, [params]);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const filterParams = { ...defaultParams, ...params };
            const page = filterParams.page || 1;
            const size = filterParams.size || 10;

            const filters = [];

            if (filterParams.code) filters.push(where("code", "==", filterParams.code));
            if (filterParams.title) filters.push(where("title", "==", filterParams.title));

            let baseQuery = query(collection(db, "coupons"), ...filters, orderBy("createdAt", "desc"));

            let lastVisible = null;

            if (page > 1) {
                const prevQuery = query(baseQuery, limit((page - 1) * size));
                const prevSnapshot = await getDocs(prevQuery);
                lastVisible = prevSnapshot.docs[prevSnapshot.docs.length - 1];
            }

            const pagedQuery = query(
                baseQuery,
                ...(lastVisible ? [startAfter(lastVisible)] : []),
                limit(size)
            );

            const snapshot = await getDocs(pagedQuery);
            const result = snapshot.docs.map(docSnap => ({
                couponId: docSnap.id,
                ...docSnap.data()
            }));

            setCoupons(result);

            if (page === 1) {
                const totalQuery = query(collection(db, "coupons"), ...filters);
                const totalSnapshot = await getDocs(totalQuery);
                setTotalElements(totalSnapshot.size);
            }
        } catch (err) {
            console.error("Lỗi khi lấy coupon:", err);
        } finally {
            setLoading(false);
        }
    };

    const createCoupon = async ({ couponData, applyToAll, selectedUsers = [] }) => {
        setLoading(true)
        try {
            console.log("check ::::", selectedUsers)
            const newCouponRef = await addDoc(collection(db, "coupons"), {
                ...couponData,
                createdAt: new Date().toISOString(),
            });

            const couponId = newCouponRef.id;

            let userIds = [];

            if (applyToAll) {
                const userSnapshot = await getDocs(collection(db, "users"));
                userIds = userSnapshot.docs.map(doc => doc.id);
            } else {
                userIds = selectedUsers;
            }
            console.log(userIds)

            // Lưu coupon vào mỗi user (subcollection hoặc mảng trong user đều được)
            await Promise.all(
                userIds.map(async (uid) => {
                    const userRef = doc(db, "users", uid);
                    await updateDoc(userRef, {
                        coupons: arrayUnion(couponId),
                    });
                })
            );

            await fetchCoupons(); // refresh danh sách
            setLoading(false)
            return true;
        } catch (err) {
            setLoading(false)
            console.error("Lỗi khi tạo coupon:", err);
            return false;
        }
    };

    const deleteCoupon = async (couponId) => {
        try {
            // Xác định document của coupon trong Firestore bằng couponId
            const couponRef = doc(db, "coupons", couponId);

            // Xóa coupon
            await deleteDoc(couponRef);
            await fetchCoupons()
            console.log("Coupon đã được xóa thành công!");
            message.success("Xóa coupon thành công!");

            // Bạn có thể gọi lại API hoặc cập nhật lại trạng thái sau khi xóa, ví dụ:
            // setCoupons(prevCoupons => prevCoupons.filter(coupon => coupon.couponId !== couponId));
        } catch (err) {
            console.error("Lỗi khi xóa coupon:", err);
            message.error("Xóa coupon thất bại!");
        }
    };

    return {
        coupons,
        fetchCoupons,
        createCoupon, // expose ra ngoài
        loading,
        totalElements,
        deleteCoupon
    };
};

export default useCouponController;
