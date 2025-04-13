'use client'
import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import { useDispatch } from "react-redux";
import useProductDetailController from "@/hook/useProductDetailController";
import { DEFAULT_CLASSNAME, formatCurrency } from "@/utils/helper/appCommon";
import { noImg } from "@/assets";
import RatingStar from "@/component/ui/RatingStar";
import ProductSlider from "@/component/products/ProductSlider";
import Banner from "@/component/banner/Banner";
import useCartController from "@/hook/useCartController";
import Link from "next/link";
export default function ProductDetail(props) {
    const productId = props?.params?.productId || "";
    const { addToCartFunc } = useCartController();
    const [quantity, setQuantity] = useState(1);
    const [variant, setVariant] = useState({
        color: "",
        size: "",
    });
    const [displayImage, setDisplayImage] = useState()
    const {
        product = {}
    } = useProductDetailController({ productId })

    useEffect(() => {
        setDisplayImage(product?.images?.[0])
    }, [product])

    const handleDisplayImage = (item) => {
        setDisplayImage(item)
    }

    const extractUniqueColorsAndSizes = (data) => {
        const colors = [...new Set(data?.map(item => item?.color))];

        const sizes = [
            ...new Set(
                data.flatMap(item => item?.sizes?.map(sizeItem => sizeItem?.size))
            ),
        ];

        return { colors, sizes };
    };
    const handleSelectColor = (color) => {
        setVariant((prev) => ({ ...prev, color }));
    };

    const handleSelectSize = (size) => {
        setVariant((prev) => ({ ...prev, size }));
    };
    const handleDecrease = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    };

    const handleIncrease = () => {
        setQuantity((prev) => prev + 1);
    };

    const handleChangeQuantity = (e) => {
        const value = +e.target.value;
        if (isNaN(value) || value < 1) {
            setQuantity(1)
            return;
        }
        setQuantity(value);
    };



    const handleAddToCart = async () => {
        const { color, size } = variant;

        if (!color || !size) {
            message.error("Vui lòng chọn màu sắc và kích cỡ trước khi thêm vào giỏ hàng!");
            return;
        }

        const availableStock = getStockQuantity(color, size);

        if (availableStock === 0) {
            message.error("Màu và kích cỡ bạn chọn hiện đã hết hàng.");
            return;
        }

        if (quantity > availableStock) {
            message.error(`Chỉ còn ${availableStock} sản phẩm với lựa chọn này.`);
            return;
        }

        await addToCartFunc({
            product,
            variant,
            quantity,
        });
    };


    const isSizeDisabled = (size) => {
        if (!variant.color) return false;
        const colorVariant = product?.variants?.find(v => v.color === variant.color);
        if (!colorVariant) return true;

        const sizeObj = colorVariant.sizes.find(s => s.size === size);
        return !sizeObj || sizeObj.quantity === 0;
    };

    const isColorDisabled = (color) => {
        if (!variant.size) return false;
        const colorVariant = product?.variants?.find(v => v.color === color);
        if (!colorVariant) return true;

        const sizeObj = colorVariant.sizes.find(s => s.size === variant.size);
        return !sizeObj || sizeObj?.quantity === 0;
    };
    const getStockQuantity = (color, size) => {
        const variant = product?.variants?.find(
            (item) => item?.color === color
        );
        if (!variant) return 0;

        const sizeObj = variant.sizes?.find((s) => s.size === size);
        return sizeObj?.quantity || 0;
    };

    return (
        <div className={`bg-background`}>
            <div className={`${DEFAULT_CLASSNAME} flex gap-4 my-6 overflow-x-auto`}>
                <Link href="/">
                    <div className="text-primary whitespace-nowrap">Trang chủ </div>
                </Link>
                <div>\</div>
                <Link href={"/products"}>
                    <div className="text-primary whitespace-nowrap">Sản phẩm</div>
                </Link>
                <div>\</div>
                <div className="whitespace-nowrap">{product?.productName}</div>
            </div>
            <div className={`px-4 md:px-6 rounded-2xl grid grid-cols-1 md:grid-cols-2 bg-background ${DEFAULT_CLASSNAME}`}>
                <div className="grid grid-cols-5 gap-6">
                    <div className="hidden lg:block col-span-1 lg:min-h-[240px] lg:max-h-[400px] xl:min-h-[400px] xl:max-h-[480px] overflow-y-auto overflow-hidden no-scrollbar">
                        {product?.images?.length > 0 ? product?.images?.map((item, index) => (
                            <img src={item} key={`ruer-${index}`} alt={""}
                                className={`cursor-pointer px-3 py-2 !h-24 !w-24 object-cover rounded-lg 
                                            ${displayImage === item ? "border border-primary" : ""}`}
                                onClick={() => { handleDisplayImage(item) }} />
                        )) :
                            <div className="p-2 border rounded-lg">
                                <img src={noImg.src} className="h-24 w-24" />
                            </div>
                        }
                    </div>
                    <div className="flex flex-col gap-4 col-span-5 lg:col-span-4 p-4 border border-stroke h-max rounded-2xl">
                        {displayImage ?
                            <img src={displayImage} className="w-full aspect-square object-cover rounded-2xl " />
                            :
                            <div className={`flex justify-center items-center rounded-2xl w-full aspect-square`} style={{ backgroundColor: "#FAFAFA" }}>
                                <img src={noImg.src} className="h-24 w-24" />
                            </div>
                        }
                    </div>
                    <div className=" block lg:hidden w-full flex gap-4 col-span-5 overflow-x-auto overflow-hidden no-scrollbar">
                        {product?.images?.length > 0 ? product?.images?.map((item, index) => (
                            <img src={item} key={`gjdf-${index}`}
                                className={`cursor-pointer px-2 py-1 !h-24 !w-24 object-cover rounded-lg 
                                            ${displayImage === item ? "border border-primary" : ""}`}
                                onClick={() => { handleDisplayImage(item) }} />
                        )) : null
                        }
                    </div>

                </div>


                <div className="mt-6 md:mt-0 md:mx-10 flex flex-col gap-6">
                    <div className="flex flex-col gap-6 ">
                        <div>
                            <div className="font-semibold text-2xl">{product?.productName}</div>
                            <div><RatingStar star={product?.totalRating} /></div>
                        </div>
                        <div className="flex gap-6 items-center">
                            <div className="font-semibold text-xl md:text-3xl">{formatCurrency(product?.price)}</div>
                            {product?.price !== product?.priceBeforeDiscount && product?.priceBeforeDiscount &&
                                <div className="text-stroke text-lg line-through">{formatCurrency(product?.priceBeforeDiscount)}</div>}

                        </div>
                    </div>
                    <hr />
                    {product?.variants?.length > 0 &&
                        <div className="flex flex-col gap-6 ">
                            <div>
                                <div className="font-medium">Màu sắc</div>
                                <div className="flex gap-4 mt-4">
                                    {product?.variants && extractUniqueColorsAndSizes(product?.variants)?.colors?.map((item, index) => {
                                        const disabled = isColorDisabled(item);
                                        return (
                                            <div
                                                key={item}
                                                className={`h-10 w-10 p-1 text-xs overflow-hidden flex justify-center items-center rounded-full border cursor-pointer 
                                                 ${variant?.color === item ? "border-primary text-primary" : ""} 
                                                ${disabled ? "opacity-50 cursor-not-allowed bg-gray6" : ""}`}
                                                onClick={() => { if (!disabled) handleSelectColor(item) }}
                                            >
                                                {item}
                                            </div>
                                        )
                                    })}

                                </div>
                            </div>
                            <div>
                                <div className="font-medium">Kích cỡ</div>
                                <div className="flex gap-4 mt-4">
                                    {product?.variants && extractUniqueColorsAndSizes(product?.variants)?.sizes?.map((item, index) => {
                                        const disabled = isSizeDisabled(item);
                                        return (
                                            <div
                                                key={item}
                                                className={`h-10 w-10 p-2 text-xs overflow-hidden flex justify-center items-center text-center rounded-full border 
                                                ${variant?.size === item ? "border-primary text-primary" : ""} 
                                                 ${disabled ? "opacity-50 cursor-not-allowed bg-gray6" : "cursor-pointer"}`}
                                                onClick={() => { if (!disabled) handleSelectSize(item) }}
                                            >
                                                {item}
                                            </div>
                                        );
                                    })}

                                </div>
                            </div>
                        </div>}

                    <div className="flex items-center border w-max">
                        <button className="p-2 w-16 border-r"
                            onClick={handleDecrease}>-</button>
                        <input type="number" className="w-20 focus:outline-none focus:ring-0 bg-transparent text-center" value={quantity}
                            onChange={(e) => { handleChangeQuantity(e) }} />
                        <button className="p-2 w-16 border-s"
                            onClick={handleIncrease}>+</button>
                    </div>
                    <div>
                        <Button className="!h-12" style={{ backgroundColor: "black", color: "white" }}
                            onClick={handleAddToCart}
                        >THÊM VÀO GIỎ HÀNG</Button>
                    </div>

                </div>
            </div>
            <div className={DEFAULT_CLASSNAME}>
                <h2 className=" font-medium text-3xl">Mô tả sản phẩm</h2>
                {product?.description ?
                    <div className="h-max py-4 md:py-6 rounded-2xl">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: product?.description,
                            }}
                        />
                    </div>

                    :
                    <div className="text-lg text-gray3 rounded-lg p-2">Không có thông tin sản phẩm</div>
                }
            </div>

            <ProductSlider />
            <Banner />
        </div>
    )
}