'use client'

import React, { useEffect, useState, useRef } from "react";
import { Card, Input, Select, Button, Table, Spin, Modal, message } from "antd";
import { FiCalendar, FiSave } from "react-icons/fi";
import { FaUserAlt, FaShippingFast } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import useOrderDetails from "@/hook/useOrderDetail";
import dayjs from "dayjs";
import { formatCurrency, mappingStatus } from "@/utils/helper/appCommon";
import { noImg } from "@/assets";
import OrderPrintView from "@/component/print/OrderPrintView";
import { useReactToPrint } from "react-to-print";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
const { Option } = Select;


const columns = [
    {
        title: "Ảnh",
        dataIndex: "image",
        render: (_, record) => (
            <div>
                <img src={record?.image || noImg?.src} className="w-20 h-20 object-cover rounded-lg" />
            </div>
        ),
    },
    {
        title: "Tên sản phẩm",
        dataIndex: "productName",
        render: (_, record) => (
            <div>{record?.productName}</div>
        )
    },
    {
        title: "Phân loại",
        dataIndex: "variant",
        render: (_, record) => (
            <div>Màu sắc: {record?.variant?.color} | Kích cỡ: {record?.variant?.size}</div>
        )
    },
    {
        title: "Số lượng",
        dataIndex: "quantity",
        render: (_, record) => (
            <div>{record?.quantity}</div>
        )
    },
    {
        title: "Thành tiền",
        dataIndex: "total",
        render: (_, record) => (
            <div>{formatCurrency(record?.price * record?.quantity)}</div>
        ),
    },
];

