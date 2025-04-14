'use client'

import React, { useState } from "react";
import { Table, Spin, Select, Input, Pagination, DatePicker } from "antd";
// import useOrderController from "@/hook/useOrderController";
import useGetListOrder from "@/hook/useGetListOrder";
import dayjs from "dayjs";
import { formatCurrency, genLinkOrderDetails } from "@/utils/helper/appCommon";
import { IoEyeSharp } from "react-icons/io5";
import { MdOutlineModeEdit, MdDelete } from "react-icons/md";
import Link from "next/link";
import { Timestamp } from "firebase/firestore";
import { useSelector } from "react-redux";

const { Option } = Select;
const { RangePicker } = DatePicker;


export default function Orders() {
    const [params, setParams] = useState({ size: 12, page: 1 })
    const userInfo = useSelector(state => state?.user?.info)
    const {
        orders = [],
        totalElements,
        loading
    } = useGetListOrder({ params })


    const columns = [
        {
            title: "Mã đơn hàng",
            dataIndex: 'orderId',
            key: 'orderId',
            render: (_, record) => {
                return (
                    <div>{record?.orderId}</div>
                )
            },
        },
        {
            title: 'Thời gian đặt',
            dataIndex: 'orderDate',
            key: 'orderDate',
            render: (_, record) => (
                <div>
                    {record?.orderDate
                        ? dayjs(record?.orderDate?.toDate()).format('DD/MM/YYYY HH:mm')
                        : 'N/A'}
                </div>
            )
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'customerName',
            key: 'customerName',
            render: (_, record) => (<div>{record?.customerName}</div>)
        },
        {
            title: 'Thanh toán',
            dataIndex: 'isPayment',
            key: 'isShowOnLanding',
            align: 'center',
            render: (_, record) => (
                <div style={{ width: "100px" }}>
                </div>

            )
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (_, record) => (
                <div className="min-w-16">
                    {formatCurrency(record?.totalPrice)}
                </div>

            )
        },
        {
            title: "Trạng thái",
            dataIndex: 'status',
            key: 'status',
            render: (_, record) => (
                <div >
                    {renderStatus(record?.status)}
                </div>
            )
        },
        {
            title: "Hành động",
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => (
                <div className="text-xl flex gap-2">
                    <Link href={genLinkOrderDetails(record) + "/view"}>
                        <div className="text-primary"><IoEyeSharp /></div>
                    </Link>
                    {(userInfo?.role === "admin" || userInfo?.role === "salestaff") &&
                        <Link href={genLinkOrderDetails(record) + "/edit"}>
                            <div className="text-warning"><MdOutlineModeEdit /></div>
                        </Link>}
                    {userInfo?.role === "admin" &&
                        <div className="text-danger"><MdDelete /></div>
                    }

                </div>

            )
        }

    ]
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
            case "RETURN":
                return (
                    <span className={`${baseClass} text-red-600 border-red-600 bg-red-100`}>
                        Trả hàng
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

    const handleDateChange = (dates) => {
        if (dates && dates.length === 2) {
            const fromDate = Timestamp.fromDate(dates[0].toDate());
            const toDate = Timestamp.fromDate(dates[1].toDate());

            setParams(prev => ({
                ...prev,
                fromDate,
                toDate
            }));
        } else {
            // Nếu clear DatePicker
            setParams(prev => ({
                ...prev,
                fromDate: null,
                toDate: null
            }));
        }
    };

    const handleSearch = (value) => {
        setParams(prev => ({ ...prev, orderId: value }))
    }

    return (
        <div className="bg-background min-h-screen w-full overflow-x-auto rounded-lg p-4">
            <div className="flex flex-col w-full lg:flex-row gap-4 lg:justify-between lg:items-center mb-10">
                <h2 className="text-3xl font-semibold">Đơn hàng</h2>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <RangePicker
                        inputReadOnly
                        onChange={handleDateChange} />
                    <Input.Search
                        style={{ width: 250 }}
                        className=""
                        // prefix={<SearchOutlined />}
                        placeholder={"Tìm kiếm đơn hàng"}
                        enterButton={true}
                        allowClear={true}
                        onSearch={(value) => { handleSearch(value) }}
                    />
                    <Select style={{ width: 200 }}
                        placeholder="Chọn trạng thái"
                        onChange={(value) => { setParams(prev => ({ ...prev, status: value })) }}
                        allowClear
                    >
                        <Option value="PENDING">Đang xử lí</Option>
                        <Option value="SHIPPED">Đang giao</Option>
                        <Option value="SUCCESS">Hoàn tất</Option>
                        <Option value="CANCEL">Hủy</Option>
                    </Select>
                </div>
            </div>
            <Spin spinning={loading}>
                <div className="w-full overflow-x-auto">
                    <Table
                        dataSource={orders}
                        columns={columns}
                        loading={loading}
                        pagination={false}
                        sticky={true}
                        scroll={{ x: "max-content" }}

                    />
                </div>

                {totalElements > params?.size ?
                    <div className="p-4 text-center">
                        <Pagination
                            align="center"
                            current={params?.page || 1}
                            pageSize={params?.size}
                            total={totalElements}
                            onChange={(page) => {
                                setParams(prev => ({ ...prev, page: page }));
                            }}
                        />
                    </div>

                    : null
                }
            </Spin>
        </div>
    )

}
