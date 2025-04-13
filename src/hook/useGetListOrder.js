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
    getCountFromServer,
    FieldPath
} from "firebase/firestore";
import { db, auth } from "@/utils/config/configFirebase";
import { message } from "antd";
import { useRouter } from "next/navigation";
import useCartController from "./useCartController";
const useGetListOrder = (props) => {
    const [orderCountByDate, setOrderCountByDate] = useState([]);
    const { params = {} } = props;
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(null);
    const router = useRouter();
    const [totalElements, setTotalElements] = useState(0)
    const [defaultParams, setDefaultParams] = useState({
        size: 10,
    });
    useEffect(() => {
        fetchOrders();
        if (params?.fromDate && params?.toDate) {
            fetchOrderCountByDate()
        }
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
            console.log(newOrders)
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

    const getTotalRevenueAndOrders = async () => {
        try {
            const filterParams = { ...defaultParams, ...params };
            const fromDate = filterParams?.fromDate;
            const toDate = filterParams?.toDate;

            console.log("fromDate:", fromDate);
            console.log("toDate:", toDate);

            // Lấy tổng doanh thu từ đơn hàng SUCCESS trong khoảng thời gian
            const successOrdersQuery = query(
                collection(db, "orders"),
                where("status", "==", "SUCCESS"),
                ...(fromDate && toDate ? [
                    where("orderDate", ">=", fromDate),
                    where("orderDate", "<=", toDate),
                    orderBy("orderDate") // Sắp xếp theo orderDate
                ] : [orderBy("orderDate")]) // Đảm bảo có orderBy nếu không có thời gian
            );

            const snapshotSuccessOrders = await getDocs(successOrdersQuery);
            let totalRevenue = 0;

            snapshotSuccessOrders.forEach((doc) => {
                const data = doc.data();
                if (data.totalPrice) {
                    totalRevenue += Number(data.totalPrice);
                }
            });

            // Lấy tổng số đơn hàng trong khoảng thời gian
            const ordersQuery = query(
                collection(db, "orders"),
                ...(fromDate && toDate ? [
                    where("orderDate", ">=", fromDate),
                    where("orderDate", "<=", toDate),
                    orderBy("orderDate") // Sắp xếp theo orderDate
                ] : [orderBy("orderDate")]) // Đảm bảo có orderBy nếu không có thời gian
            );

            const snapshotTotalOrders = await getDocs(ordersQuery);
            const totalOrders = snapshotTotalOrders.size;

            return { totalRevenue, totalOrders };

        } catch (error) {
            console.error("Lỗi khi lấy tổng doanh thu và tổng số đơn hàng:", error);
            return { totalRevenue: 0, totalOrders: 0 };
        }
    };


    const fetchOrderCountByDate = async () => {
        setLoading(true);
        try {
            const filterParams = { ...defaultParams, ...params };
            const fromDate = filterParams?.fromDate;
            const toDate = filterParams?.toDate;

            const orderQuery = query(
                collection(db, "orders"),
                where("orderDate", ">=", fromDate),
                where("orderDate", "<=", toDate),
                orderBy("orderDate", "asc")
            );

            const snapshot = await getDocs(orderQuery);
            const groupedOrders = groupOrdersByDate(snapshot.docs);

            setOrderCountByDate(groupedOrders);
        } catch (error) {
            console.error("❌ Lỗi khi lấy số lượng đơn hàng theo ngày:", error);
        } finally {
            setLoading(false);
        }
    };

    const groupOrdersByDate = (orders) => {
        const grouped = {};

        orders.forEach((doc) => {
            const data = doc.data();
            const orderDate = new Date(data.orderDate.seconds * 1000).toISOString().split('T')[0]; // Lấy ngày (YYYY-MM-DD)

            // Nếu ngày đã tồn tại trong grouped, cộng thêm giá trị
            if (grouped[orderDate]) {
                grouped[orderDate].count++;
                grouped[orderDate].totalPrice += data.totalPrice || 0; // Cộng tổng tiền nếu có
            } else {
                grouped[orderDate] = {
                    count: 1,
                    totalPrice: data?.totalPrice || 0, // Khởi tạo tổng tiền cho ngày này
                };
            }
        });

        // Chuyển đổi nhóm thành mảng
        return Object.entries(grouped).map(([date, { count, totalPrice }]) => ({
            date,
            count,
            totalPrice,
        }));
    };




    return {
        orders,
        loading,
        totalElements,
        orderCountByDate,
        getTotalRevenueAndOrders
    }
}

export default useGetListOrder;