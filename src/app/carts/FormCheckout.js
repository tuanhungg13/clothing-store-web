"use client"
import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import { useSelector } from "react-redux";
import { Input, Form } from "antd";
import { VIETNAM_PHONE_PATTERN } from "@/utils/helper/appCommon";
const { TextArea } = Input;
const FormCheckout = (props) => {
    const { label = "",
        className = "",
        labelClassName = "",
        onSubmit = () => { },
        form
    } = props
    const userInfo = useSelector(state => state?.user?.info)
    useEffect(() => {
        form.setFieldsValue({
            customerName: userInfo?.fullName || "",
            phoneCustomer: userInfo?.phoneNumber || "",
            province: userInfo?.address?.province || "",
            district: userInfo?.address?.district || "",
            ward: userInfo?.address?.ward || "",
            address: userInfo?.address?.street || ""
        });
    }, [userInfo])
    return (
        <Form
            layout="vertical"
            className={`${className} p-6 grid`}
            // onKeyDown={handleOnKeyDown}
            form={form}
        >
            <div className={`${labelClassName} mb-6`}>{label}</div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Form.Item

                    label="Họ và tên"
                    name="customerName"
                    rules={[{ required: true, message: "Bắt buộc nhập họ và tên" }]}
                >
                    <Input placeholder="Nhập họ và tên" className="rounded-lg w-full" />
                </Form.Item>

                <Form.Item
                    label="Số điện thoại"
                    name="phoneCustomer"
                    rules={[
                        { required: true, message: "Bắt buộc nhập số điện thoại" },
                        {
                            pattern: VIETNAM_PHONE_PATTERN,
                            message: "Số điện thoại không hợp lệ!",
                        },
                    ]}
                >
                    <Input placeholder="Nhập số điện thoại" className="rounded-lg w-full" />
                </Form.Item>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Form.Item
                    label="Tỉnh/TP"
                    name="province"
                    rules={[{ required: true, message: "Bắt buộc nhập Tỉnh/TP" }]}
                >
                    <Input
                        placeholder="Nhập Tỉnh/TP"
                        className="rounded-lg w-full"
                    />
                </Form.Item>

                <Form.Item
                    label="Quận/Huyện"
                    name="district"
                    rules={[{ required: true, message: "Bắt buộc nhập Quận/Huyện" }]}
                >
                    <Input
                        placeholder="Nhập Quận/Huyện"
                        className="rounded-lg w-full"
                    />
                </Form.Item>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Form.Item
                    label="Phường/Xã"
                    name="ward"
                    rules={[{ required: true, message: "Bắt buộc nhập Phường/Xã" }]}
                >
                    <Input
                        placeholder="Nhập Phường/Xã"
                        className="rounded-lg w-full"
                    />
                </Form.Item>

                <Form.Item
                    label="Địa chỉ"
                    name="address"
                    rules={[
                        { required: true, message: "Bắt buộc nhập địa chỉ" },
                        { pattern: /^.{6,}$/, message: "Địa chỉ phải ít nhất 6 kí tự" },
                    ]}
                >
                    <Input
                        placeholder="VD: Số 89 ngõ 200 Lĩnh Nam, Hoàng Mai, Hà Nội"
                        className="rounded-lg px-2 py-1 w-full"
                    />
                </Form.Item>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <Form.Item label="Ghi chú" name="note">
                    <TextArea
                        placeholder="Ghi chú thời gian giao hàng, hoặc chỉ dẫn giao hàng..."
                        className="px-4 py-3 w-full border rounded-xl min-h-24"
                    />
                </Form.Item>
            </div>
        </Form>

    )
}
export default FormCheckout