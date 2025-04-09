'use client'
import React, { useState, useRef } from "react"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useProductController from "@/hook/useProductController";
import ProductItem1 from "./productItem/ProductItem1";
import SectionTitle from "../ui/SectionTitle";
import { DEFAULT_CLASSNAME } from "@/utils/helper/appCommon";
import Loading from "../ui/Loading";
export default function ProductHot() {
    const [params, setParams] = useState({ size: 8 })
    const {
        products = [],
        loading
    } = useProductController({ params })

    return (
        <div className={DEFAULT_CLASSNAME}>
            <SectionTitle data={{ sectionTitle: "Đề xuất" }} />
            {loading ?
                <Loading />
                :
                <Slider
                    infinite={products?.length > 1 ? true : false}
                    slidesToShow={2}
                    slidesToScroll={1}
                    speed={500}
                    autoplay={true}
                    autoplaySpeed={4000}
                    pauseOnHover={true}
                    arrows={false}
                    dots={false}
                >
                    {products?.map((item, index) => (
                        <div className="px-4" key={`gifd-${index}`}>
                            <ProductItem1 product={item} />
                        </div>
                    ))}
                </Slider>
            }
        </div>

    )
}