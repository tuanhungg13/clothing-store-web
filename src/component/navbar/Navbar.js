'use client'

import React, { useState, useEffect } from "react";
import { logo } from "@/assets";
import { usePathname } from 'next/navigation';
import Link from "next/link";
import { IoCartOutline, IoChevronDownOutline, IoInformationCircleOutline, IoLogOutOutline, IoMenu, IoPersonCircleOutline } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux"
import { Button, Drawer } from "antd";
import { IoHomeOutline } from "react-icons/io5";
import { FiHome, FiBox, FiPhoneCall, FiLogIn } from "react-icons/fi";
import { FaRegNewspaper, FaUserCircle } from "react-icons/fa";
import { HiOutlineUserCircle } from "react-icons/hi2";

import { saveUserInfo } from "@/redux/slices/userSlice";
import Options from "../ui/Options";
import useCartController from "@/hook/useCartController";
import useAuthController from "@/hook/AuthController";
import { initCart } from "@/redux/slices/cartSlice";
import { MdOutlineStorefront } from "react-icons/md";
import { GrHistory } from "react-icons/gr";

const route = [
    { name: "home", route: "/", label: "Trang chủ", icon: <IoHomeOutline size={24} className="text-gray3" /> },
    { name: "products", route: "/products", label: "Sản phẩm", icon: <FiBox size={24} className="text-gray3" /> },
    { name: "about", route: "/about", label: "Giới thiệu", icon: <IoInformationCircleOutline size={24} className="text-gray3" /> },
]



const Navbar = () => {
    const pathname = usePathname();
    const cartItems = useSelector?.((state) => state?.cart?.items);
    const userInfo = useSelector?.((state) => state?.user?.info);
    const [isOpen, setIsOpen] = useState(false)
    const {
        getUserCartFromFirebase = () => { },
        getInventoryForCartItems = () => { }
    } = useCartController()
    const dispatch = useDispatch()
    const [totalItem, setTotalItem] = useState("");
    const {
        logout = () => { }
    } = useAuthController()
    useEffect(() => {
        const initialize = async () => {
            const savedUser = localStorage.getItem("userInfo");
            const cartItems = localStorage.getItem("cartItems");

            if (savedUser) {
                getUserCartFromFirebase(JSON.parse(savedUser));
                dispatch(saveUserInfo(JSON.parse(savedUser)));
            } else if (cartItems) {
                const items = await fetchCartLocal(JSON.parse(cartItems));
                dispatch(initCart(items));
            }
        };

        initialize();
    }, []);

    const fetchCartLocal = async (cartItems) => {
        const listItems = await getInventoryForCartItems(cartItems)
        return listItems
    }

    useEffect(() => {
        let totalItem = cartItems?.reduce((total, item) => total + item?.quantity, 0);
        if (totalItem > 9) {
            totalItem = "9+"
        }
        setTotalItem(totalItem);
    }, [cartItems]);

    const profileOptions = [
        {
            label: "Thông tin cá nhân",
            href: "/profile",
            icon: <HiOutlineUserCircle size={24} className="text-gray3" />,
        },
        {
            label: "Lịch sử mua hàng",
            href: "/orders",
            icon: <GrHistory size={20} className="text-gray3 mr-1" />,
        },
        ...(userInfo?.role !== "user"
            ? [
                {
                    label: "Quản lí cửa hàng",
                    href: "/admin/dashboard",
                    icon: <MdOutlineStorefront size={24} className="text-gray3" />,
                },
            ]
            : []),
        {
            label: "Đăng xuất",
            onClick: logout,
            icon: <IoLogOutOutline size={24} className="text-gray3" />,
        },
    ];


    const cart = () => {
        return (
            <Link href="/carts">
                <div className="relative cursor-pointer">
                    <IoCartOutline className={"text-black"} size={30} />
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
            <div className="hidden lg:block sticky top-0 shadow z-50">
                <div className=" flex justify-between items-center px-4 lg:px-10 xl:px-20 py-4 bg-bgSecondary ">
                    <div className="flex gap-4 items-center">
                        <Link href={"/"}>
                            <img src={logo.src} className="object-contain" />
                        </Link>
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
                                {userInfo?.avatar ? <img src={userInfo?.avatar} className="w-12 h-12 rounded-full object-cover" /> :
                                    <FaUserCircle className="text-black" size={48} />}
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
                                <div className="min-w-28">
                                    <Link href={"/login"}>
                                        <Button
                                            style={{
                                                transform: "none",
                                                boxShadow: "none",
                                                transition: "none",
                                            }}
                                            type="default"
                                            className="w-full text-white bg-black hover:!opacity-80 hover:!bg-black hover:!border-none hover:!text-white"
                                        >Đăng nhập</Button>
                                    </Link>
                                </div>

                                <Button>Đăng ký</Button>
                            </div>
                        }
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center px-4 py-2 lg:hidden block shadow sticky top-0 z-50 bg-bgSecondary">
                <Link href={"/"}>                <img src={logo.src} className="object-contain" />
                </Link>
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
                    <Link href={"/"}>
                        <img src={logo.src} className="object-contain" />
                    </Link>
                </div>}
                placement="right"
                open={isOpen}
                width={"70vw"}
                onClose={() => setIsOpen(false)}
            >
                <div className="flex flex-col gap-2">
                    {route?.map((item, index) => (
                        <Link href={item?.route} key={`ghd-${index}`}
                            className={`p-2 flex gap-2 px-4 py-2 hover:text-primary ${pathname === item?.route ? " text-primary bg-gray6 rounded-lg hover:bg-gray6" : ""}`}
                            onClick={() => { setIsOpen(false) }}
                        >
                            <div>{item?.icon}</div>
                            <div>{item?.label}</div>
                        </Link>
                    ))}
                    <hr />
                    {userInfo ?
                        profileOptions?.map((option, index) =>
                        (option?.href ?
                            <Link onClick={() => setIsOpen(false)} key={`hkfdfh-${index}`} href={option?.href}
                                className={"flex gap-2 px-4 py-2 text-black hover:bg-gray-100 rounded cursor-pointer"} role="menuitem">
                                <div>{option?.icon}</div>
                                <p>{option?.label}</p>
                            </Link>
                            :
                            <div key={`hkfdfh-${index}`} onClick={() => {
                                setIsOpen(false)
                                logout()
                            }} className={"flex gap-2 px-4 py-2 text-black hover:bg-gray-100 rounded cursor-pointer"} role="menuitem">
                                <IoLogOutOutline size={24} />
                                <p>{option?.label}</p>
                            </div>
                        ))
                        :
                        <Link href={"/login"} onClick={() => setIsOpen(false)}>
                            <div className={`py-2 px-4 flex items-center gap-4`}>
                                <FiLogIn size={20} className="text-gray3" />
                                Đăng nhập
                            </div>
                        </Link>
                    }
                </div>

            </Drawer>
        </React.Fragment >
    )
}
export default Navbar