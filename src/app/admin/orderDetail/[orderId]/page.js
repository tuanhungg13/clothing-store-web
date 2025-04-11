'use client'

import React, { useEffect, useState } from "react";
import { Card, Input, Select, Button, Table, Checkbox } from "antd";
import { FiCalendar, FiSave } from "react-icons/fi";
import { FaUserAlt, FaShippingFast } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import useOrderDetails from "@/hook/useOrderDetail";
import dayjs from "dayjs";
import { formatCurrency } from "@/utils/helper/appCommon";
import { noImg } from "@/assets";
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
    const [statusChange, setStatusChange] = useState(null)
    const {
        orderDetail = {},
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
    return (
        <div className="p-6 bg-gray-50 min-h-screen space-y-6">
            <h2 className="text-xl font-bold">Orders Details</h2>
            <Card className="rounded-xl shadow ">
                <div className="flex flex-col gap-6">
                    <div className="bg-white p-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="text-lg font-semibold">
                            Mã đơn hàng: <span className="text-blue-600">{orderDetail?.orderId}</span>
                            <span className="ms-8">{renderStatus(orderDetail?.status)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <FiCalendar />
                            <span>{orderDetail?.orderDate
                                ? dayjs(orderDetail?.orderDate?.toDate()).format('DD/MM/YYYY HH:mm')
                                : 'N/A'}</span>
                        </div>
                        <div className="flex gap-2">
                            <Select
                                value={statusChange}
                                className="w-40"
                                placeholder="Chọn trạng thái"
                                onChange={() => { setStatusChange(value) }}
                            >
                                <Option value="PENDING">Đang xử lí</Option>
                                <Option value="SHIPPED">Đang giao</Option>
                                <Option value="SUCCESS">Hoàn tất</Option>
                                <Option value="CANCEL">Hủy</Option>
                            </Select>
                            <Button icon={<FiSave />}>Lưu</Button>
                        </div>
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
                            <Button type="primary" className="mt-4 w-full">View profile</Button>
                        </Card>

                        <Card >
                            <div className="flex items-center gap-3 mb-2 text-gray-600">
                                <FaShippingFast />
                                <span className="font-medium">Thông tin giao hàng</span>
                            </div>
                            <div className="text-sm text-gray-500 space-y-1">
                                <p>Shipping: { }</p>
                                <p>Phương thức thanh toán: Thanh toán khi nhận hàng</p>
                                <p>Trạng thái: {orderDetail?.status}</p>
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
                        <Input.TextArea placeholder="Type some notes" rows={3} value={orderDetail?.note} />
                    </Card>
                </div>



            </Card>



            <Card className="rounded-xl shadow">
                <div className="font-semibold text-lg mb-4">Products</div>
                <Table
                    columns={columns}
                    dataSource={orderDetail?.orderItems}
                    pagination={false}
                    className="mb-6"
                />
                <div className="text-right space-y-1 text-sm text-gray-700">
                    <p>Thành tiền : {orderDetail?.totalPirce}</p>
                    <p>Giảm giá: {orderDetail?.discount || "0đ"}</p>
                    <p>Phí vận chuyển: 0đ</p>
                    <p className="font-bold text-base text-black">Tổng tiền: {orderDetail?.totalPirce} 100đ</p>
                </div>
            </Card>
        </div>
    );
}
