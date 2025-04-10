'use client'
import React, { useState } from "react";
import Carts from "./Cart";
import Link from "next/link";
export default function Cart() {
    const [isCheckout, setIsCheckout] = useState(true);

    return (
        <React.Fragment>
            <div className={`mx-4 xl:mx-20 my-6 flex gap-2 text-primary z-0`} >
                <Link href={"/"}>Trang chủ </Link>
                <div className="text-gray4">/</div>
                <div className="cursor-pointer text-primary" onClick={() => { setIsCheckout(true) }} >Giỏ hàng</div>
                {!isCheckout ? <div className="text-gray4">/</div> : null}
                {!isCheckout ? <div className="text-textBody">Đặt hàng</div> : null}
            </div>
            <div className="bg-background z-0">
                <Carts
                    isCheckout={isCheckout}
                    setIsCheckout={setIsCheckout}
                />
            </div>
        </React.Fragment>
    )
}