'use client'
import React, { useEffect, useState } from "react";
import { formatCurrency } from "@/utils/helper/appCommon";
import { Button, Form, Input, Drawer, Select, Upload, Image, Spin } from "antd";
import { IoIosAddCircleOutline } from "react-icons/io";
import MarkdownEditor from "@/component/markdownEditor/MarkdownEditor";
import { FaPlus } from "react-icons/fa6";
import { TiDeleteOutline } from "react-icons/ti";
import { RiDeleteBack2Line } from "react-icons/ri";
import { message } from "antd";
import { collection, addDoc } from 'firebase/firestore';
import { db } from "@/utils/config/configFirebase"; // file firebase.js bạn đã config
import useProductController from "@/hook/useProductController";
const rowClassName = "p-2 text-start"

export default function ProductManage() {

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([])
    const [fileListUpdate, setFileListUpdate] = useState([])
    const [loading, setLoading] = useState(false)
    const [variants, setVariants] = useState([{
        color: "",
        sizes: [{
            size: "",
            quantity: 1
        }]
    }])

    const { products = [] } = useProductController()

    useEffect(() => {
        console.log("check variants:::", variants)
    }, [variants])
    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

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

    const addVariants = (addVariant, index) => {
        if (addVariant) {
            setVariants(prev => (
                [...prev,
                {
                    color: "",
                    sizes: [{ size: "", quantity: 1 }]
                }
                ]))
        }
        else {
            console.log("Adđ size")
            setVariants(prev => {
                const updated = [...prev];
                const updatedSizes = [...updated[index].sizes, { size: "", quantity: 1 }];
                updated[index] = {
                    ...updated[index],
                    sizes: updatedSizes
                };
                return updated;
            });

        }
    }

    const deleteVariant = (variantIndex, sizeIndex) => {
        if (sizeIndex != null || sizeIndex != undefined) {
            setVariants(prev => {
                const updated = [...prev];
                const updatedSizes = [...updated[variantIndex].sizes];
                updatedSizes.splice(sizeIndex, 1); // xoá phần tử tại vị trí sizeIndex
                updated[variantIndex] = {
                    ...updated[variantIndex],
                    sizes: updatedSizes
                };
                return updated;
            });
        }
        else {
            setVariants(prev => {
                const updated = [...prev];
                updated.splice(variantIndex, 1);
                console.log(updated, variantIndex)
                return updated;
            });
        }

    };

    const updateVariantInput = (variantIndex, sizeIndex, field, value) => {
        setVariants(prev => {
            const updated = [...prev];

            // Trường hợp cập nhật color
            if (field === "color") {
                updated[variantIndex] = {
                    ...updated[variantIndex],
                    color: value
                };
            }

            // Trường hợp cập nhật size hoặc quantity
            else if (field === "size" || field === "quantity") {
                const updatedSizes = [...updated[variantIndex].sizes];
                updatedSizes[sizeIndex] = {
                    ...updatedSizes[sizeIndex],
                    [field]: field === "quantity" ? parseInt(value) : value
                };
                updated[variantIndex] = {
                    ...updated[variantIndex],
                    sizes: updatedSizes
                };
            }

            return updated;
        });
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
                collectionId = null
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
                discount: discount,
                images: imagesUrl,
                variants: variants,
                description: 'Áo thun unisex form rộng, chất cotton 100%'
            });
            console.log('Document written with ID: ', docRef, docRef.id);
            setLoading(false)
            form.resetFields();
            setFileList([])
            setVariants([])
            message.success("Tạo sản phẩm thành công")
        } catch (e) {
            setLoading(false)
            console.error('Error adding document: ', e);
        }
    }


    return (
        <div className={`bg-background w-full rounded-lg`}>
            <div className="h-screen w-full p-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl lg:text-4xl font-semibold">Sản phẩm</h2>
                    <Button type="primary" className="flex items-center gap-4 btn-green-color"
                        onClick={() => { setIsOpenModal(true) }}>
                        <IoIosAddCircleOutline />
                        Tạo sản phẩm</Button>
                </div>
                <div className="hidden md:block overflow-x-auto mt-8">
                    <table className="table-auto w-full border-collapse rounded-xl">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className={`${rowClassName}`}>#</th>
                                <th className={rowClassName}>Ảnh</th>
                                <th className={rowClassName}>Tên sản phẩm</th>
                                <th className={`${rowClassName}`}>Danh mục</th>
                                <th className={`${rowClassName}`}>Giá</th>
                                <th className={`${rowClassName}`}>Số lượng</th>
                                <th className={`${rowClassName}`}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products?.length ? null :
                                <tr>
                                    <td colSpan="5">
                                        <div className="text-center text-gray-400 p-6">Không có dữ liệu</div>
                                    </td>
                                </tr>
                            }
                            {products?.map(((product, index) =>
                                <tr key={product?.id} className="border-b">
                                    <td className={`${rowClassName} text-center`}>{index + 1}</td>
                                    <td className={rowClassName}>
                                        <div>
                                            <Image src={product?.images?.[0]} className="object-contain" style={{ width: "80px", height: "auto" }} />
                                        </div>
                                    </td>
                                    <td className={rowClassName}>{product?.productName}           </td>
                                    <td className={`${rowClassName} text-right whitespace-nowrap`}>{formatCurrency(product?.price)}</td>
                                    <td className={`${rowClassName}`}></td>
                                    <td className={`${rowClassName} text-center cursor-pointer`} onClick={() => { setDetailOrder(product) }}>
                                        <div className="flex gap-4">
                                            <Button>Sửa</Button>
                                            <Button>Xóa</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Drawer title="Thêm sản phẩm"
                onClose={() => { setIsOpenModal(false) }}
                open={isOpenModal}
                width={"60vw"}
            >
                <Spin spinning={loading}>
                    <Form form={form} layout="vertical" onFinish={handleAddProducts}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 md:gap-4 lg:gap-6">
                            <Form.Item name="productName" label="Tên sản phẩm" rules={[{
                                required: true,
                                message: "Vui lòng nhập tên sản phẩm"
                            }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="price" label="Giá sản phẩm" rules={[{
                                required: true,
                                message: "Vui lòng nhập tên sản phẩm"
                            }]}>
                                <Input />
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
                                <Input disabled={true} />
                            </Form.Item>
                            <Form.Item name="collectionId" label="Bộ sưu tập sản phẩm" >
                                <Select />
                            </Form.Item>
                        </div>
                        <Form.Item label="Mô tả sản phẩm">
                            <MarkdownEditor />
                        </Form.Item>
                        <div className="mb-6">
                            <div>Loại sản phẩm</div>
                            <div className="grid grid-cols-2 gap-6 mt-2">
                                {variants?.map((variant, index) => (
                                    <div className="relative p-4 border rounded-2xl" key={`gjhfg-${index}`}>
                                        <Form.Item label="Màu sắc" layout="horizontal" className=" w-80">
                                            <Input value={variant?.color} onChange={(e) => { updateVariantInput(index, null, "color", e.target.value) }} />
                                        </Form.Item>
                                        <div>
                                            {variant?.sizes?.map((item, idx) => (
                                                <div className="flex gap-6" key={`hhf-${idx}`}>
                                                    <Form.Item label="Kích cỡ" layout="horizontal">
                                                        <Input value={item?.size} onChange={(e) => { updateVariantInput(index, idx, "size", e.target.value) }} />
                                                    </Form.Item>
                                                    <Form.Item label="Số lượng" layout="horizontal">
                                                        <Input value={item?.quantity} onChange={(e) => { updateVariantInput(index, idx, "quantity", e.target.value) }} />
                                                    </Form.Item>
                                                    <div className="cursor-pointer text-danger text-xl"
                                                        onClick={() => { deleteVariant(index, idx) }}> x </div>
                                                </div>
                                            ))}

                                            <div className="cursor-pointer text-primary"
                                                onClick={() => { addVariants(false, index) }}>+ Thêm</div>
                                        </div>
                                        <div className="absolute top-3 right-0 cursor-pointer text-danger"
                                            onClick={() => { deleteVariant(index) }}>
                                            <TiDeleteOutline size={20} />
                                        </div>
                                    </div>
                                ))}
                                <Button className="cursor-pointer text-primary my-auto w-max"
                                    onClick={() => { addVariants(true) }}>
                                    + Thêm
                                </Button>

                            </div>

                        </div>
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
                                        <FaPlus />
                                        <div>Thêm ảnh</div>
                                    </div>
                                </Upload>
                            </div>

                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" className="bg-primary" htmlType="submit">Tạo sản phẩm</Button>
                        </Form.Item>

                    </Form>
                </Spin>
            </Drawer>
        </div>
    )
}

// form.setFieldsValue({
//     shopName: landingShopConfig?.shopName || "",
//     shopPhone: ensureInternationalFormat(landingShopConfig?.shopPhone) || "",
//     shopAddress: landingShopConfig?.shopAddress || "",
//     shopFacebookPage: landingShopConfig?.shopFacebookPage || "",
//     shopMessenger: landingShopConfig?.shopMessenger || "",
//     shopZalo: landingShopConfig?.shopZalo || ""
// });