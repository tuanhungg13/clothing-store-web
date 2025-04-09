'use client'
import React, { useState } from "react"
import useCollectionController from "@/hook/useCollectionController";
import Link from "next/link";
import { DEFAULT_CLASSNAME } from "@/utils/helper/appCommon";
import SectionTitle from "../ui/SectionTitle";
import Loading from "../ui/Loading";
export default function CollectionHot() {
    const [params, setParams] = useState({ size: 3 })
    const {
        collections = [],
        loading
    } = useCollectionController({ params })

    return (
        <div className={DEFAULT_CLASSNAME}>
            <SectionTitle data={{ sectionTitle: "Bộ sưu tập hot" }} />
            {loading ?
                <Loading />
                :
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {collections?.map((item, index) => (
                        <div>
                            <img src={item?.collectionImg} className="w-full object-cover rounded-3xl aspect-video" />
                        </div>
                    ))}
                </div>
            }
        </div>

    )
}