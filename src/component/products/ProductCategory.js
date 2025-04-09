'use client'
import React, { useState } from "react"
import useProductController from "@/hook/useProductController";
import ProductItem from "./productItem/ProductItem";
import SectionTitle from "../ui/SectionTitle";
import { DEFAULT_CLASSNAME } from "@/utils/helper/appCommon";
import Loading from "../ui/Loading";
export default function ProductCategory() {
    const [params, setParams] = useState({ size: 8 })
    const {
        products = [],
        loading
    } = useProductController({ params })


    return (
        <div className={`${DEFAULT_CLASSNAME}`}>
            <SectionTitle data={{ sectionTitle: "Sản phẩm" }} />

            {loading ?
                <Loading />
                :
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                    {products?.map((item, index) => (
                        <ProductItem product={item} key={`gjdk-${index}`} />
                    ))}
                </div>
            }
        </div>

    )
}