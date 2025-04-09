import React from "react"
import { formatCurrency } from "@/utils/helper/appCommon"
const ProductItem1 = ({ product }) => {
    return (
        <div className="flex border-b border-stroke items-center border border-gray6 shadow-sm rounded-2xl">
            <div className="mb-auto overflow-hidden rounded-s-2xl">
                <img src={product?.images?.[0] || "https://i.sstatic.net/y9DpT.jpg"} className=" hover:scale-105 transition-transform duration-500 ease-in-out w-28 h-28 object-cover" />
            </div>
            <div className="ms-4 flex-1">
                <div className="text-lg">{product?.productName}</div>
                <div className="flex flex-wrap gap-6 mt-2">
                    <div className="font-semibold">{formatCurrency(product?.price)}</div>
                    {product?.price !== product?.priceBeforeDiscount && product?.priceBeforeDiscount &&
                        <div className="text-stroke line-through">{formatCurrency(product?.priceBeforeDiscount)}</div>}
                </div>
            </div>
        </div>
    )
}
export default ProductItem1