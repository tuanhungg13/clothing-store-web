"use client"
import React, { useEffect, useRef, useState } from "react";
// import { formatCurrency, numberPattern } from "../../../helper/common";
import { RiDeleteBin7Line } from "react-icons/ri";
import { FaArrowRight } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { Input, Button, ModalNotification } from "s-platform-landing-section";
import { numberPattern, formatCurrency } from "@/utils/helpers/common";
import dayjs from "dayjs";
import CartController from "@/controllers/CartController";
import FormCheckout from "./FormCheckout";
import OrderController from "@/controllers/OrderController";
import { FaCartPlus } from "react-icons/fa";
import { ProductImage } from "s-platform-landing-section";
import { debounce } from "lodash";

const Cart = (props) => {
    const { isCheckout,
        setIsCheckout = () => { }
    } = props

    const [checkAll, setCheckAll] = useState(false);
    const [chosenProducts, setChosenProducts] = useState([])

    const [discount, setDiscount] = useState(0);
    const [orderSuccessInfo, setOrderSuccessInfo] = useState({});
    const [isOpenModal, setIsOpenModal] = useState(false);
    const formCheckoutRef = useRef(null);
    const cartItems = useSelector(state => state?.cart?.items)
    const shadowRef = useRef(null)
    const [isShadow, setIsShadow] = useState(false);
    const dispatch = useDispatch()
    const { postOrder = () => { } } = OrderController(props)
    const { clearCart } = CartController(props)
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
        const selectedProducts = cartItems?.filter(item => chosenProducts?.some(product => product?.variantId === item?.variantId));
        console.log("check selectedProducts", selectedProducts)
        setChosenProducts(selectedProducts);
    }, [cartItems])

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
        const totalPrice = chosenProducts?.reduce((sum, element) => sum + (element?.variantPrice * element?.quantity), 0)
        return totalPrice
    }

    const handleCheckProducts = (event) => {
        const { value, checked } = event.target
        const products = cartItems?.find(item => item?.variantId == value);
        if (checked) {
            setChosenProducts(prev => ([...prev, products]))
        }
        else {
            setChosenProducts(prev => prev.filter(item => item?.variantId != value))
        }
    }

    const handleSubmit = async () => {
        const formCheckoutValidation = formCheckoutRef?.current?.validateForm();
        if (formCheckoutValidation && chosenProducts?.length > 0) {
            const orderInfo = formCheckoutRef?.current?.getValue()
            const orderData = {
                ...orderInfo,
                chosenProducts
            }

            const res = await postOrder(orderData);
            if (res?.data?.status?.code === "200") {
                setOrderSuccessInfo(res?.data?.data);
                formCheckoutRef?.current?.setValue()
                dispatch(clearCart(chosenProducts))
                setIsOpenModal(true)
                setChosenProducts([])
            }

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
                            <CartItem item={item} key={item?.variantId}
                                chosenProducts={chosenProducts}
                                onChange={(event) => { handleCheckProducts(event) }}
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
                        {chosenProducts?.length > 0 ? <Button
                            className="col-span-5 mt-2 md:mt-0 "
                            label={
                                <div className="flex items-center justify-center bg-primary text-Button gap-2">
                                    Đặt hàng <FaArrowRight />
                                </div>
                            }
                            onClick={() => { setIsCheckout(false) }}
                        /> : null}

                    </div>
                </div>)
                :    //--------------------------------------------------- trang Checkout-----------------------------------------------
                (
                    <div className={`mb-12 mx-4 xl:mx-20 grid grid-cols-1 mt-0 md:grid-cols-5  gap-6`} >
                        <div className="md:col-span-3 bg-bgSecondary h-full rounded-xl">
                            <FormCheckout
                                ref={formCheckoutRef}
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
                                        label="ĐẶT HÀNG"
                                        onClick={handleSubmit}
                                    />
                                    : null}
                            </div>
                            <div className="flex flex-col bg-bgSecondary p-6 rounded-xl">
                                <div className="font-medium text-lg mb-6">Sản phẩm trong đơn ({chosenProducts?.length})</div>
                                {chosenProducts?.map((item) => {
                                    return (
                                        <div className="flex gap-6 border-t py-4" key={item?.variantId}>
                                            <ProductImage product={item}
                                                className="rounded-full !object-cover" size={48} />
                                            <div className="flex flex-col gap-2">
                                                <div className="font-medium">{item?.productName}</div>
                                                <div className="px-4 py-1 border border-stroke bg-gray6 rounded-md w-max">{item?.variantName}</div>
                                                <div className="flex gap-4 items-center">
                                                    <div className="text-primary text-lg font-medium">{formatCurrency(item?.variantPrice)}</div>
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
            {isOpenModal &&
                <ModalNotification
                    isButtonClose={false}
                >
                    <div className="bg-white rounded-lg flex flex-col gap-2 shadow-lg p-6 max-w-sm text-center ">
                        <div className="h-20 mb-4 flex items-center justify-center">
                            <FaCheckCircle className="h-full text-green-500" style={{ fontSize: "150px" }} />
                        </div>
                        <h3 className="text-2xl">Đặt hàng thành công</h3>
                        <div >Thời gian: {dayjs(orderSuccessInfo?.createdDate)?.format("DD/MM/YYYY")}</div>
                        <div>Mã đơn hàng: {orderSuccessInfo?.orderNumber}</div>
                        <p className="mb-6 text-sm text-gray3" >
                            Chúng tôi sẽ liên hệ ngay với bạn, vui lòng để ý điện thoại để xác nhận đơn hàng.
                        </p>
                        <Button
                            label={
                                <a className="flex justify-center items-center gap-2" href="/" onClick={() => {
                                    setIsOpenModal(false)
                                    setOrderSuccessInfo({})
                                }}
                                >Tiếp tục mua sắm <FaArrowRight /></a>
                            }
                        />

                    </div>
                </ModalNotification>
            }
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
    const refInputQuantity = useRef();
    const dispatch = useDispatch();
    const { updateQuantityFunc, removeFromCartFunc } = CartController(props)

    const handleChangeQuantity = debounce((item, text) => {
        setQuantity(parseInt(text));
        dispatch(updateQuantityFunc(parseInt(text), item))
    }, 500)
    const handleRemoveProduct = (variant) => {
        dispatch(removeFromCartFunc(variant))
    }
    return (
        <div className="flex items-center gap-6 border-t py-4 w-max md:w-full">
            <input
                type="checkbox"
                checked={chosenProducts?.some(element => element?.variantId === item?.variantId)}
                value={item?.variantId}
                onChange={onChange}
            />
            <div className="min-w-80 lg:flex-1">
                <div className="flex gap-4 ">
                    <ProductImage product={item} className="rounded-full !object-cover" size={80} />
                    <div className="flex flex-col gap-2 whitespace-nowrap">
                        <label className="leading-6 w-56 lg:w-full text-wrap line-clamp-2">{item?.productName}</label>
                        <div className="border border-stroke rounded-md bg-gray6 px-4 py-1 w-max">{item?.variantName}</div>
                    </div>
                </div>
            </div>
            <div className="min-w-32 text-right">{formatCurrency(item?.variantPrice)}</div>
            <div className="min-w-32 text-right">
                <Input
                    rules={[
                        { type: "required", message: "Bắt buộc nhập số lượng" },
                        { type: "pattern", pattern: numberPattern, message: "Số lượng không đúng" }
                    ]}
                    defaultValue={quantity}
                    isQuantity
                    min={0}
                    onChange={(text) => handleChangeQuantity(item, parseInt(text))}
                    ref={refInputQuantity}
                    wrapClassName={"w-fit mx-auto"}
                />
            </div>
            <div className="min-w-32 text-right">{formatCurrency(item?.variantPrice * quantity)}</div>
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