export default function OrderDetails(props) {
    const orderId = props?.params?.orderId
    const isEdit = props?.params?.isEdit
    const [statusChange, setStatusChange] = useState(null)
    const printRef = useRef();
    const [openPrintPreview, setOpenPrintPreview] = useState(false);
    const userInfo = useSelector(state => state?.user?.info)
    const router = useRouter()


    const {
        orderDetail = {},
        loading,
        updateDeliveryStatus = () => { }
    } = useOrderDetails({ orderId })

    useEffect(() => {
        setStatusChange(orderDetail?.status)
    }, [orderDetail])

    const renderStatus = (status) => {
        let baseClass =
            "px-3 py-1 rounded-lg text-sm font-medium border inline-block min-w-[90px] text-center";

        switch (status) {
            case "PENDING":
                return (
                    <span className={`${baseClass} text-yellow-600 border-yellow-600 bg-yellow-100`}>
                        Đang xử lí
                    </span>
                );
            case "SHIPPED":
                return (
                    <span className={`${baseClass} text-blue-600 border-blue-600 bg-blue-100`}>
                        Đang giao
                    </span>
                );
            case "SUCCESS":
                return (
                    <span className={`${baseClass} text-green-600 border-green-600 bg-green-100`}>
                        Hoàn tất
                    </span>
                );
            case "CANCEL":
                return (
                    <span className={`${baseClass} text-red-600 border-red-600 bg-red-100`}>
                        Hủy
                    </span>
                );
            default:
                return (
                    <span className={`${baseClass} text-gray-600 border-gray-400 bg-gray-100`}>
                        Không rõ
                    </span>
                );
        }
    };

    const handUpdate = async () => {
        try {
            await updateDeliveryStatus(statusChange, orderDetail?.orderItems)
        } catch (error) {
            console.log(error)
        }
    }

    const handleTotal = () => {
        return orderDetail?.orderItems?.reduce((sum, item) => {
            return sum + (item?.price * item?.quantity);
        }, 0);
    }

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: `HoaDon_${orderDetail?.orderId}`,
        onAfterPrint: () => {
            // ✅ In xong rồi mới đóng
            setOpenPrintPreview(false);
        },
    });
    return (
        <div className="md:p-6 bg-gray-50 w-full overflow-hidden min-h-screen space-y-6">
            <h2 className="text-3xl font-semibold">Orders Details</h2>
            <div className="flex gap-4">
                <Link href={"/admin/orders"}>
                    <div className="text-primary">Đơn hàng</div>
                </Link>
                <div>\</div>
                <div>Chi tiết đơn hàng</div>
            </div>
            <div className="w-full">
                <Spin spinning={loading} >
                    <div className="rounded-xl shadow p-2 md:p-6 border rounded-xl bg-background">
                        <div className="flex flex-col gap-6">
                            <div className="bg-white px-4 py-2 flex flex-wrap items-center justify-between gap-4">
                                <div className="text-lg flex flex-wrap gap-2 md:gap-4 lg:gap-8 font-semibold">
                                    Mã đơn hàng: <span className="text-blue-600">{orderDetail?.orderId}</span>
                                    <span>{renderStatus(orderDetail?.status)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 border p-2 rounded-lg">
                                    <FiCalendar />
                                    <span>{orderDetail?.orderDate
                                        ? dayjs(orderDetail?.orderDate?.toDate()).format('DD/MM/YYYY HH:mm')
                                        : 'N/A'}</span>
                                </div>
                                {(orderDetail?.status === "CANCEL" || orderDetail?.status === "RETURN" || orderDetail?.status === "SUCCESS") ?
                                    null :
                                    <div className="flex flex-col md:flex-row gap-2">
                                        <Select
                                            disabled={isEdit === "view" ? true : false}
                                            value={statusChange}
                                            className="w-40"
                                            placeholder="Chọn trạng thái"
                                            onChange={(value) => { setStatusChange(value) }}
                                        >
                                            {orderDetail?.status === "SHIPPED" ? null : <Option value="PENDING">Đang xử lí</Option>}
                                            {(userInfo?.role == "admin" || userInfo?.role == "storekeeper") ? <Option value="SHIPPED">Đang giao</Option> : null}
                                            {orderDetail?.status === "SHIPPED" ? null : <Option value="CANCEL">Hủy</Option>}
                                            {(orderDetail?.status === "SHIPPED" && (userInfo?.role === "admin" || userInfo?.role === "storekeeper")) && (
                                                <Option value="RETURN">Trả hàng</Option>
                                            )}
                                            {(userInfo?.role == "admin" || userInfo?.role == "salestaff") ? <Option value="SUCCESS">Hoàn tất</Option> : null}
                                        </Select>
                                        <Button icon={<FiSave />}
                                            onClick={handUpdate}
                                            disabled={isEdit === "view" ? true : false}
                                        >Lưu</Button>
                                        <Button
                                            disabled={isEdit === "view" ? true : false}
                                            onClick={() => setOpenPrintPreview(true)} // mở modal
                                        >
                                            In đơn hàng
                                        </Button>

                                    </div>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card >
                                    <div className="flex items-center gap-3 mb-2 text-gray-600">
                                        <FaUserAlt />
                                        <span className="font-medium">Khách hàng</span>
                                    </div>
                                    <div className="text-sm text-gray-500 space-y-1">
                                        <p>Họ và tên: {orderDetail?.customerName}</p>
                                        {/* <p>Email: {orderDetail?.}</p> */}
                                        <p>Số điện thoại: {orderDetail?.phoneCustomer}</p>
                                    </div>
                                    {/* <Button type="primary" className="mt-4 w-full">View profile</Button> */}
                                </Card>

                                <Card >
                                    <div className="flex items-center gap-3 mb-2 text-gray-600">
                                        <FaShippingFast />
                                        <span className="font-medium">Thông tin giao hàng</span>
                                    </div>
                                    <div className="text-sm text-gray-500 space-y-1">
                                        <p>Phương thức thanh toán: Thanh toán khi nhận hàng</p>
                                        <p>Phương thức vận chuyển: {orderDetail?.shippingPrice == 100000 ? "Giao hàng hỏa tốc" : "Giao hàng thường"}</p>
                                        <p>Trạng thái: {mappingStatus[orderDetail?.status]}</p>
                                    </div>
                                </Card>

                                <Card >
                                    <div className="flex items-center gap-3 mb-2 text-gray-600">
                                        <MdLocationOn />
                                        <span className="font-medium">Địa chỉ giao hàng</span>
                                    </div>
                                    <div className="text-sm text-gray-500 space-y-1">
                                        <p>Địa chỉ: {orderDetail?.address}, {orderDetail?.ward}, {orderDetail?.district}, {orderDetail?.province}</p>
                                    </div>
                                </Card>
                            </div>
                            <Card >
                                <p className="font-semibold mb-2">Note</p>
                                <Input.TextArea placeholder="Type some notes"
                                    rows={3} value={orderDetail?.note}
                                    disabled={true} />
                            </Card>
                        </div>
                    </div>

                    <Card className="rounded-xl shadow mt-8">
                        <div className="font-semibold text-lg mb-4">Products</div>
                        <Table
                            columns={columns}
                            dataSource={orderDetail?.orderItems}
                            pagination={false}
                            className="mb-6"
                            scroll={{ x: "max-content" }}

                        />
                        <div className="flex flex-col gap-2 items-end text-sm text-gray-700">
                            <div className="flex gap-8">
                                <div className="w-28 text-start">Thành tiền</div>
                                <div className="w-28 text-end">{formatCurrency(handleTotal())}
                                </div>
                            </div>
                            <div className="flex gap-8">
                                <div className="w-28 text-start">Giảm giá</div>
                                <div className="w-28 text-end">{formatCurrency(orderDetail?.discount)}</div>
                            </div>
                            <div className="flex gap-8">
                                <div className="w-28 text-start">Phí vận chuyển</div>
                                <div className="w-28 text-end ">{formatCurrency(orderDetail?.shippingPrice)}</div>
                            </div>
                            <div className="flex gap-8 font-bold text-base text-black">
                                <div className="w-28 text-start">Tổng tiền</div>
                                <div className="w-28 text-end">{formatCurrency(orderDetail?.totalPrice)}</div>
                            </div>
                        </div>
                    </Card>
                </Spin>
            </div>

            <Modal
                open={openPrintPreview}
                onCancel={() => setOpenPrintPreview(false)}
                onOk={() => {
                    if (printRef.current) {
                        handlePrint();
                    } else {
                        console.warn("Không tìm thấy ref để in");
                    }
                }}

                title="Xem trước hóa đơn"
                width={800}
                okText="In"
                cancelText="Hủy"
            >
                <OrderPrintView order={orderDetail} ref={printRef} />
            </Modal>

        </div>
    );
}
