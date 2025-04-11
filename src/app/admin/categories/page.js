"use client"
import { Button, Spin, Form, Input, Col, Modal, Row, Table, message, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import useCategoryController from '@/hook/useCategoryController';
import { LuPlus } from "react-icons/lu";
import { MdEdit, MdDelete } from "react-icons/md";
import { CATEGORYOPTION } from '@/utils/helper/appCommon';

const Categories = (props) => {
    const [params, setParams] = useState({})
    const {
        categories,
        loading,
        page,
        addCategory = () => { },
        updateCategory = () => { },
        deleteCategory = () => { }
    } = useCategoryController({ ...props, params });
    const [isOpenModalCategory, setIsOpenModelCategory] = useState(false)
    const [dataUpdate, setDataUpdate] = useState({})
    const [fileList, setFileList] = useState([])
    const [fileListUpdate, setFileListUpdate] = useState([])
    const [form] = Form.useForm()
    const columnsCategory = [
        {
            title: '#',
            dataIndex: 'stt',
            key: 'stt',
            align: 'center',
            width: "100px",
        },
        {
            title: "Tên danh mục",
            dataIndex: 'categoryName',
            key: 'categoryName',
        },
        {
            title: "Loại",
            dataIndex: "type",
            key: "type",
            render: (_, record) => {
                return (
                    renderStatus(record?.categoriType)
                )
            }
        },
        {
            title: "Hành động",
            dataIndex: "action",
            key: "action",
            render: (_, record) => {
                return (
                    <div className='flex gap-4 '>
                        <div className='text-warning cursor-pointer' onClick={() => {
                            handleFillFormUpdate(record)
                        }}><MdEdit size={20} /></div>
                        <div className='text-danger cursor-pointer'
                            onClick={() => { handleDeleteCategory(record?.id) }}
                        ><MdDelete size={20} /></div>
                    </div>
                )
            }
        }
    ]

    const handleFillFormUpdate = (item) => {
        setIsOpenModelCategory(true)
        setDataUpdate(item)
        form.setFieldsValue({
            categoryName: item?.categoryName,
            categoriType: item?.categoriType
        })
    }

    const handleCancel = () => {
        setIsOpenModelCategory(false)
        setDataUpdate({})
        form.resetFields()
    }

    const onFinish = async () => {
        try {
            if (Object?.keys(dataUpdate)?.length <= 0) {
                await form.validateFields()
                const {
                    categoryName = "",
                    categoriType = ""
                } = form.getFieldValue();

                await addCategory({ categoryName, categoriType })
            }
            else {
                await form.validateFields()
                const {
                    categoryName = "",
                    categoriType = ""
                } = form.getFieldValue();

                await updateCategory(dataUpdate?.id, { categoryName, categoriType })
            }
            handleCancel()
        } catch (error) {
            console.log(error)
        }
    }
    const handleDeleteCategory = async (id) => {
        try {
            await deleteCategory(id)
        } catch (error) {
            console.log(error)
        }
    }

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

    const renderStatus = (status) => {
        let label = CATEGORYOPTION?.[+status]?.label || "Chưa xác định";
        let className = `text-xs rounded border px-2 py-1 bg-opacity-10 w-max h-max `;
        switch (+status) {
            case 0:
                className += "border-success text-success bg-success";
                break;
            case 1:
                className += "border-warning text-warning bg-warning";
                break;
            default:
                break;
        }
        return <div className={className}>{label}</div>
    }
    return (
        <Row gutter={[12, 12]} className="p-4 bg-background rounded-lg w-full min-h-screen">
            <Col xs={24} sm={24} md={24} lg={24} xl={24} className='!pr-4'>
                <div className="text-3xl font-semibold flex flex-col gap-4 md:flex-row md:justify-between">
                    Danh mục
                    <div className='flex gap-6'>
                        <Select
                            options={[{ label: "Tất cả", value: 4 }, ...CATEGORYOPTION,]}
                            defaultValue={4}
                            style={{ minWidth: "100px" }}
                            onChange={(value) => {
                                setParams((prev) => ({
                                    ...prev,
                                    categoriType: value === 4 ? null : value,
                                }));
                            }}

                        />
                        <Button className='btn-green-color'
                            type='primary'
                            onClick={() => { setIsOpenModelCategory(true) }}
                        >Thêm danh mục
                        </Button>
                    </div>

                </div>
                <Table
                    dataSource={categories.map((c, index) => ({
                        ...c,
                        stt: index + 1
                    }))}
                    columns={columnsCategory}
                    loading={loading}
                    pagination={false}
                    className="mt-4"
                />
            </Col>

            <Modal title={Object?.keys(dataUpdate)?.length > 0 ? "Cập nhật danh mục" : "Thêm danh mục"}
                open={isOpenModalCategory}
                closable={!loading}
                onOk={onFinish}
                okText="Lưu"
                cancelText="Hủy"
                onCancel={handleCancel}>
                <Spin spinning={loading}>
                    <Form form={form} onFinish={onFinish} className='mt-6' layout='vertical'>
                        <Form.Item label="Loại danh mục" name="categoriType" rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên danh mục"
                            }
                        ]} >
                            <Select
                                options={CATEGORYOPTION}
                                placeholder="Chọn loại danh mục"
                            />
                        </Form.Item>
                        <Form.Item label="Tên danh mục" name="categoryName" rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên danh mục"
                            }
                        ]}>
                            <Input placeholder='Nhập tên danh mục' />
                        </Form.Item>

                    </Form>
                </Spin>

            </Modal>
        </Row>


    )
}

export default Categories;
