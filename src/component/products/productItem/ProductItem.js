import React from "react";
import Link from "next/link";
import { formatCurrency, genLinkProductDetail } from "@/utils/helper/appCommon";
import { noImg } from "@/assets";
const ProductItem = ({ product }) => {
    return (
        <Link href={genLinkProductDetail(product)}>
            <div className="flex flex-col gap-2 md:gap-4 cursor-pointer">
                <div className="rounded-2xl overflow-hidden">
                    <img src={product?.images?.[0] || noImg.src} className="h-64 md:h-80 lg:h-96 object-cover w-full hover:scale-105 transition-transform duration-500 ease-in-out" />
                </div>
                <div className="font-medium line-clamp-1" style={{ lineHeight: 1.5 }}>{product?.productName}</div>
                <div className="flex flex-wrap gap-4 md:gap-6">
                    <div className="font-semibold">{formatCurrency(product?.price)}</div>
                    {product?.price !== product?.priceBeforeDiscount && product?.priceBeforeDiscount &&
                        <div className="text-stroke line-through">{formatCurrency(product?.priceBeforeDiscount)}</div>}
                </div>
            </div>
        </Link>

    )
}

export default ProductItem