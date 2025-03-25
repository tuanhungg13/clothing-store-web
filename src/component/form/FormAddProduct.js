import React, { useEffect, useState } from "react";
import { Form, Input, Upload, Select, Button, InputNumber, Image } from "antd";
import { message } from "antd";
import { collection, addDoc } from 'firebase/firestore';
import MarkdownEditor from "../markdownEditor/MarkdownEditor";
import { LuPlus } from "react-icons/lu";
import { db } from "@/utils/config/configFirebase"; // file firebase.js bạn đã config
import { formatCurrencyInput, getBase64 } from "@/utils/helper/appCommon";
const FormAddProduct = (props) => {

    const {
        data,
        setLoading = () => { },
        fetchProducts = () => { }
    } = props

    const [fileList, setFileList] = useState([])
    const [fileListUpdate, setFileListUpdate] = useState([])
    const [form] = Form.useForm();
    const [description, setDescription] = useState("")

    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                productName: data?.productName,
                price: data?.price,
                categoryId: data?.categoryId,
                collectionId: data?.collectionId,
                priceBeforeDiscount: data?.priceBeforeDiscount,
                discount: data?.discount * 100,
                variants: data?.variants,
            });
            const imagesUrl = data?.images?.map(item => ({ imgData: item }))
            setFileListUpdate(imagesUrl)
            setDescription(data?.description)
        }
    }, [data])

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
                setFileList((prev) => [...prev, file]);
                setUpdate(true)
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



    const handleAddProducts = async () => {
        setLoading(true)
        try {
            const {
                productName,
                price,
                discount = 0,
                priceBeforeDiscount,
                categoryId = null,
                collectionId = null,
                variants = []
            } = form.getFieldValue();
            let imagesUrl = [];
            if (fileList?.length > 0) {
                imagesUrl = await handleUploadImages(fileList)
            }
            const docRef = await addDoc(collection(db, 'products'), {
                productName: productName,
                price: price,
                categoryId: categoryId,
                collectionId: collectionId,
                priceBeforeDiscount: priceBeforeDiscount,
                discount: discount / 100,
                images: imagesUrl,
                variants: variants,
                description: description
            });
            await fetchProducts()
            setLoading(false)
            form.resetFields();
            setFileList([])
            message.success("Tạo sản phẩm thành công")
        } catch (e) {
            setLoading(false)
            console.error('Error adding document: ', e);
        }
    }


    return (
        <Form form={form} layout="vertical" onFinish={handleAddProducts}
            onValuesChange={(changedValues, allValues) => {
                if (changedValues.price !== undefined) {
                    // Khi người dùng nhập giá -> cập nhật luôn priceBeforeDiscount
                    form.setFieldsValue({
                        priceBeforeDiscount: changedValues.price,
                        discount: undefined, // reset discount nếu muốn
                    });
                }

                if (changedValues.discount !== undefined) {
                    const priceBefore = allValues.priceBeforeDiscount;

                    if (priceBefore && !isNaN(changedValues.discount)) {
                        const newPrice =
                            priceBefore - (priceBefore * changedValues.discount) / 100;

                        form.setFieldsValue({
                            price: Math.round(newPrice),
                        });
                    }
                }
            }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 md:gap-4 lg:gap-6">
                <Form.Item name="productName" label="Tên sản phẩm" rules={[{
                    required: true,
                    message: "Vui lòng nhập tên sản phẩm"
                }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="price" label="Giá sản phẩm" rules={[{
                    required: true,
                    message: "Vui lòng nhập giá sản phẩm"
                }]}>
                    <InputNumber className="w-full"
                        formatter={(value) => formatCurrencyInput(value)} />
                </Form.Item>
                <Form.Item name="categoryId" label="Danh mục sản phẩm" >
                    <Select />
                </Form.Item>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 md:gap-4 lg:gap-6">
                <Form.Item name="discount" label="Giảm giá (%)">
                    <Input />
                </Form.Item>
                <Form.Item name="priceBeforeDiscount" label="Giá gốc">
                    <InputNumber disabled={true} className="w-full"
                        formatter={(value) => formatCurrencyInput(value)}
                    />
                </Form.Item>
                <Form.Item name="collectionId" label="Bộ sưu tập sản phẩm" >
                    <Select />
                </Form.Item>
            </div>
            <Form.Item label="Mô tả sản phẩm">
                <MarkdownEditor value={description} setValue={setDescription} />
            </Form.Item>
            <Form.List name="variants" rules={[{
                validator: async (_, value) => {
                    if (!value || value.length === 0) {
                        return Promise.reject(new Error("Vui lòng thêm ít nhất một biến thể"));
                    }
                }
            }]}>
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => (
                            <div key={key} className="border p-4 rounded-lg mb-4">
                                {/* Màu sắc */}
                                <Form.Item {...restField} name={[name, "color"]}
                                    label="Màu sắc"
                                    rules={[{ required: true, message: "Vui lòng nhập màu sắc" }]}>
                                    <Input placeholder="Nhập màu sắc" />
                                </Form.Item>

                                {/* Danh sách kích cỡ và số lượng */}
                                <Form.List name={[name, "sizes"]} rules={[{
                                    validator: async (_, value) => {
                                        if (!value || value.length === 0) {
                                            return Promise.reject(new Error("Vui lòng thêm ít nhất một kích cỡ"));
                                        }
                                    }
                                }]}>
                                    {(sizeFields, { add: addSize, remove: removeSize }) => (
                                        <>
                                            {sizeFields.map(({ key: sizeKey, name: sizeName, ...sizeRest }) => (
                                                <div key={sizeKey} className="flex gap-4 items-center">
                                                    {/* Kích cỡ */}
                                                    <Form.Item {...sizeRest} name={[sizeName, "size"]}
                                                        label="Kích cỡ"
                                                        rules={[{ required: true, message: "Nhập kích cỡ" }]}>
                                                        <Input placeholder="Nhập kích cỡ" />
                                                    </Form.Item>

                                                    {/* Số lượng */}
                                                    <Form.Item {...sizeRest} name={[sizeName, "quantity"]}
                                                        label="Số lượng"
                                                        rules={[
                                                            { required: true, message: "Nhập số lượng" },
                                                            { pattern: /^[0-9]+$/, message: "Phải là số" }
                                                        ]}>
                                                        <Input placeholder="Nhập số lượng" />
                                                    </Form.Item>

                                                    {/* Nút xóa kích cỡ */}
                                                    <Button onClick={() => removeSize(sizeName)} danger>Xóa</Button>
                                                </div>
                                            ))}
                                            <Button onClick={() => addSize()} type="dashed">+ Thêm kích cỡ</Button>
                                        </>
                                    )}
                                </Form.List>

                                {/* Nút xóa biến thể */}
                                <Button onClick={() => remove(name)} className="ms-4" danger>Xóa màu</Button>
                            </div>
                        ))}
                        <Button onClick={() => add()} type="dashed">+ Thêm biến thể</Button>
                    </>
                )}
            </Form.List>
            <Form.Item name='images' label="Ảnh sản phẩm">
                <div className="flex gap-4 items-start">
                    {[...fileList, ...fileListUpdate]?.map((item, index) => (
                        <div className="upload-list-item relative" key={index}>
                            <div className="ant-upload-list-item-info">
                                <span className="ant-upload-span rounded-lg">
                                    <Image src={item?.imgData || ""} alt={item?.name} width={100} height={100}
                                        className="ant-upload-list-item-image object-contain rounded-lg" />
                                </span>
                            </div>
                        </div>
                    ))}
                    <Upload
                        listType="picture-card"
                        {...propsUpload}

                    >
                        <div className="flex flex-col justify-center items-center">
                            <LuPlus />
                            <div>Thêm ảnh</div>
                        </div>
                    </Upload>
                </div>

            </Form.Item>

            <Form.Item>
                <Button type="primary" className="btn-green-color" htmlType="submit">Tạo sản phẩm</Button>
            </Form.Item>
        </Form>
    )
}

export default FormAddProduct