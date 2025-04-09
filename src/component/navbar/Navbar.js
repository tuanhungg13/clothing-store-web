'use client'

import React, { useState, useEffect } from "react";
import { logo } from "@/assets";
import { usePathname } from 'next/navigation';
import Link from "next/link";
import { IoCartOutline, IoChevronDownOutline, IoInformationCircleOutline, IoLogOutOutline, IoPersonCircleOutline } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux"
import { Button } from "antd";
import { FiHome, FiBox, FiPhoneCall, FiLogIn } from "react-icons/fi";
import { PiHandHeartBold } from "react-icons/pi";
import { FaRegNewspaper, FaUserCircle } from "react-icons/fa";
import { TbCategory } from "react-icons/tb";
import { saveUserInfo } from "@/redux/slices/userSlice";
const route = [
    { name: "home", route: "/", label: "Trang chủ" },
    { name: "products", route: "/products", label: "Sản phẩm" },
    { name: "about", route: "/about", label: "Giới thiệu" }
]

const Navbar = () => {
    const pathname = usePathname();
    const cartItems = useSelector?.((state) => state?.cart?.items);
    const userInfo = useSelector?.((state) => state?.user?.info);
    const dispatch = useDispatch()
    const [totalItem, setTotalItem] = useState("");
    useEffect(() => {
        const savedUser = localStorage.getItem("userInfo");
        if (savedUser) {
            dispatch(saveUserInfo(JSON.parse(savedUser)));
        }
    }, []);

    const cart = () => {
        return (
            <Link href="/gio-hang">
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
            </Link>

        )
    }

    return (
        <div className="flex justify-between px-4 lg:px-10 xl:px-20 py-4 bg-bgSecondary sticky top-0 shadow z-50">
            <div className="flex gap-4 items-center">
                <img src={logo.src} className="object-contain" />
                <div>
                    {route?.map((item, index) => (
                        <Link href={item?.route} key={`ghd-${index}`} className={`p-2 hover:text-heading ${pathname === item?.route ? "text-heading" : ""}`}>{item?.label}</Link>
                    ))}
                </div>
            </div>
            <div className="flex gap-8 items-center">
                {cart()}
                {userInfo ?
                    <div className="flex justify-center">
                        <FaUserCircle className="text-primary" size={48} />
                        <div className="ml-2">
                            <label>Xin chào!</label>
                            <div>{userInfo?.fullName}</div>
                        </div>
                    </div>
                    :
                    <div className="flex gap-4">
                        <Link href={"/login"}>
                            <Button className="btn-green-color">Đăng nhập</Button>
                        </Link>
                        <Button>Đăng ký</Button>
                    </div>
                }
            </div>


        </div>
    )
}
export default Navbar