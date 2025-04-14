"use client"; // Nếu bạn đang dùng App Router của Next.js
import { noImg } from "@/assets";
import { Form, Input, Button, Select, Upload, Image, Spin } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useAuthController from "@/hook/AuthController";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { getBase64, VIETNAM_PHONE_PATTERN, DEFAULT_CLASSNAME } from "@/utils/helper/appCommon";
import Link from "next/link";
const { Option } = Select;

const Profile = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([])
    const [fileListUpdate, setFileListUpdate] = useState([])
    const userInfo = useSelector(state => state?.user?.info)
    const [loading, setLoading] = useState(false)
    const {
        updateUserInfo = () => { }
    } = useAuthController()
    useEffect(() => {
        form.setFieldsValue(userInfo);
        if (userInfo?.avatar) {
            setFileListUpdate([{ imgData: userInfo?.avatar }])
        }
    }, [userInfo]);


    const propsUpload = {
        name: "files",
        showUploadList: false,
        multiple: true,
        maxCount: 20,
        fileList: fileList,
        accept: "image/*",
        beforeUpload: async (file) => {
            const fileType = file.type;
            const isJpgOrPng = fileType.includes("image");
            console.log(file)
            if (!isJpgOrPng) {
                message.error(texts?.ASSERT_IMAGE || "Không đúng định dạng ảnh");
                return false;
            }

            const isLt20M = file.size / 1024 / 1024 < 0.8;
            if (!isLt20M) {
                message.error(texts?.UPLOAD_IMAGE_800KB || "Kích thước ảnh quá lớn");
                return false
            }
            if (!file.url && !file.imgData) {
                file.imgData = await getBase64(file);
            }
            if (isJpgOrPng && isLt20M) {
                setFileListUpdate([])
                setFileList([file])
            }

            return false;
        },
    };

    const handleUploadImages = async (files) => {
        const uploadPromises = Array.from(files).map(async (file) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "unsigned_upload");
            formData.append("cloud_name", "dpn2spmzo");

            const res = await fetch("https://api.cloudinary.com/v1_1/dpn2spmzo/image/upload", {
                method: "POST",
                body: formData,
            });

            const result = await res.json();
            return result.secure_url;
        });

        const results = await Promise.all(uploadPromises);
        return results
    };

    const handleSubmit = async (values) => {
        setLoading(true)
        try {
            let imagesUrl = [];
            if (fileList?.length > 0) {
                imagesUrl = await handleUploadImages(fileList)
            }
            const data = {
                fullName: values?.fullName || "",
                phoneNumber: values?.phoneNumber || "",
                address: {
                    province: values?.address?.province || "",
                    district: values?.address?.district || "",
                    ward: values?.address?.ward || "",
                    street: values?.address?.street || ""
                },
                ...(imagesUrl.length > 0 && { avatar: imagesUrl?.[0] })
            };
            const callbackSuccess = () => {
                setFileList([])
            }
            await updateUserInfo(userInfo?.uid, data, callbackSuccess)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    return (
        <Spin spinning={loading}>
            <div className={`${DEFAULT_CLASSNAME} flex gap-4 my-6`}>
                <Link href="/">
                    <div className="text-primary">Trang chủ </div>
                </Link>
                <div>\</div>
                <div>Thông tin cá nhân</div>
            </div>
            <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mb-12">
                <div className="flex flex-col gap-6 items-center">
                    <h2 className="text-2xl font-semibold mb-4">Thông tin người dùng</h2>
                    <div>
                        {[...fileList, ...fileListUpdate]?.map((item, index) => (
                            <div className="upload-list-item relative" key={index}>
                                <div className="ant-upload-list-item-info">
                                    <span className="ant-upload-span rounded-lg">
                                        <Image src={item?.imgData || noImg?.src} alt={item?.name} width={96} height={96}
                                            className="ant-upload-list-item-image object-cover rounded-full" />
                                    </span>
                                </div>
                            </div>
                        ))}
                        <Upload
                            className="rounded-full w-24 h-24"
                            {...propsUpload}

                        >
                            {[...fileList, ...fileListUpdate]?.length > 0 ? null
                                :
                                <div className="relative cursor-pointer">
                                    <HiOutlineUserCircle className="w-24 h-24 hover:opacity-80" />
                                </div>
                            }
                        </Upload>
                    </div>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={userInfo}
                >
                    <Form.Item
                        label="Họ tên"
                        name="fullName"
                        rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                    >
                        <Input placeholder="Nhập họ và tên" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Vui lòng nhập email" },
                            { type: "email", message: "Email không hợp lệ" },
                        ]}
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        label="Số điện thoại"
                        name="phoneNumber"
                        rules={[
                            { required: true, message: "Vui lòng nhập số điện thoại" },
                            { pattern: VIETNAM_PHONE_PATTERN, message: "Số điện thoại không hợp lệ" }
                        ]}
                    >
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Form.Item
                            label="Tỉnh/TP"
                            name={['address', 'province']}
                        >
                            <Input placeholder="Nhập Tỉnh/TP" />
                        </Form.Item>
                        <Form.Item
                            label="Quận/Huyện"
                            name={['address', 'district']}
                        >
                            <Input placeholder="Nhập quận/huyện" />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Form.Item
                            label="Xã/phường"
                            name={['address', 'ward']}
                        >
                            <Input placeholder="Nhập xã/phường" />
                        </Form.Item>
                        <Form.Item
                            label="Địa chỉ chi tiết"
                            name={['address', 'street']}
                        >
                            <Input placeholder="Nhập địa chỉ chi tiết" />
                        </Form.Item>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="primary" htmlType="submit">
                            Lưu
                        </Button>
                    </div>
                </Form>
            </div>
        </Spin>

    );
};

export default Profile;
