import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, InputNumber, Image } from "antd";
import { message } from "antd";
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import MarkdownEditor from "../markdownEditor/MarkdownEditor";
import { LuPlus } from "react-icons/lu";
import { db } from "@/utils/config/configFirebase"; // file firebase.js bạn đã config
import { formatCurrencyInput, CATEGORYOPTION } from "@/utils/helper/appCommon";
import UploadCustom from "../ui/Upload";
import useCategoryController from "@/hook/useCategoryController";
import { serverTimestamp } from 'firebase/firestore';
import useCollectionController from "@/hook/useCollectionController";
const FormAddProduct = (props) => {
    const [params, setParams] = useState({})
    const {
        data,
        setLoading = () => { },
        fetchProducts = () => { },
        isOpen
    } = props

    const {
        categories = []
    } = useCategoryController({ params })
    const {
        collections = []
    } = useCollectionController({ params })
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
                discount: data?.discount,
                variants: data?.variants,
                productType: data?.productType,
                originPrice: data?.originPrice
            });
            const imagesUrl = data?.images?.map(item => ({ imgData: item }))
            setFileListUpdate(imagesUrl)
            setDescription(data?.description)
        }
    }, [data])

    useEffect(() => {
        if (!isOpen) {
            setFileList([])
            setFileListUpdate([])
            setDescription("")
        }

    }, [isOpen])



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
                variants = [],
                productType,
                originPrice
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
                images: imagesUrl || null,
                variants: variants,
                description: description || "",
                sold: 0,
                totalRating: 5,
                productType: productType,
                originPrice: originPrice,
                createdAt: serverTimestamp()
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

    const handleUpdateProduct = async () => {
        setLoading(true);
        try {
            const {
                productName,
                price,
                discount = 0,
                priceBeforeDiscount,
                categoryId = null,
                collectionId = null,
                variants = [],
                productType,
                originPrice
            } = form.getFieldValue();

            let imagesUrl = [];

            // Nếu có ảnh mới, upload ảnh
            if (fileList?.length > 0) {
                imagesUrl = await handleUploadImages(fileList);
            }

            const productRef = doc(db, "products", data?.productId);

            await updateDoc(productRef, {
                productName: productName,
                price: price,
                categoryId: categoryId,
                collectionId: collectionId,
                priceBeforeDiscount: priceBeforeDiscount,
                discount: discount / 100,
                variants: variants,
                description: description,
                productType: productType,
                originPrice: originPrice,
                createdAt: serverTimestamp()
            });

            await fetchProducts(); // Làm mới danh sách
            form.resetFields();
            setFileList([]);
            setFileListUpdate([])
            message.success("Cập nhật sản phẩm thành công");
        } catch (e) {
            console.error("❌ Lỗi cập nhật sản phẩm:", e);
            message.error("Cập nhật thất bại");
        } finally {
            setLoading(false);
        }
    };

    const onFinish = async (values) => {
        try {
            await form.validateFields()
            if (Object?.keys(data)?.length > 0) {
                handleUpdateProduct()
            }
            else {
                handleAddProducts()
            }
        } catch (error) {
            message.error("Vui lòng điền đầy đủ thông tin")
        }

    }


    return (
        <Form form={form} layout="vertical" onFinish={onFinish}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-4 lg:gap-6">
                <Form.Item name="productName" label="Tên sản phẩm" rules={[{
                    required: true,
                    message: "Vui lòng nhập tên sản phẩm"
                }]}>
                    <Input placeholder="Nhập tên sản phẩm" />
                </Form.Item>
                <Form.Item name="originPrice" label="Giá nhập vào" rules={[{
                    required: true,
                    message: "Vui lòng nhập giá nhập hàng"
                }]}>
                    <InputNumber className="w-full" placeholder="Nhập giá nhập vào"
                        formatter={(value) => formatCurrencyInput(value)} />
                </Form.Item>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-4 lg:gap-6">

                <Form.Item name="price" label="Giá sản phẩm" rules={[{
                    required: true,
                    message: "Vui lòng nhập giá sản phẩm"
                }]}>
                    <InputNumber className="w-full" placeholder="Nhập giá bán"
                        formatter={(value) => formatCurrencyInput(value)} />
                </Form.Item>
                <Form.Item name="categoryId" label="Danh mục sản phẩm" >
                    <Select
                        allowClear
                        options={categories?.map(item => ({
                            label: item?.categoryName,
                            value: item?.categoryId,
                        }))}
                        placeholder="Chọn danh mục"
                    />
                </Form.Item>

            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-4 lg:gap-6">
                <Form.Item name="productType" label="Loại sản phẩm" rules={[{
                    required: true,
                    message: "Vui lòng chọn loại sản phẩm"
                }]}>
                    <Select
                        options={CATEGORYOPTION}
                        placeholder="Chọn loại sản phẩm"
                    />
                </Form.Item>
                <Form.Item name="collectionId" label="Bộ sưu tập sản phẩm" >
                    <Select
                        allowClear
                        options={collections?.map(item => ({
                            label: item?.collectionName,
                            value: item?.id,
                        }))}
                        placeholder="Chọn bộ sưu tập" />
                </Form.Item>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-4 lg:gap-6">
                <Form.Item name="discount" initialValue={0} label="Giảm giá (%)">
                    <Input placeholder="Giảm giá" />
                </Form.Item>
                <Form.Item name="priceBeforeDiscount" label="Giá gốc">
                    <InputNumber disabled={true} className="w-full"
                        formatter={(value) => formatCurrencyInput(value)}
                        placeholder="Giá bán khi chưa giảm"
                    />
                </Form.Item>

            </div>
            <Form.Item label="Mô tả sản phẩm">
                <MarkdownEditor value={description} setValue={setDescription} />
            </Form.Item>
            <Form.Item
                name="variants"
                rules={[
                    {
                        validator: async (_, value) => {
                            if (!value || value.length === 0) {
                                return Promise.reject(new Error("Vui lòng thêm ít nhất một biến thể"));
                            }
                            return Promise.resolve();
                        },
                    },
                ]}
            >
                <Form.List name="variants">
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
                                                            ]}
                                                            initialValue={1}>
                                                            <InputNumber placeholder="Nhập số lượng" />
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
            </Form.Item>
            <Form.Item name='images' label="Ảnh sản phẩm" className="mt-4">
                <UploadCustom fileList={fileList}
                    fileListUpdate={fileListUpdate}
                    setFileListUpdate={setFileListUpdate}
                    setFileList={setFileList}
                />

            </Form.Item>

            <Form.Item>
                <Button type="primary" className="btn-green-color" htmlType="submit">{Object?.keys(data)?.length > 0 ? "Lưu" : "Tạo"}</Button>
            </Form.Item>
        </Form>
    )
}

export default FormAddProduct