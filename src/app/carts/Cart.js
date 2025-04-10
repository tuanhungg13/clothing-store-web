"use client"
import React, { use, useEffect, useRef, useState } from "react";
import { RiDeleteBin7Line } from "react-icons/ri";
import { FaArrowRight } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { FaCartPlus } from "react-icons/fa";
import { debounce } from "lodash";
import useCartController from "@/hook/useCartController";
import { noImg } from "@/assets";
import { formatCurrency } from "@/utils/helper/appCommon";
import { Button, Form, message } from "antd";
import FormCheckout from "./FormCheckout";
import useOrderController from "@/hook/useOrderController";
import { serverTimestamp } from "firebase/firestore";
const Cart = (props) => {
    const {
        isCheckout = true,
        setIsCheckout = () => { }
    } = props

    const [checkAll, setCheckAll] = useState(false);
    const [chosenProducts, setChosenProducts] = useState([])
    const [form] = Form.useForm();

    const [discount, setDiscount] = useState(0);
    const cartItems = useSelector(state => state?.cart?.items)
    const shadowRef = useRef(null)
    const [isShadow, setIsShadow] = useState(false);
    const {
        addOrder = () => { }
    } = useOrderController()
    useEffect(() => {
        const handleScroll = () => {
            if (shadowRef?.current) {
                const footerPosition = shadowRef?.current?.getBoundingClientRect();
                //Nếu thanh tính tiền ở cuối cùng của viewport thì thêm bóng
                if (footerPosition?.bottom >= window.innerHeight) {
                    setIsShadow(true);
                } else {
                    setIsShadow(false);
                }
            }
        };
        handleScroll()
        window.addEventListener("resize", handleScroll);
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, []);

    useEffect(() => {
        const selectedProducts = cartItems?.filter(product => chosenProducts?.some(item => item?.productId === product?.productId && item?.color === product?.color && item?.size === product?.size));
        console.log("check selectedProducts", selectedProducts)
        setChosenProducts(selectedProducts);
    }, [cartItems])

    useEffect(() => {
        console.log("choosen:", chosenProducts)
    }, [chosenProducts])

    const handleCheckAll = (event) => {
        const { checked } = event.target;
        if (checked) {
            setChosenProducts(cartItems)
            setCheckAll(checked);
        }
        else {
            setChosenProducts([])
            setCheckAll(checked);
        }

    }



    const handleTotalPrice = () => {
        const totalPrice = chosenProducts?.reduce((sum, element) => sum + (element?.price * element?.quantity), 0)
        return totalPrice
    }

    const handleCheckProducts = (event, product) => {
        const { checked } = event.target
        const products = cartItems?.find(item => item?.productId === product?.productId && item?.color === product?.color && item?.size === product?.size);
        console.log("check::::", checked, product)
        if (checked) {
            setChosenProducts(prev => ([...prev, products]))
        }
        else {
            setChosenProducts(prev => prev.filter(item => !(item?.productId === product?.productId && item?.color === product?.color && item?.size === product?.size)))
        }
    }

    const handleSubmit = async () => {
        try {
            const {
                customerName,
                phoneCustomer,
                province,
                district,
                ward,
                address,
                note
            } = form.getFieldValue();
            await form.validateFields()
            const data = {
                customerName,
                phoneCustomer,
                province,
                district,
                ward,
                address,
                orderItems: chosenProducts,
                paymentId: null,
                status: "PENDING",
                orderDate: serverTimestamp(),
                note: note
            }
            await addOrder(data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <React.Fragment>
            {isCheckout ? (  //---------------------------------------------------------Trang giỏ hàng------------------------------------------------------------
                <div className="relative" >
                    <div className={`mb-12 mx-4 xl:mx-20 rounded-2xl bg-bgSecondary p-4 overflow-x-auto min-w-72 lg:hide-scrollbar`}>
                        <div className="flex gap-6 pb-4 whitespace-nowrap w-max md:w-full">
                            <input
                                type="checkbox"
                                checked={chosenProducts?.length === cartItems?.length}
                                onChange={handleCheckAll}
                            />
                            <div className="min-w-80 lg:flex-1 ">Sản phẩm</div>
                            <div className="min-w-32 text-right">Đơn giá</div>
                            <div className="min-w-32 text-center">Số lượng</div>
                            <div className="min-w-32 text-right">Thành tiền</div>
                            <div className="min-w-32 text-center">Hành động</div>
                        </div>
                        {cartItems?.length > 0 ? cartItems?.map((item, index) =>
                            <CartItem item={item} key={`${item?.productId}-${item?.variant?.color}-${item?.variant?.size}`}
                                chosenProducts={chosenProducts}
                                onChange={(event) => { handleCheckProducts(event, item) }}
                            />
                        )
                            :
                            <div className="flex flex-col gap-4 justify-center items-center h-40">
                                <FaCartPlus size={40} className="text-gray4" />
                                <div className="text-gray4">
                                    Không có sản phẩm trong giỏ hàng
                                </div>
                            </div>
                        }
                    </div>

                    <div ref={shadowRef} className={`grid grid-cols-5 md:flex items-center md:gap-6 bg-bgSecondary mb-6 md:h-20 py-4 px-4 xl:px-20 sticky bottom-0 ${isShadow ? "shadow-[0_-7px_8px_-3px_rgba(0,0,0,0.1)]" : ""} `}>
                        <div className="col-span-2 md:flex-1 flex gap-2 min-w-32">
                            <input
                                type="checkbox"
                                checked={chosenProducts?.length === cartItems?.length}
                                onChange={handleCheckAll}
                            />
                            <div className="inline-block ms-2">Chọn tất cả</div>
                        </div>
                        <div className="col-span-3 flex justify-end">
                            <div>
                                <div className="min-w-44">Tổng thanh toán({chosenProducts?.reduce((acc, item) => acc + item?.quantity, 0)})</div>
                                <div className="min-w-32 text-primary text-lg font-medium	">{formatCurrency(handleTotalPrice())}</div>
                            </div>
                        </div>
                        {chosenProducts?.length > 0 ?
                            <Button
                                onClick={() => { setIsCheckout(false) }}
                                className="col-span-5 mt-2 md:mt-0 btn-green-color"
                            >
                                <div className="flex items-center justify-centertext-Button gap-2">
                                    Đặt hàng <FaArrowRight />
                                </div>
                            </Button>
                            : null}

                    </div>
                </div>)
                :    //--------------------------------------------------- trang Checkout-----------------------------------------------
                (
                    <div className={`mb-12 mx-4 xl:mx-20 grid grid-cols-1 mt-0 md:grid-cols-5  gap-6`} >
                        <div className="md:col-span-3 bg-bgSecondary h-full rounded-xl">
                            <FormCheckout
                                form={form}
                                label={"Thông tin giao hàng"}
                                className=" h-max"
                                labelClassName="text-lg font-semibold"
                                onSubmit={handleSubmit}
                            />
                        </div>
                        <div className="md:col-span-2 flex flex-col gap-6">
                            <div className="flex flex-col gap-4 p-6 bg-bgSecondary rounded-xl">
                                <div className="text-lg font-semibold">Thông tin thanh toán</div>
                                <div className="flex justify-between items-center">
                                    <div>Tổng tiền hàng</div>
                                    <div className="text-primary text-lg font-medium">{formatCurrency(handleTotalPrice())}</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>Giảm giá</div>
                                    <div className="text-primary text-lg font-medium">{formatCurrency(discount)}</div>
                                </div>
                                <div className="border-t border-dashed">
                                    <div className="flex justify-between items-center pt-4">
                                        <div>Tổng thanh toán</div>
                                        <div className="text-primary text-lg font-medium">{formatCurrency(handleTotalPrice() - discount)}</div>
                                    </div>
                                </div>
                                {chosenProducts?.length > 0 ?
                                    <Button
                                        onClick={handleSubmit}
                                        className="btn-green-color"
                                    >ĐẶT HÀNG</Button>
                                    : null}
                            </div>
                            <div className="flex flex-col bg-bgSecondary p-6 rounded-xl">
                                <div className="font-medium text-lg mb-6">Sản phẩm trong đơn ({chosenProducts?.length})</div>
                                {chosenProducts?.map((item, index) => {
                                    return (
                                        <div className="flex gap-6 border-t py-4" key={`fsjf-${index}`}>
                                            <img src={item?.image || noImg?.src} className="w-24 h-24 rounded-full object-cover" />
                                            <div className="flex flex-col gap-2">
                                                <div className="font-medium">{item?.productName}</div>
                                                <div className="px-4 py-1 border border-stroke bg-gray6 rounded-md w-max">{item?.variant?.color} | {item?.variant?.size}</div>
                                                <div className="flex gap-4 items-center">
                                                    <div className="text-primary text-lg font-medium">{formatCurrency(item?.price)}</div>
                                                    <div>x{item?.quantity}</div>
                                                </div>
                                            </div>

                                        </div>
                                    )
                                })
                                }
                            </div>
                        </div>
                    </div>
                )}

        </React.Fragment>
    )
}

const CartItem = (props) => {
    const {
        item,
        onChange = () => { },
        chosenProducts,
    } = props;
    const [quantity, setQuantity] = useState(item?.quantity);
    const dispatch = useDispatch();
    const { updateCartItem, removeCartItem } = useCartController()

    const debouncedUpdateQuantity = useRef(null); // để giữ function không bị re-create

    useEffect(() => {
        debouncedUpdateQuantity.current = debounce((newQty) => {
            updateCartItem({
                productId: item.productId,
                variant: item.variant,
                newQuantity: newQty
            });
        }, 500);
    }, [item]); // đảm bảo chỉ khởi tạo lại nếu item đổi


    const handleChangeQuantity = (e) => {
        if (!e.target.value) { return }
        const availableStock = getStockQuantity(item?.variant?.color, item?.variant?.size);
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 1 && value <= availableStock) {
            setQuantity(value);
            debouncedUpdateQuantity.current(value);
        }
        if (value > availableStock && !isNaN(value) && value >= 1) {
            message.error(`Chỉ còn ${availableStock} sản phẩm với lựa chọn này`)
        }
    };

    const handleDecrease = () => {
        const newQty = Math.max(quantity - 1, 1);
        setQuantity(newQty);
        debouncedUpdateQuantity.current(newQty);
    };

    const handleIncrease = () => {
        const availableStock = getStockQuantity(item?.variant?.color, item?.variant?.size);
        if (quantity + 1 <= availableStock) {
            const newQty = quantity + 1;
            setQuantity(newQty);
            debouncedUpdateQuantity.current(newQty);
        }
        else {
            message.error(`Sản phẩm chỉ còn ${availableStock} sản phẩm`)
        }

    };

    const handleRemoveProduct = (item) => {
        removeCartItem({ productId: item?.productId, variant: item?.variant })
    }

    const getStockQuantity = (color, size) => {
        const variant = item?.variants?.find(
            (item) => item.color === color
        );
        if (!variant) return 0;

        const sizeObj = variant.sizes?.find((s) => s.size === size);
        return sizeObj?.quantity || 0;
    };

    return (
        <div className="flex items-center gap-6 border-t py-4 w-max md:w-full">
            <input
                type="checkbox"
                checked={chosenProducts?.some(
                    element =>
                        element?.productId === item?.productId &&
                        element?.variant?.color === item?.variant?.color &&
                        element?.variant?.size === item?.variant?.size
                )}
                value={item?.productId}
                onChange={(e) => { onChange(e, item) }}
            />
            <div className="min-w-80 lg:flex-1">
                <div className="flex gap-4 ">
                    <img src={item?.image || noImg?.src} className="w-20 h-20 object-cover rounded-full" />
                    <div className="flex flex-col gap-2 whitespace-nowrap">
                        <label className="leading-6 w-56 lg:w-full text-wrap line-clamp-2">{item?.productName}</label>
                        <div className="border border-stroke rounded-md bg-gray6 text-gray3 px-4 py-1 w-max">{item?.variant?.color} | {item?.variant?.size}</div>
                    </div>
                </div>
            </div>
            <div className="min-w-32 text-right">{formatCurrency(item?.price)}</div>
            <div className="min-w-32 flex justify-center">
                <div className="flex items-center border w-max">
                    <button className="p-2 border-r"
                        onClick={handleDecrease}>-</button>
                    <input type="text" className="w-8 focus:outline-none focus:ring-0 bg-transparent text-center" value={quantity}
                        onChange={(e) => { handleChangeQuantity(e) }} />
                    <button className="p-2 border-s"
                        onClick={handleIncrease}>+</button>
                </div>
            </div>
            <div className="min-w-32 text-right">{formatCurrency(item?.price * quantity)}</div>
            <div className="min-w-32 flex justify-center ">
                <button type="button" className="flex items-center gap-2 text-danger" onClick={() => { handleRemoveProduct(item) }}>
                    <RiDeleteBin7Line />
                    <span>Xóa</span>
                </button>

            </div>
        </div>
    )
}

export default Cart;
