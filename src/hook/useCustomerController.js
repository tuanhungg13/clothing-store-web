import { useState, useEffect } from "react";
import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
    doc,
    updateDoc,
    startAfter,
    limit,
    getCountFromServer
} from "firebase/firestore";
import { db } from "@/utils/config/configFirebase";

const useCustomerController = ({ params }) => {
    const [customers, setCustomers] = useState([]);
    const [defaultParams] = useState({ size: 10, page: 1 });
    const [loading, setLoading] = useState(false);
    const [totalElements, setTotalElements] = useState(0);
    const [lastVisibleDocs, setLastVisibleDocs] = useState([]); // lưu lastVisible của từng trang

    useEffect(() => {
        fetchCustomers();
    }, [params]);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const filterParams = { ...defaultParams, ...params };
            const page = filterParams.page || 1;
            const size = filterParams.size || 10;

            const filters = [];

            // Lọc theo role
            if (filterParams?.role) {
                filters.push(where("role", "==", filterParams.role));
            }

            // Lọc theo từ khóa tìm kiếm
            if (filterParams?.keyword) {
                filters.push(
                    where("fullName", ">=", filterParams.keyword.toLowerCase()),
                    where("fullName", "<=", filterParams.keyword.toLowerCase() + "\uf8ff")
                );
            }

            // Query gốc
            let baseQuery = query(
                collection(db, "users"),
                ...filters,
                orderBy("createdAt", "desc")
            );

            let startPoint = null;

            if (page > 1 && lastVisibleDocs[page - 2]) {
                startPoint = lastVisibleDocs[page - 2]; // trang trước đó
            }

            const pagedQuery = query(
                baseQuery,
                ...(startPoint ? [startAfter(startPoint)] : []),
                limit(size)
            );

            const snapshot = await getDocs(pagedQuery);

            const customersData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setCustomers(customersData);

            // Cập nhật lastVisible cho trang hiện tại
            if (snapshot.docs.length > 0) {
                const newLastVisible = snapshot.docs[snapshot.docs.length - 1];
                setLastVisibleDocs((prev) => {
                    const updated = [...prev];
                    updated[page - 1] = newLastVisible;
                    return updated;
                });
            }

            // Đếm tổng số users (chỉ cần ở page 1)
            if (page === 1) {
                const totalQuery = query(collection(db, "users"), ...filters);
                const totalSnapshot = await getDocs(totalQuery);
                setTotalElements(totalSnapshot.size);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách khách hàng:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateUserRole = async (userId, newRole) => {
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, { role: newRole });
            fetchCustomers()
            console.log("Cập nhật vai trò thành công.");
            return true;
        } catch (error) {
            console.error("Lỗi khi cập nhật vai trò người dùng:", error);
            return false;
        }
    };

    const getTotalUsersWithUserRole = async () => {
        try {
            const q = query(collection(db, "users"), where("role", "==", "user"));
            const snapshot = await getCountFromServer(q);
            return snapshot.data().count;
        } catch (error) {
            console.error("❌ Lỗi khi lấy tổng số users có role là user:", error);
            return 0;
        }
    };


    return {
        customers,
        fetchCustomers,
        loading,
        totalElements,
        updateUserRole,
        getTotalUsersWithUserRole
    };
};

export default useCustomerController;
