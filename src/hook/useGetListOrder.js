import React, { useState, useEffect } from "react";
import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    startAt,
    endAt,
    FieldPath
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

            let baseQuery;
            let filters = [];

            if (filterParams?.orderId) {
                baseQuery = query(
                    collection(db, "orders"),
                    orderBy("__name__"),
                    startAt(filterParams.orderId),
                    endAt(filterParams.orderId + "\uf8ff")
                );
            } else {
                if (filterParams?.status) {
                    filters.push(where("status", "==", filterParams.status));
                }
                if (filterParams?.fromDate && filterParams?.toDate) {
                    filters.push(
                        where("orderDate", ">=", filterParams.fromDate),
                        where("orderDate", "<=", filterParams.toDate)
                    );
                }

                baseQuery = query(
                    collection(db, "orders"),
                    ...filters,
                    orderBy("orderDate", "desc")
                );
            }

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

            const newOrders = snapshot.docs.map((doc) => ({
                orderId: doc.id,
                ...doc.data(),
            }));

            setOrders(newOrders);

            // ✅ Đếm tổng nếu là page 1
            if (page === 1) {
                const totalSnapshot = await getDocs(baseQuery);
                setTotalElements(totalSnapshot.size);
            }
        } catch (error) {
            console.error("❌ Lỗi khi lấy danh sách đơn hàng:", error);
        } finally {
            setLoading(false);
        }
    };

    return {
        orders,
        loading,
        totalElements
    }
}

export default useGetListOrder;