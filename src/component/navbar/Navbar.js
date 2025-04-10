'use client'

import React, { useState, useEffect } from "react";
import { logo } from "@/assets";
import { usePathname } from 'next/navigation';
import Link from "next/link";
import { IoCartOutline, IoChevronDownOutline, IoInformationCircleOutline, IoLogOutOutline, IoMenu, IoPersonCircleOutline } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux"
import { Button, Drawer } from "antd";
import { FiHome, FiBox, FiPhoneCall, FiLogIn } from "react-icons/fi";
import { PiHandHeartBold } from "react-icons/pi";
import { FaRegNewspaper, FaUserCircle } from "react-icons/fa";
import { TbCategory } from "react-icons/tb";
import { saveUserInfo } from "@/redux/slices/userSlice";
import Options from "../ui/Options";
import useCartController from "@/hook/useCartController";
import useAuthController from "@/hook/AuthController";
const route = [
    { name: "home", route: "/", label: "Trang chủ" },
    { name: "products", route: "/products", label: "Sản phẩm" },
    { name: "about", route: "/about", label: "Giới thiệu" }
]



const Navbar = () => {
    const pathname = usePathname();
    const cartItems = useSelector?.((state) => state?.cart?.items);
    const userInfo = useSelector?.((state) => state?.user?.info);
    const [isOpen, setIsOpen] = useState(false)
    const {
        getUserCartFromFirebase = () => { }
    } = useCartController()
    const dispatch = useDispatch()
    const [totalItem, setTotalItem] = useState("");
    const {
        logout = () => { }
    } = useAuthController()
    useEffect(() => {
        const savedUser = localStorage.getItem("userInfo");
        if (savedUser) {
            getUserCartFromFirebase(JSON.parse(savedUser))
            dispatch(saveUserInfo(JSON.parse(savedUser)));
        }
    }, []);

    useEffect(() => {
        let totalItem = cartItems?.reduce((total, item) => total + item?.quantity, 0);
        if (totalItem > 9) {
            totalItem = "9+"
        }
        setTotalItem(totalItem);
    }, [cartItems]);

    const profileOptions = [
        { label: "Thông tin cá nhân", href: "/profile", icon: <IoInformationCircleOutline size={24} className="text-gray3" /> },
        // userInfo?.role === "admin" &&
        // { label: "Quản lí cửa hàng", href: "/admin/products", icon: <IoInformationCircleOutline size={24} className="text-gray3" /> },
        // ,
        { label: "Đăng xuất", onClick: logout, icon: <IoLogOutOutline size={24} className="text-gray3" /> },
    ]

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
        <React.Fragment>
            <div className="hidden lg:block">
                <div className=" flex justify-between items-center px-4 lg:px-10 xl:px-20 py-4 bg-bgSecondary sticky top-0 shadow z-50">
                    <div className="flex gap-4 items-center">
                        <img src={logo.src} className="object-contain" />
                        <div>
                            {route?.map((item, index) => (
                                <Link href={item?.route} key={`ghd-${index}`} className={`p-2 hover:text-primary ${pathname === item?.route ? "text-primary" : ""}`}>{item?.label}</Link>
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
                                    <Options
                                        Link={Link}
                                        options={profileOptions}
                                        dropdownClassName={"right-0 top-8"}
                                        className={"flex gap-4 items-center"}
                                    >
                                        <div className="font-semibold whitespace-nowrap">{userInfo?.fullName}</div>
                                        <IoChevronDownOutline className="text-gray3" size={24} />
                                    </Options>
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
            </div>

            <div className="flex justify-between items-center px-4 py-2 lg:hidden block shadow sticky top-0 z-50 bg-bgSecondary">
                <img src={logo.src} className="object-contain" />
                <div className="flex items-center gap-8">
                    {cart()}
                    <div className="cursor-pointer" onClick={() => { setIsOpen(true) }}>
                        <IoMenu size={24} />
                    </div>
                </div>

            </div>
            <Drawer
                closable
                destroyOnClose
                title={<div>
                    <img src={logo.src} className="object-contain" />
                </div>}
                placement="right"
                open={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <div className="flex flex-col gap-2">
                    {route?.map((item, index) => (
                        <Link href={item?.route} key={`ghd-${index}`}
                            className={`p-2 hover:text-primary ${pathname === item?.route ? " text-primary bg-gray6 rounded-lg hover:bg-gray6" : ""}`}
                            onClick={() => { setIsOpen(false) }}
                        >{item?.label}</Link>
                    ))}
                </div>

            </Drawer>
        </React.Fragment >
    )
}
export default Navbar