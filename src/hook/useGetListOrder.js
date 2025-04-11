import React, { useState, useEffect } from "react";
import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    runTransaction
} from "firebase/firestore";
import { db, auth } from "@/utils/config/configFirebase";
import { message } from "antd";
import { useRouter } from "next/navigation";
import useCartController from "./useCartController";
const useGetListOrder = (props) => {
    const { params = {} } = props;
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(null);
    const router = useRouter();
    const [totalElements, setTotalElements] = useState(0)
    const [defaultParams, setDefaultParams] = useState({
        size: 10,
    });
    const {
        removeMultipleCartItems = () => { }
    } = useCartController()
    useEffect(() => {
        fetchOrders();
    }, [params]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const filterParams = { ...defaultParams, ...params };
            const page = filterParams.page || 1;
            const size = filterParams.size || 10;

            const filters = [];

            if (filterParams?.userId != null) {
                filters.push(where("userId", "==", filterParams?.userId));
            }
            if (filterParams?.status != null) {
                filters.push(where("status", "==", filterParams?.status));
            }

            // Tạo query ban đầu (chỉ lọc và sắp xếp)
            let baseQuery = query(
                collection(db, "orders"),
                ...filters,
                orderBy("orderDate", "desc") // cần tạo index nếu dùng where + orderBy
            );

            let lastVisible = null;

            // Nếu page > 1, cần skip qua (page - 1) * size
            if (page > 1) {
                const prevQuery = query(baseQuery, limit((page - 1) * size));
                const prevSnapshot = await getDocs(prevQuery);
                lastVisible = prevSnapshot.docs[prevSnapshot.docs.length - 1];
            }

            // Query trang hiện tại
            const pagedQuery = query(
                baseQuery,
                ...(lastVisible ? [startAfter(lastVisible)] : []),
                limit(size)
            );

            const snapshot = await getDocs(pagedQuery);

            const newOrders = snapshot.docs.map(doc => ({
                orderId: doc.id,
                ...doc.data()
            }));
            console.log(newOrders)
            setOrders(newOrders);

            // Chỉ đếm tổng ở page 1
            if (page === 1) {
                const totalQuery = query(collection(db, "orders"), ...filters);
                const totalSnapshot = await getDocs(totalQuery);
                setTotalElements(totalSnapshot.size); // hoặc setTotalCount
            }

        } catch (error) {
            console.error("❌ Lỗi khi lấy danh sách đơn hàng:", error);
        } finally {
            setLoading(false);
        }
    }
    return {
        orders,
        loading,
        totalElements
    }
}

export default useGetListOrder;