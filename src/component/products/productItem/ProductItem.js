import React from "react";
import Link from "next/link";
import { formatCurrency } from "@/utils/helper/appCommon";
const ProductItem = ({ product }) => {
    return (
        <div className="flex flex-col gap-6 cursor-pointer">
            <div className="rounded-2xl overflow-hidden">
                <img src={product?.images?.[0] || "https://i.sstatic.net/y9DpT.jpg"} className=" lg:h-96 object-cover w-full hover:scale-105 transition-transform duration-500 ease-in-out" />
            </div>
            <div className="font-medium line-clamp-2" style={{ lineHeight: 1.5 }}>{product?.productName}</div>
            <div className="flex flex-wrap gap-6">
                <div className="font-semibold">{formatCurrency(product?.price)}</div>
                {product?.price !== product?.priceBeforeDiscount && product?.priceBeforeDiscount &&
                    <div className="text-stroke line-through">{formatCurrency(product?.priceBeforeDiscount)}</div>}
            </div>
        </div>
    )
}

export default ProductItem