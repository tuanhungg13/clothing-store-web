'use client'
import React, { useState, useRef } from "react"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useCollectionController from "@/hook/useCollectionController";
import Link from "next/link";
import Loading from "../ui/Loading";
export default function CollectionSlider() {
    const [params, setParams] = useState({ size: 8 })
    const {
        collections = [],
        loading
    } = useCollectionController({ params })

    return (
        <div className="relative mb-10">
            {loading ? <Loading />
                :
                <Slider
                    infinite={collections?.length > 1 ? true : false}
                    slidesToShow={1}
                    slidesToScroll={1}
                    speed={500}
                    autoplay={true}
                    autoplaySpeed={4000}
                    pauseOnHover={true}
                    arrows={false}
                    dots={true}
                >
                    {collections?.map((item, index) => (
                        <div key={`dfjdg-${index}`} className="relative">
                            <div className="absolute top-[25%] left-20 flex flex-col gap-6 w-1/2 text-white">
                                <div className="z-10 relative flex items-end gap-4">
                                    <div className="text-3xl mb-2 h-10">|</div>
                                    <div className="text-3xl" style={{ lineHeight: 1.5 }}>{item?.collectionName}</div>
                                </div>
                                <div className="text-6xl z-10">{item?.content}</div>
                            </div>
                            <div className="bg-black/50 absolute top-0 left-0 w-full h-full"></div>
                            <img src={item?.collectionImg} className="w-full h-[90vh] object-top object-cover aspect-video" />
                        </div>
                    ))}
                </Slider>
            }

        </div>

    )
}