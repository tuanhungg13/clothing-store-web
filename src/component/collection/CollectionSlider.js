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
                        <Link href="#" key={`dfjdg-${index}`}>
                            <img src={item?.collectionImg} className="w-full h-[90vh] object-cover aspect-video" />
                        </Link>
                    ))}
                </Slider>
            }

        </div>

    )
}