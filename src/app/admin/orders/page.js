'use client'

import React, { useState } from "react";
import { Table, Spin, Select, Input } from "antd";
import useOrderController from "@/hook/useOrderController";
import dayjs from "dayjs";
import { formatCurrency, genLinkOrderDetails } from "@/utils/helper/appCommon";
import { IoEyeSharp } from "react-icons/io5";
import { MdOutlineModeEdit, MdDelete } from "react-icons/md";
import Link from "next/link";
export default function () {
    const [params, setParams] = useState({ size: 12, page: 1 })

    const {
        orders = [],
        totalElements,
        loading
    } = useOrderController({ params })


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
                    <Link href={genLinkOrderDetails(record)}>
                        <div className="text-primary"><IoEyeSharp /></div>
                    </Link>
                    <Link href={genLinkOrderDetails(record)}>
                        <div className="text-warning"><MdOutlineModeEdit /></div>
                    </Link>
                    <div className="text-danger"><MdDelete /></div>
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
            default:
                return (
                    <span className={`${baseClass} text-gray-600 border-gray-400 bg-gray-100`}>
                        Không rõ
                    </span>
                );
        }
    };

    return (
        <div className="h-full bg-background rounded-lg p-4">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-4xl">Đơn hàng</h2>
                <div className="flex items-center gap-4">
                    <Input.Search
                        style={{ width: 250 }}
                        className=""
                        // prefix={<SearchOutlined />}
                        placeholder={"Tìm kiếm đơn hàng"}
                        enterButton={true}
                        allowClear={true}
                    // onSearch={(v) => handleSearch(v)}
                    />
                    <Select style={{ width: 200 }} />
                </div>
            </div>
            <Spin spinning={loading}>
                <Table
                    dataSource={orders}
                    columns={columns}
                    loading={loading}
                    pagination={false}
                    sticky={true}
                    scroll={{ x: "max-content" }}

                />
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
