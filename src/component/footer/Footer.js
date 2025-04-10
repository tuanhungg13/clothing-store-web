'use client'
import React from "react";
import { logo } from "@/assets";
import { FaPhone, FaFacebookF, FaFacebookMessenger } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { AiOutlinePhone } from "react-icons/ai";
import Link from "next/link";
import { usePathname } from "next/navigation";
const route = [
    { name: "home", route: "/", label: "Trang chủ" },
    { name: "products", route: "/products", label: "Sản phẩm" },
    { name: "about", route: "/about", label: "Giới thiệu" }
]
export default function Footer() {
    const pathname = usePathname();

    return (
        <div className="footer px-4 pt-10 xl:px-20 bg-bgSecondary">
            <Link href={"/"} className="flex items-center gap-2">
                <img src={logo.src} className="object-contain" />

            </Link>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-6">
                <div className=" col-span-2 flex flex-col leading-8 mb-10 sm:mb-0 ">
                    <div className="mb-4 font-semibold text-md md:text-lg">Địa chỉ</div>
                    <React.Fragment >
                        <div className="flex gap-2 items-center">
                            <HiOutlineLocationMarker className="inline-block min-w-6 min-h-6 h-6 w-6 text-primary" />
                            <div className="text-wrap">abc@gmail.com</div>
                        </div>
                        <div className="flex gap-2 items-center">
                            <AiOutlinePhone size={24} className="inline-block text-primary" />
                            <div>0123456789</div>
                        </div>
                    </React.Fragment>

                </div>

                <div>
                    <div className="mb-4 font-semibold text-md md:text-lg">Liên kết</div>
                    <div className="flex flex-col gap-2 ">
                        {route?.map((item, index) => (
                            <Link href={item?.route} key={`ghd-${index}`} className={`hover:text-primary ${pathname === item?.route ? "text-primary" : ""}`}>{item?.label}</Link>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="font-semibold mb-4 text-md md:text-lg">Hỗ trợ</div>
                    <div className="flex justify-start items-center gap-4">
                        <a href={"https://www.facebook.com/"} target={"_blank"}>
                            <FaFacebookF size={40} className="p-2 text-white rounded-lg bg-primary" />
                        </a>
                        <a href={"https://www.messenger.com/"} target={"_blank"}>
                            <FaFacebookMessenger size={40} className="p-2 text-white rounded-lg  bg-primary" />
                        </a>
                        <a href={`https://zalo.me` || "#"} target="_blank">
                            <SiZalo size={40} className="p-2 rounded-lg text-white bg-primary" />
                        </a>
                    </div>
                </div>
            </div>
            <hr className="mt-10" />
            <div className="py-4">
                <small className="me-5">Bản quyền thuộc công ty cổ phần công nghệ thông minh SFIN.</small>
                <a href={"#"} target="_blank" ><small className="underline decoration-solid text-primary">Xem điều khoản và chính sách</small></a>
            </div>
        </div>
    )
}