'use client'
import React, { useEffect, useState } from "react";
import { formatCurrency } from "@/utils/helper/appCommon";
import { Button, Form, Input, Drawer, Select, Upload, Image, Spin, Pagination } from "antd";
import { IoIosAddCircleOutline } from "react-icons/io";
import useProductController from "@/hook/useProductController";
import FormAddProduct from "@/component/form/FormAddProduct";
import { CATEGORYOPTION } from "@/utils/helper/appCommon";
import { useSelector } from "react-redux";
import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";

const rowClassName = "py-2 px-4 text-center whitespace-nowrap"

export default function ProductManage() {
    const userInfo = useSelector(state => state?.user?.info)
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [dataProduct, setDataProduct] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [params, setParams] = useState({ page: 1, size: 12 })
    const {
        products = [],
        fetchProducts = () => { },
        deleteProduct = () => { },
        loading,
        totalElements
    } = useProductController({ params })
    const getTotalQuantity = (variants) => {
        return variants.reduce((total, variant) => {
            const variantTotal = variant.sizes.reduce((sum, size) => sum + Number(size.quantity || 0), 0);
            return total + variantTotal;
        }, 0);
    };

    const handleOpenModalEdit = (item) => {
        setDataProduct(item)
        setIsOpenModal(true)
    }

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
    const handleDeleteProduct = async (item) => {
        try {
            await deleteProduct(item?.productId)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={`bg-background w-full min-h-screen rounded-lg`}>
            <div className="h-screen w-full p-4">
                <div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
                    <h2 className="text-3xl font-semibold">Sản phẩm</h2>
                    <div className="flex gap-6">
                        <Select
                            options={[{ label: "Tất cả", value: 2 }, ...CATEGORYOPTION,]}
                            defaultValue={2}
                            style={{ minWidth: "100px" }}
                            onChange={(value) => {
                                setParams((prev) => ({
                                    ...prev,
                                    productType: value === 2 ? null : value,
                                    page: 1
                                }));
                            }}

                        />
                        {(userInfo?.role == "admin" || userInfo?.role == "storekeeper") &&
                            <Button type="primary" className="flex items-center gap-4 btn-green-color"
                                onClick={() => { setIsOpenModal(true) }}>
                                <IoIosAddCircleOutline />
                                Tạo sản phẩm</Button>}
                    </div>

                </div>
                <div className="overflow-x-auto mt-8">
                    <table className="table-auto w-full border-collapse rounded-xl">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className={`${rowClassName}`}>#</th>
                                <th className={`${rowClassName} text-start`}>Ảnh</th>
                                <th className={`${rowClassName} max-w-80 text-start`}>Tên sản phẩm</th>
                                <th className={`${rowClassName}`}>Giá</th>
                                <th className={`${rowClassName}`}>Số lượng</th>
                                <th className={`${rowClassName}`}>Loại sản phẩm</th>
                                <th className={`${rowClassName}`}>Danh mục</th>
                                <th className={`${rowClassName}`}>Bộ sưu tập</th>
                                <th className={`${rowClassName}`}>Hành động</th>
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
                                <tr key={product?.productId} className="border-b">
                                    <td className={`${rowClassName} text-center`}>{index + 1}</td>
                                    <td className={`${rowClassName} text-start`}>
                                        <div>
                                            <Image src={product?.images?.[0]} className="object-contain" style={{ width: "80px", height: "auto" }} />
                                        </div>
                                    </td>
                                    <td className={`${rowClassName} !text-wrap text-start`}>{product?.productName}</td>
                                    <td className={`${rowClassName} whitespace-nowrap`}>{formatCurrency(product?.price)}</td>
                                    <td className={`${rowClassName} ${getTotalQuantity(product?.variants) <= 0 ? "text-danger" : (getTotalQuantity(product?.variants)) > 30 ? "text-primary" : "text-warning"}`}>{getTotalQuantity(product?.variants)}</td>
                                    <td className={`${rowClassName}`}>{renderStatus(product?.productType)}</td>
                                    <td className={`${rowClassName}`}>{product?.category?.categoryName}</td>
                                    <td className={`${rowClassName} !text-wrap`}>{product?.collection?.collectionName}</td>
                                    <td className={`${rowClassName} cursor-pointer`}>
                                        <div className="flex gap-4 justify-center">
                                            {(userInfo?.role == "admin" || userInfo?.role == "storekeeper") &&
                                                <div className="cusor-pointer text-warning " onClick={() => { handleOpenModalEdit(product) }}><MdOutlineEdit size={24} /></div>}
                                            {userInfo?.role == "admin" &&
                                                <div className="cusor-pointer text-danger " onClick={() => { handleDeleteProduct(product) }}><MdOutlineDelete size={24} /></div>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-8">
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
            </div>

            <Drawer title={Object?.keys(dataProduct)?.length > 0 ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
                onClose={() => {
                    setIsOpenModal(false)
                    setDataProduct({})
                }}
                open={isOpenModal}
                width={"60vw"}
            >
                <Spin spinning={loading}>
                    <FormAddProduct setLoading={setIsLoading}
                        fetchProducts={fetchProducts}
                        data={dataProduct}
                        isOpen={isOpenModal}
                    />
                </Spin>
            </Drawer>
        </div>
    )
}

