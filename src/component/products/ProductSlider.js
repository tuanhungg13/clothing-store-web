'use client'
import React, { useState, useRef } from "react"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useProductController from "@/hook/useProductController";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import ProductItem from "./productItem/ProductItem";
import SectionTitle from "../ui/SectionTitle";
import { DEFAULT_CLASSNAME } from "@/utils/helper/appCommon";
export default function ProductSlider() {
    const [params, setParams] = useState({ size: 8 })
    const {
        products = [],
        loading
    } = useProductController({ params })
    const sliderRef = useRef(null);
    const goToNext = () => {
        if (sliderRef.current) {
            sliderRef.current.slickNext();  // Chuyển đến slide tiếp theo
        }
    };

    const goToPrev = () => {
        if (sliderRef.current) {
            sliderRef.current.slickPrev();  // Quay lại slide trước
        }
    };

    return (
        <div className={`${DEFAULT_CLASSNAME}`}>
            <SectionTitle data={{ sectionTitle: "Sản phẩm nổi bật" }} />
            <div className="relative">
                <Slider
                    ref={sliderRef}
                    infinite={products?.length > 1 ? true : false}
                    slidesToShow={4}
                    slidesToScroll={1}
                    speed={500}
                    autoplay={true}
                    autoplaySpeed={4000}
                    pauseOnHover={true}
                    arrows={false}
                    dots={false}
                    responsive={[
                        {
                            breakpoint: 1024,
                            settings: {
                                slidesToShow: 4,
                                slidesToScroll: 4,
                            },
                        },
                        {
                            breakpoint: 1023,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 3
                            },
                        },
                        {
                            breakpoint: 635,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 2
                            },
                        },
                    ]}
                >
                    {products?.map((item, index) => (
                        <div className="px-4" key={`gifd-${index}`}>
                            <ProductItem product={item} />
                        </div>
                    ))}
                </Slider>
                <div className="absolute left-0 top-[35%] -translate-y-[35%] w-full flex justify-between px-2 md:px-4 lg:px-6">
                    <button onClick={goToPrev} className={`bg-black p-2 rounded-full`}>
                        <FaArrowLeft className={`text-white text-lg md:text-2xl`} /> {/* Mũi tên với kích thước bình thường */}
                    </button>
                    <button onClick={goToNext} className={`bg-black p-2 rounded-full`}>
                        <FaArrowRight className="text-white text-lg md:text-2xl" /> {/* Mũi tên với kích thước bình thường */}
                    </button>
                </div>
            </div>
        </div>

    )
}