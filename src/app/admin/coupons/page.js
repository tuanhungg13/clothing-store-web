"use client";

import { useState, useEffect } from "react";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    DatePicker,
    InputNumber,
    Select,
    Checkbox,
    message,
    Spin,
    Pagination
} from "antd";
import dayjs from "dayjs";
import { PlusOutlined } from "@ant-design/icons";
import { db } from "@/utils/config/configFirebase";
import {
    collection,
    getDocs,
    doc,
    updateDoc,
    arrayUnion,
    Timestamp
} from "firebase/firestore";
import useCouponController from "@/hook/useCouponController";
import { formatCurrency, formatCurrencyInput } from "@/utils/helper/appCommon";
import { MdDeleteOutline } from "react-icons/md";

import { useSelector } from "react-redux";

export default function CouponManager() {
    const userInfo = useSelector(state => state?.user?.info)
    const [params, setParams] = useState({ page: 1, size: 12 })
    const [form] = Form.useForm();
    const [users, setUsers] = useState([]);
    const [applyToAll, setApplyToAll] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const {
        coupons,
        loading,
        totalElements,
        createCoupon = () => { },
        deleteCoupon = () => { }
    } = useCouponController({ params })
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const snapshot = await getDocs(collection(db, "users"));
            const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(usersData);
        } catch (err) {
            console.error("Lỗi khi lấy người dùng:", err);
        }
    };

    const showModal = (coupon = null) => {
        setEditingCoupon(coupon);
        setIsModalOpen(true);
        form.setFieldsValue(
            coupon
                ? {
                    ...coupon,
                    expirationDate: dayjs(coupon?.expirationDate),
                }
                : {
                    couponId: `CP${Date.now()}`,
                }
        );
    };

    const handleOk = async (values) => {
        try {
            // const values = await form.validateFields();
            // const { userIds, ...couponData } = values;
            const couponData = {
                title: values?.title,
                code: values?.code?.toUpperCase(),
                minOrder: values?.minOrder,
                discount: values?.discount,
                expirationDate: Timestamp.fromDate(new Date(values?.expirationDate))
            }
            console.log(couponData, values?.userIds)
            const response = await createCoupon({ couponData, applyToAll, selectedUsers: values?.userIds })
            if (response) { message.success("Tạo phiếu giảm giá thành công") }
            else {
                message.error("Tạo phiếu giảm giá thất bại")
            }
            form.resetFields();
            setIsModalOpen(false);
        } catch (err) {
            console.error("Lỗi khi thêm coupon:", err);
            message.error("Lỗi khi thêm coupon!");
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const columns = [
        { title: "Mã", dataIndex: "code", key: "code" },
        { title: "Tiêu đề", dataIndex: "title", key: "title" },
        {
            title: "Giảm (VNĐ)", dataIndex: "discount", key: "discount",
            render: (_, record) => (
                <div>{formatCurrency(record?.discount)}</div>
            )
        },
        {
            title: "Đơn tối thiểu", dataIndex: "minOrder", key: "minOrder",
            render: (_, record) => (
                <div>{formatCurrency(record?.minOrder)}</div>
            )
        },
        {
            title: "Ngày hết hạn",
            dataIndex: "expirationDate",
            key: "expirationDate",
            render: (_, record) => (
                <div>{record?.expirationDate ?
                    dayjs(record?.expirationDate?.toDate()).format('DD/MM/YYYY HH:mm')
                    : 'N/A'}</div>
            ),
        },
        {
            title: "",
            dataIndex: "action",
            key: "action",
            render: (_, record) => (
                userInfo?.role == "admin" &&
                <div className="text-danger cursor-pointer" onClick={() => { handleDelete(record?.couponId) }}>
                    <MdDeleteOutline size={24} />
                </div>
            ),
        },
    ];

    const handleDelete = async (couponId) => {
        try {
            await deleteCoupon(couponId)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className="p-6 bg-white rounded-xl w-full ">
            <div className="flex flex-col md:flex-row md:justify-between gap-6 md:items-center mb-4">
                <h2 className="text-2xl font-semibold">Mã giảm giá</h2>
                {userInfo?.role == "admin" &&
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                        Thêm phiếu giảm giá
                    </Button>}
            </div>

            <Table
                columns={columns}
                dataSource={coupons}
                rowKey="couponId"
                loading={loading}
                pagination={false}
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

            <Modal
                title={editingCoupon ? "Chỉnh sửa coupon" : "Thêm coupon cho người dùng"}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={"50vw"}
            >
                <Spin spinning={loading}>
                    <Form form={form} layout="vertical" onFinish={handleOk}>
                        <Form.Item name="couponId" hidden>
                            <Input />
                        </Form.Item>

                        <div className="flex gap-6 w-full items-center">
                            <Form.Item
                                className="flex-grow"
                                name="userIds"
                                label="Người dùng"
                                rules={[{ required: true, message: "Chọn ít nhất một người dùng!" }]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Chọn người dùng"
                                    allowClear
                                    options={users.map((user) => ({
                                        label: user?.email || user?.fullName || user?.id,
                                        value: user.id,
                                    }))}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Checkbox
                                    checked={applyToAll}
                                    onChange={(e) => setApplyToAll(e.target.checked)}
                                >
                                    Áp dụng cho tất cả
                                </Checkbox>
                            </Form.Item>


                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item
                                name="code"
                                label="Mã giảm giá"
                                rules={[{ required: true, message: "Nhập mã giảm giá!" }]}
                            >
                                <Input placeholder="Nhập mã giảm giá" />
                            </Form.Item>

                            <Form.Item name="title" label="Tiêu đề">
                                <Input placeholder="Nhập tiêu đề phiếu giảm giá" />
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Form.Item
                                name="discount"
                                label="Giảm (VNĐ)"
                                rules={[{ required: true, message: "Nhập phần trăm giảm giá!" }]}
                            >
                                <InputNumber formatter={(value) => formatCurrencyInput(value)} className="w-full"
                                    placeholder="Nhập số tiền muốn giảm" />
                            </Form.Item>

                            <Form.Item
                                name="minOrder"
                                label="Đơn hàng tối thiểu"
                                rules={[{ required: true, message: "Nhập đơn hàng tối thiểu!" }]}
                            >
                                <InputNumber min={0}
                                    formatter={(value) => formatCurrencyInput(value)}
                                    className="w-full" />
                            </Form.Item>
                        </div>
                        <Form.Item
                            name="expirationDate"
                            label="Ngày hết hạn"
                            rules={[{ required: true, message: "Chọn ngày hết hạn!" }]}
                        >
                            <DatePicker className="w-full" format="DD/MM/YYYY" placeholder="Chọn ngày hết hạn" />
                        </Form.Item>


                        <Form.Item className="w-full flex justify-end">
                            <Button type="primary" className="btn-green-color" htmlType="submit">Lưu</Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>
        </div>

    );
}
