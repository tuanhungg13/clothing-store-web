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
const useOrderController = (props) => {
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
    };


    const addOrder = async (data) => {
        setLoading(true);
        try {
            const user = auth?.currentUser;
            // Bắt đầu transaction
            await runTransaction(db, async (transaction) => {
                for (const item of data?.orderItems) {
                    const productRef = doc(db, "products", item?.productId);
                    const productDoc = await transaction.get(productRef);

                    if (!productDoc.exists()) throw new Error("Sản phẩm không tồn tại!");

                    const productData = productDoc?.data();
                    const variants = productData?.variants;

                    const variantIndex = variants?.findIndex(
                        (v) => v?.color === item?.variant?.color
                    );

                    if (variantIndex === -1) throw new Error("Không tìm thấy màu phù hợp!");

                    const sizeIndex = variants[variantIndex]?.sizes?.findIndex(
                        (s) => s?.size === item?.variant?.size
                    );

                    if (sizeIndex === -1)
                        throw new Error("Không tìm thấy size phù hợp!");

                    const currentQuantity =
                        variants[variantIndex].sizes[sizeIndex].quantity;

                    if (currentQuantity < item.quantity) {
                        throw new Error(
                            `Sản phẩm ${item?.productName} - Màu: ${item?.variant?.color} - Size: ${item?.variant?.size} chỉ còn ${currentQuantity} cái.`
                        );
                    }

                    // Trừ số lượng
                    variants[variantIndex].sizes[sizeIndex].quantity -= item?.quantity;

                    // Cập nhật lại dữ liệu sản phẩm
                    transaction.update(productRef, { variants });
                }

                // Sau khi cập nhật hàng tồn, thêm đơn hàng
                const orderData = {
                    ...data,
                    uid: user?.uid || null,
                    createdAt: new Date(),
                };

                await addDoc(collection(db, "orders"), orderData);
            });

            await fetchOrders();
            removeMultipleCartItems(data?.orderItems);
            router?.push("/");
            message.success("Tạo đơn hàng thành công!");
        } catch (error) {
            console.error("❌ Thêm đơn hàng thất bại:", error);
            message.error(error?.message || "Thêm đơn hàng thất bại!");
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
