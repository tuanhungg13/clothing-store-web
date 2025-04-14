"use client";
import React from "react";
import { Input, Button, Form, Typography, Spin } from "antd";
import { AppleOutlined, GoogleOutlined, FacebookOutlined } from "@ant-design/icons";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";
import useAuthController from "@/hook/AuthController";
const { Title, Text } = Typography;
import Link from "next/link";
const Login = () => {
    const {
        loading,
        login = () => { }
    } = useAuthController()
    const onFinish = async (values) => {
        try {
            await login(values?.email, values?.password);

        } catch (error) {
            console.error("Lỗi đăng nhập:", error);

        }
    };

    return (
        <Spin spinning={loading}>
            <div className="min-h-screen flex items-center justify-center bg-gray-100 pb-6">
                <div className="bg-white p-6 rounded-xl shadow-md w-[350px]">
                    <div className="mb-6 text-center">
                        <Title level={2} className="!mb-2 !font-bold">Đăng nhập</Title>
                    </div>

                    <Form layout="vertical" onFinish={onFinish}>
                        <Form.Item name="email" rules={[{ required: true, message: "Vui lòng nhập email!" }]}>
                            <Input placeholder="Email" />
                        </Form.Item>

                        <Form.Item name="password" rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}>
                            <Input.Password placeholder="Mật khẩu" />
                        </Form.Item>

                        {/* <div className="text-right mb-4">
                            <Link href="#">Quên mật khẩu</Link>
                        </div> */}

                        <Form.Item>
                            <Button
                                type="default"
                                htmlType="submit"
                                className="w-full text-white rounded-full bg-black hover:!opacity-80 hover:!bg-black hover:!border-none hover:!text-white"
                                size="large"
                            >
                                ĐĂNG NHẬP
                            </Button>
                        </Form.Item>
                    </Form>

                    <div className="text-center my-4 text-gray-500">Đăng nhập với</div>

                    <div className="flex justify-center gap-4 mb-4">
                        <div className="border rounded-full p-2 cursor-pointer hover:bg-gray-100">
                            <FaGoogle size={20} className="text-[#DB4437]" />
                        </div>
                        <div className="border rounded-full p-2 cursor-pointer hover:bg-gray-100">
                            <FaFacebookF size={20} className="text-[#1877F2]" />
                        </div>
                    </div>

                    <div className="flex gap-2 justify-center items-end">
                        <Text>Bạn chưa có tài khoản ? </Text>
                        <Link href="/register" className="text-blue-500 text-sm">Đăng ký</Link>
                    </div>
                </div>
            </div>
        </Spin>

    );
};

export default Login;
