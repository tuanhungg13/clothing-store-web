'use client'

import React, { useState, useEffect } from "react";
import { logo } from "@/assets";
import { usePathname } from 'next/navigation';
import Link from "next/link";
import { IoCartOutline, IoChevronDownOutline, IoInformationCircleOutline, IoLogOutOutline, IoPersonCircleOutline } from "react-icons/io5";
import { useSelector } from "react-redux"
const route = [
    { name: "home", route: "/", label: "Trang chủ" },
    { name: "products", route: "/products", label: "Sản phẩm" },
    { name: "about", route: "/about", label: "Giới thiệu" }
]

const Navbar = () => {
    const pathname = usePathname();
    const cartItems = useSelector?.((state) => state?.cart?.items);
    const userInfo = useSelector?.((state) => state?.user?.info);

    const [totalItem, setTotalItem] = useState("");
    const cart = () => {
        return (
            <LinkToPage Link={Link} href="/gio-hang">
                <div className="relative cursor-pointer">
                    <IoCartOutline className={"text-primary"} size={30} />
                    {totalItem ?
                        <small
                            className="absolute aspect-square flex items-center justify-center bg-danger w-5 text-xs rounded-full text-white -top-1 -right-1">
                            {totalItem}
                        </small>
                        : null
                    }
                </div>
            </LinkToPage>

        )
    }

    return (
        <div className="flex justify-between px-4 lg:px-10 xl:px-20 py-4">
            <div className="flex gap-4 items-center">
                <img src={logo.src} className="object-contain" />
                <div>
                    {route?.map((item, index) => (
                        <Link href={item?.route} key={`ghd-${index}`} className={`p-2 hover:text-heading ${pathname === item?.route ? "text-heading" : ""}`}>{item?.label}</Link>
                    ))}
                </div>
            </div>

        </div>
    )
}
export default Navbar