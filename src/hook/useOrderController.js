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
    deleteDoc
} from "firebase/firestore";
import { db, auth } from "@/utils/config/configFirebase";
import { message } from "antd";
import { useRouter } from "next/navigation";
import useCartController from "./useCartController";
const useOrderController = (props) => {
    // const { params = {} } = props;
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(null);
    const router = useRouter();
    const [defaultParams, setDefaultParams] = useState({
        size: 10,
    });
    const {
        removeMultipleCartItems = () => { }
    } = useCartController()
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async (lastDoc = null) => {
        setLoading(true);
        // try {
        //     const filterParams = { ...defaultParams, ...params };

        //     const filters = [];
        //     if (filterParams?.userId != null) {
        //         filters.push(where("userId", "==", filterParams.userId));
        //     }
        //     if (filterParams?.status != null) {
        //         filters.push(where("status", "==", filterParams.status));
        //     }

        //     const q = query(
        //         collection(db, "orders"),
        //         ...filters,
        //         orderBy("createdAt", "desc"),
        //         ...(lastDoc ? [startAfter(lastDoc)] : []),
        //         limit(filterParams?.size || 10)
        //     );

        //     const snapshot = await getDocs(q);
        //     const newOrders = snapshot.docs.map(doc => ({
        //         orderId: doc.id,
        //         ...doc.data()
        //     }));

        //     setOrders(prev => lastDoc ? [...prev, ...newOrders] : newOrders);
        //     setPage(snapshot.docs[snapshot.docs.length - 1] || null);
        // } catch (error) {
        //     console.error("❌ Lỗi khi lấy danh sách đơn hàng:", error);
        // } finally {
        //     setLoading(false);
        // }
    };

    const addOrder = async (data) => {
        setLoading(true);
        try {
            const user = auth?.currentUser;
            if (user?.uid) {
                await addDoc(collection(db, "orders"), {
                    ...data,
                    uid: user?.uid,
                    createdAt: new Date()
                });
            }
            else {
                await addDoc(collection(db, "orders"), {
                    ...data,
                    createdAt: new Date()
                });
            }

            await fetchOrders();
            removeMultipleCartItems(data?.orderItems)
            router?.push("/")
            message.success("Tạo đơn hàng thành công!");
        } catch (error) {
            console.error("❌ Thêm đơn hàng thất bại:", error);
            message.error("Thêm đơn hàng thất bại!");
        } finally {
            setLoading(false);
        }
    };

    const updateOrder = async (id, updatedData) => {
        setLoading(true);
        try {
            const orderRef = doc(db, "orders", id);
            await updateDoc(orderRef, updatedData);
            message.success("Cập nhật đơn hàng thành công!");
            await fetchOrders();
        } catch (error) {
            console.error("❌ Lỗi cập nhật đơn hàng:", error);
            message.error("Cập nhật đơn hàng thất bại!");
        } finally {
            setLoading(false);
        }
    };

    const deleteOrder = async (id) => {
        setLoading(true);
        try {
            const orderRef = doc(db, "orders", id);
            await deleteDoc(orderRef);
            message.success("Xoá đơn hàng thành công!");
            await fetchOrders();
        } catch (error) {
            console.error("❌ Lỗi xoá đơn hàng:", error);
            message.error("Xoá đơn hàng thất bại!");
        } finally {
            setLoading(false);
        }
    };

    return {
        orders,
        loading,
        fetchOrders,
        addOrder,
        updateOrder,
        deleteOrder
    };
};

export default useOrderController;
