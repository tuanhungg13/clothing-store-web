import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency, genLinkProductDetail } from "@/utils/helper/appCommon";
import { noImg } from "@/assets";
const ProductItem = ({ product }) => {

    const [stock, setStock] = useState(0);
    useEffect(() => {
        // console.log(product)
        if (product?.variants) {
            const stock = getTotalQuantity(product?.variants)
            console.log(stock)
            setStock(stock);
        }
    }, [product])

    const getTotalQuantity = (variants) => {
        return variants.reduce((total, variant) => {
            const variantTotal = variant?.sizes?.reduce((sum, size) => sum + Number(size?.quantity || 0), 0);
            return total + variantTotal;
        }, 0);
    };

    return (
        <Link href={genLinkProductDetail(product)} className="cursor-pointer">
            <div className="flex flex-col gap-2 md:gap-4 ">
                <div className="rounded-2xl overflow-hidden relative">
                    {stock <= 0 && <div className="absolute top-5 left-0 rounded-r-xl px-2 bg-gray3 z-10 py-1 ">Hết hàng</div>}
                    {stock > 0 && product?.discount > 0 && <div className="absolute top-5 left-0 rounded-r-xl px-2 bg-danger z-10 py-1 text-white ">- {product?.discount * 100}%</div>}
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