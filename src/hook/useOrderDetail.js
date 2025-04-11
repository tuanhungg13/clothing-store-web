import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/config/configFirebase";
import { message } from "antd";

const useOrderDetails = ({ orderId }) => {
    const [orderDetail, setOrderDetail] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOrderDetail();
    }, [orderId]);

    const fetchOrderDetail = async () => {
        if (!orderId) return;
        setLoading(true);
        try {
            const orderRef = doc(db, "orders", orderId);
            const orderSnap = await getDoc(orderRef);
            if (orderSnap.exists()) {
                setOrderDetail({
                    orderId: orderSnap.id,
                    ...orderSnap.data(),
                });
                console.log(orderSnap.data())
            } else {
                setOrderDetail({});
                message.error("Đơn hàng không tồn tại!");
            }
        } catch (err) {
            console.error("❌ Lỗi khi lấy chi tiết đơn hàng:", err);
            message.error("Lỗi khi lấy chi tiết đơn hàng");
        } finally {
            setLoading(false);
        }
    };
    const updateDeliveryStatus = async (newStatus) => {
        if (!orderId) return;
        setLoading(true);
        try {
            const orderRef = doc(db, "orders", orderId);
            await updateDoc(orderRef, {
                deliveryStatus: newStatus,
                updatedAt: new Date(),
            });
            message.success("Cập nhật trạng thái giao hàng thành công!");
            await fetchOrderDetail(); // cập nhật lại dữ liệu mới nhất
        } catch (error) {
            console.error("❌ Lỗi cập nhật trạng thái giao hàng:", error);
            message.error("Cập nhật trạng thái giao hàng thất bại!");
        } finally {
            setLoading(false);
        }
    };

    return {
        orderDetail,
        loading,
        fetchOrderDetail,
        updateDeliveryStatus
    };
};

export default useOrderDetails;
