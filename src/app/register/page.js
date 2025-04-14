"use client";
import React from "react";
import { Form, Input, Button, Typography, Spin } from "antd";
import { FaApple, FaGoogle, FaFacebookF } from "react-icons/fa";
import AuthController from "@/hook/AuthController";
import { useRouter } from "next/navigation";
import { VIETNAM_PHONE_PATTERN } from "@/utils/helper/appCommon";
import Link from "next/link";
const { Title, Text } = Typography;

const RegisterForm = () => {
    const {
        register = () => { },
        loading
    } = AuthController()
    const router = useRouter();
    const onFinish = async (values) => {
        const { name, email, password, phoneNumber } = values;
        try {
            await register({
                email,
                password,
                fullName: name,
                phoneNumber: phoneNumber || "", // thêm trường nếu bạn có
            });
        } catch (error) {
            console.error("Lỗi khi đăng ký:", error.message);
        }
    };

    return (
        <Spin spinning={loading}>
            <div className="min-h-screen flex items-center justify-center bg-gray-100 pb-6">
                <div className="bg-white p-6 rounded-xl shadow-md w-[350px]">
                    <div className="mb-6 text-center">
                        <Title level={2} className="!mb-2 !font-bold">Đăng ký</Title>
                    </div>

                    <Form layout="vertical" onFinish={onFinish}>
                        <Form.Item
                            name="name"
                            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                        >
                            <Input placeholder="Họ và tên" />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ!" }]}
                        >
                            <Input placeholder="Email" />
                        </Form.Item>
                        <Form.Item
                            name="phoneNumber"
                            rules={[
                                { required: true, message: "Vui lòng nhập số điện thoại" },
                                { pattern: VIETNAM_PHONE_PATTERN, message: "Số điện thoại không hợp lệ" }
                            ]}
                        >
                            <Input placeholder="Nhập số điện thoại" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                        >
                            <Input.Password placeholder="Mật khẩu" />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            dependencies={["password"]}
                            rules={[
                                { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error("Mật khẩu không khớp!"));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Xác nhận mật khẩu" />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="default"
                                htmlType="submit"
                                className="w-full text-white rounded-full bg-black hover:!opacity-80 hover:!bg-black hover:!border-none hover:!text-white"
                                size="large"
                            >
                                ĐĂNG KÝ
                            </Button>
                        </Form.Item>
                    </Form>

                    <div className="text-center my-4 text-gray-500">đăng nhập với</div>

                    <div className="flex justify-center gap-4 mb-4">
                        <div className="border rounded-full p-2 cursor-pointer hover:bg-gray-100">
                            <FaGoogle size={20} className="text-[#DB4437]" />
                        </div>
                        <div className="border rounded-full p-2 cursor-pointer hover:bg-gray-100">
                            <FaFacebookF size={20} className="text-[#1877F2]" />
                        </div>
                    </div>

                    <div className="flex gap-2 justify-center items-end">
                        <Text>Bạn đã có tài khoản ?</Text>
                        <Link href="/login" className="text-blue-500 text-sm">Đăng nhập</Link>
                    </div>
                </div>
            </div>
        </Spin>

    );
};

export default RegisterForm;
