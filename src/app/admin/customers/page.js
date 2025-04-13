'use client'

import React, { useState } from "react";
import { Table, Spin, Select, Input, Pagination, DatePicker, Drawer, Form, Row, Button, Col, message } from "antd";
// import useOrderController from "@/hook/useOrderController";
import useGetListOrder from "@/hook/useGetListOrder";
import dayjs from "dayjs";
import { formatCurrency, genLinkOrderDetails, formatAddress } from "@/utils/helper/appCommon";
import { IoEyeSharp } from "react-icons/io5";
import { MdOutlineModeEdit, MdDelete } from "react-icons/md";
import Link from "next/link";
import { Timestamp } from "firebase/firestore";
import useCustomerController from "@/hook/useCustomerController";
import { useSelector } from "react-redux";
import { useForm } from "antd/es/form/Form";
const { Option } = Select;
const { RangePicker } = DatePicker;


export default function Customers() {
    const [params, setParams] = useState({ size: 12, page: 1 })
    const userInfo = useSelector(state => state?.user?.info)
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [form] = useForm()
    const [dataUpdateUser, setDataUpdateUser] = useState({})
    const [isUpdate, setIsUpdate] = useState(false)
    const {
        customers = [],
        totalElements,
        updateUserRole = () => { },
        loading
    } = useCustomerController({ params })

    console.log(userInfo)
    const columns = [
        {
            title: "STT",
            dataIndex: 'index',
            key: 'index',
            render: (_, record, index) => {
                return (
                    <div className="min-w-6">{index + 1}</div>
                )
            },
        },
        {
            title: 'Tên người dùng',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (_, record) => (
                <div className="min-w-28">
                    {record?.fullName}
                </div>
            )
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            render: (_, record) => (<div className="min-w-28">{record?.phoneNumber}</div>)
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            render: (_, record) => (<div className="min-w-36">{formatAddress(record?.address)}</div>)
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: (_, record) => (
                <div className="min-w-16">
                    {renderRole(record?.role)}
                </div>

            )
        },
        {
            title: "Hành động",
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => (
                <div className="text-xl flex gap-2">
                    <div className="text-primary cursor-pointer" onClick={() => handleView(record)}><IoEyeSharp /></div>
                    <div className="text-warning cursor-pointer" onClick={() => handleEdit(record)}><MdOutlineModeEdit /></div>
                    <div className="text-danger cursor-pointer"><MdDelete /></div>
                </div>

            )
        }

    ]
    const renderRole = (role) => {
        let baseClass =
            "px-3 py-1 rounded-lg text-sm font-medium border inline-block min-w-[90px] text-center";

        switch (role) {
            case "admin":
                return (
                    <span className={`${baseClass} text-red-600 border-red-600 bg-red-100`}>
                        Chủ cửa hàng
                    </span>
                );
            case "storekeeper":
                return (
                    <span className={`${baseClass} text-blue-600 border-blue-600 bg-blue-100`}>
                        Nhân viên kho
                    </span>
                );
            case "salestaff":
                return (
                    <span className={`${baseClass} text-green-600 border-green-600 bg-green-100`}>
                        Nhân viên bán hàng
                    </span>
                );
            default:
                return (
                    <span className={`${baseClass} text-gray-600 border-gray-400 bg-gray-100`}>
                        Người dùng
                    </span>
                );
        }
    };


    const handleSearch = (value) => {
        setParams(prev => ({ ...prev, keyword: value }))
    }

    const handleEdit = (record) => {
        setIsUpdate(true)
        setDataUpdateUser(record);
        setIsOpenDrawer(true);  // Mở Drawer để chỉnh sửa người dùng
    };

    const handleView = (record) => {
        setIsUpdate(false)
        setDataUpdateUser(record);
        setIsOpenDrawer(true);
    };

    const handleDrawerClose = () => {
        setIsOpenDrawer(false);  // Đóng Drawer
        setDataUpdateUser(null);  // Reset dữ liệu khi đóng
    };

    const handleSubmit = async (values) => {
        console.log(dataUpdateUser?.uid, values?.role)
        const response = await updateUserRole(dataUpdateUser?.uid, values?.role)
        if (response) {
            setIsOpenDrawer(false);  // Đóng drawer sau khi lưu dữ liệu
            message.success("Cập nhật người dùng thành công")
        }
        else {
            message.error("Cập nhập người dùng thất bại")
        }
    };

    return (
        <div className="bg-background min-h-screen w-full overflow-x-auto rounded-lg p-4">
            <div className="flex flex-col w-full lg:flex-row gap-4 lg:justify-between lg:items-center mb-10">
                <h2 className="text-3xl font-semibold">Người dùng</h2>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <Input.Search
                        style={{ width: 250 }}
                        className=""
                        // prefix={<SearchOutlined />}
                        placeholder={"Tìm kiếm người dùng"}
                        enterButton={true}
                        allowClear={true}
                        onSearch={(value) => { handleSearch(value) }}
                    />
                    <Select style={{ width: 200 }}
                        placeholder="Chọn vai trò"
                        onChange={(value) => { setParams(prev => ({ ...prev, role: value })) }}
                        allowClear
                    >
                        <Option value="user">Người dùng</Option>
                        <Option value="admin">Chủ cửa hàng</Option>
                        <Option value="storekeeper ">Nhân viên kho</Option>
                        <Option value="salestaff">Nhân viên bán hàng</Option>
                    </Select>
                </div>
            </div>
            <Spin spinning={loading}>
                <div className="w-full overflow-x-auto">
                    <Table
                        dataSource={customers}
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

            <Drawer
                title="Chỉnh sửa người dùng"
                width={"50vw"}
                onClose={handleDrawerClose}
                open={isOpenDrawer}
                footer={null}
            >
                <Form
                    disabled={!isUpdate}
                    form={form}
                    initialValues={dataUpdateUser}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Form.Item
                            label="Tên người dùng"
                            name="fullName"
                        >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item
                            label="Số điện thoại"
                            name="phoneNumber"
                        >
                            <Input disabled />
                        </Form.Item>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Form.Item
                            label="Email"
                            name="email"
                        >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item
                            label="Vai trò"
                            name="role"
                            rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
                        >
                            <Select disabled={!(isUpdate && userInfo?.role === "admin")} >
                                <Option value="user">Người dùng</Option>
                                {/* <Option value="admin">Chủ cửa hàng</Option> */}
                                <Option value="storekeeper">Nhân viên kho</Option>
                                <Option value="salestaff">Nhân viên bán hàng</Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Form.Item
                            label="Tỉnh/TP"
                            name={['address', 'province']}
                        >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item
                            label="Quận/Huyện"
                            name={['address', 'district']}
                        >
                            <Input disabled />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Form.Item
                            label="Xã phường"
                            name={['address', 'ward']}
                        >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item
                            label="Địa chỉ chi tiết"
                            name={['address', 'street']}
                        >
                            <Input disabled />
                        </Form.Item>
                    </div>

                    <Form.Item>
                        <Row justify="end">
                            <Col span={6}>
                                <Button type="primary" htmlType="submit" block disabled={userInfo?.role != "admin"}>
                                    Lưu
                                </Button>
                            </Col>
                        </Row>
                    </Form.Item>

                </Form>
            </Drawer>
        </div>
    )

}
