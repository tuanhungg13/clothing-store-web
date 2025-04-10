'use client'
import React, { useState, useRef } from "react"
import useProductController from "@/hook/useProductController";
import ProductItem from "./productItem/ProductItem";
import { DEFAULT_CLASSNAME } from "@/utils/helper/appCommon";
import useCategoryController from "@/hook/useCategoryController";
import { Pagination, Spin } from "antd";
import Loading from "../ui/Loading";
import NotFoundProduct from "../ui/NotFoundProduct";
import SectionTitle from "../ui/SectionTitle";
export default function ProductCategory() {
    const [params, setParams] = useState({ size: 9 })
    const [categoryParams, setCategoryParams] = useState({ size: 100 })
    const productCategoryRef = useRef(null)
    const {
        products = [],
        totalElements,
        loading
    } = useProductController({ params })
    const {
        categories = []
    } = useCategoryController({ params: categoryParams })

    const handleFilter = (categoryId) => {
        setParams(prev => ({ ...prev, categoryId: categoryId, page: 1 }))
        if (productCategoryRef.current) {
            productCategoryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    return (
        <div className={`${DEFAULT_CLASSNAME}`} ref={productCategoryRef} >
            <SectionTitle data={{ sectionTitle: "Tất cả sản phẩm" }} isHidden={false} />
            <div className=" grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:sticky top-0 self-start">
                    {/* <div className="px-6 py-3 bg-primary rounded-t-lg text-lg text-textButton text-center">Chuyên mục</div> */}
                    {categories?.length > 0 ?
                        <div className=" flex flex-col gap-2 rounded-3xl bg-bgSecondary p-4 ">
                            <div
                                className={`px-6 py-2 hover:bg-gray-100 hover:text-primary cursor-pointer rounded-lg ${!params?.categoryId ? " bg-primary text-textButton" : ""}`}
                                onClick={() => { handleFilter(null) }}>
                                Tất cả</div>
                            <div className="max-h-96 overflow-y-auto" >
                                {categories?.map((item, index) => (
                                    <div className={`px-6 py-2 hover:bg-gray-100 hover:text-primary cursor-pointer rounded-lg ${params?.categoryId === item?.categoryId ? " bg-primary text-textButton" : ""}`}
                                        key={`sdjfdh-${index}`}
                                        onClick={() => { handleFilter(item?.categoryId) }}
                                    >{item?.categoryName}</div>
                                ))}
                            </div>

                        </div> : null}
                </div>
                <div className="md:col-span-3 flex flex-col gap-6">
                    {loading ?
                        <Loading />
                        :
                        <div>
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8">
                                {products?.length > 0 ? products?.map((product, index) => (
                                    <ProductItem product={product} key={`fhsf-${index}`} />
                                ))
                                    :
                                    <div className="col-span-2 lg:col-span-3 mt-20 m-auto">
                                        <NotFoundProduct />
                                    </div>
                                }
                            </div>
                        </div>
                    }
                    <div className="w-full m-auto">
                        {totalElements > params?.size ?
                            <Pagination
                                align="center"
                                current={params?.page || 1}
                                pageSize={params?.size}
                                total={totalElements}
                                onChange={(page) => {
                                    setParams(prev => ({ ...prev, page: page }));
                                    if (productCategoryRef.current) {
                                        productCategoryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }
                                }}
                            />
                            : null}
                    </div>

                </div>
            </div>

        </div>

    )
}