"use client";
import { Button, Spin, Form, Input, Col, Modal, Row, Table, Select, Image } from "antd";
import React, { useState } from "react";
import useCollectionController from "@/hook/useCollectionController";
import { LuPlus } from "react-icons/lu";
import { MdEdit, MdDelete } from "react-icons/md";
import { COLLECTION_OPTION } from "@/utils/helper/appCommon";
import { noImg } from "@/assets";
import UploadCustom from "@/component/ui/Upload";
import { useSelector } from "react-redux";

const Collections = (props) => {
    const [params, setParams] = useState({});
    const {
        collections,
        loading,
        addCollection = () => { },
        updateCollection = () => { },
        deleteCollection = () => { },
    } = useCollectionController({ ...props, params });
    const [fileList, setFileList] = useState([])
    const [fileListUpdate, setFileListUpdate] = useState([])
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [dataUpdate, setDataUpdate] = useState({});
    const [form] = Form.useForm();
    const userInfo = useSelector(state => state?.user?.info)
    const columns = [
        {
            title: "#",
            dataIndex: "stt",
            key: "stt",
            align: "center",
            width: "100px",
        },
        {
            title: "Ảnh",
            dataIndex: "collectionImg",
            key: "collectionImg",
            align: "center",
            width: "100px",
            render: (_, record) => (
                <div>
                    <Image src={record?.collectionImg || noImg.src} style={{ objectFit: "cover", width: "50px", height: "50px" }} />
                </div>
            )
        },
        {
            title: "Tên bộ sưu tập",
            dataIndex: "collectionName",
            key: "collectionName",
        },
        ,
        {
            title: "Nội dung",
            dataIndex: "content",
            key: "content",
        },
        {
            title: "Loại",
            dataIndex: "collectionType",
            key: "collectionType",
            render: (_, record) => renderStatus(record?.collectionType),
        },
        {
            title: "Hành động",
            dataIndex: "action",
            key: "action",
            render: (_, record) => (
                userInfo?.role === "admin" &&
                <div className="flex gap-4">
                    <div className="text-warning cursor-pointer" onClick={() => handleFillFormUpdate(record)}>
                        <MdEdit size={20} />
                    </div>
                    <div className="text-danger cursor-pointer" onClick={() => handleDeleteCollection(record?.id)}>
                        <MdDelete size={20} />
                    </div>
                </div>
            ),
        },
    ];

    const handleFillFormUpdate = (item) => {
        setIsOpenModal(true);
        setDataUpdate(item);
        form.setFieldsValue({
            collectionName: item?.collectionName,
            collectionType: item?.collectionType,
            content: item?.content
        });
        setFileListUpdate([{ imgData: item?.collectionImg }])
    };

    const handleCancel = () => {
        setIsOpenModal(false);
        setDataUpdate({});
        form.resetFields();
        setFileList([])
        setFileListUpdate([])
    };

    const onFinish = async () => {
        try {
            await form.validateFields();

            const { collectionName = "", collectionType = "", content = "" } = form.getFieldValue();

            let imageUrls = [];

            // Upload ảnh mới nếu có
            if (fileList?.length > 0) {
                const uploadedUrls = await handleUploadImages(fileList);
                imageUrls = [...uploadedUrls];
            }

            const payload = {
                collectionName,
                collectionType,
                content,
                collectionImg: imageUrls[0] || "", // chỉ dùng 1 ảnh đại diện
            };

            if (Object.keys(dataUpdate).length === 0) {
                await addCollection(payload);
            } else {
                if (fileList?.length < 1) {
                    const data = { ...payload, collectionImg: dataUpdate?.collectionImg }
                    await updateCollection(dataUpdate?.id, data);
                }
                else {
                    await updateCollection(dataUpdate?.id, payload);
                }
            }

            handleCancel();
        } catch (error) {
            console.log("Lỗi khi submit collection:", error);
        }
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

    const handleDeleteCollection = async (id) => {
        try {
            await deleteCollection(id);
        } catch (error) {
            console.log(error);
        }
    };

    const renderStatus = (status) => {
        let label = COLLECTION_OPTION?.[+status - 1]?.label || "Chưa xác định";
        let className = `text-xs rounded border px-2 py-1 bg-opacity-10 w-max h-max `;
        switch (status) {
            case "1":
                className += "border-success text-success bg-success";
                break;
            case "2":
                className += "border-warning text-warning bg-warning";
                break;
            default:
                break;
        }
        return <div className={className}>{label}</div>;
    };

    return (
        <Row gutter={[12, 12]} className="p-4 bg-background rounded-lg w-full min-h-screen">
            <Col span={24}>
                <div className="text-3xl font-semibold flex flex-col md:flex-row gap-4  md:justify-between">
                    Bộ sưu tập sản phẩm
                    <div className="flex gap-6">
                        <Select
                            options={[{ label: "Tất cả", value: 4 }, ...COLLECTION_OPTION]}
                            defaultValue={4}
                            style={{ minWidth: "100px" }}
                            onChange={(value) => {
                                setParams((prev) => ({
                                    ...prev,
                                    collectionType: value === 4 ? null : value,
                                }));
                            }}
                        />
                        <Button className="btn-green-color" type="primary" onClick={() => setIsOpenModal(true)}>
                            Thêm bộ sưu tập
                        </Button>
                    </div>
                </div>

                <Table
                    dataSource={collections.map((item, index) => ({
                        ...item,
                        stt: index + 1,
                    }))}
                    columns={columns}
                    loading={loading}
                    pagination={false}
                    className="mt-4"
                    scroll={{ x: "max-content" }}
                />
            </Col>

            <Modal
                title={Object.keys(dataUpdate).length > 0 ? "Cập nhật bộ sưu tập" : "Thêm bộ sưu tập"}
                open={isOpenModal}
                closable={!loading}
                onOk={onFinish}
                okText="Lưu"
                cancelText="Hủy"
                onCancel={handleCancel}
            >
                <Spin spinning={loading}>
                    <Form form={form} onFinish={onFinish} layout="vertical" className="mt-6">
                        <Form.Item
                            label="Loại bộ sưu tập"
                            name="collectionType"
                            rules={[{ required: true, message: "Vui lòng chọn loại" }]}
                        >
                            <Select options={COLLECTION_OPTION} placeholder="Chọn loại" />
                        </Form.Item>
                        <Form.Item
                            label="Tên bộ sưu tập"
                            name="collectionName"
                            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                        >
                            <Input placeholder="Nhập tên bộ sưu tập" />
                        </Form.Item>
                        <Form.Item label="Mô tả ngắn"
                            name="content"
                        >
                            <Input placeholder="Nội dung" />
                        </Form.Item>
                        <UploadCustom fileList={fileList}
                            fileListUpdate={fileListUpdate}
                            setFileList={setFileList}
                            setFileListUpdate={setFileListUpdate}
                            isAddMulti={false}
                        />
                    </Form>
                </Spin>
            </Modal>
        </Row>
    );
};

export default Collections;
