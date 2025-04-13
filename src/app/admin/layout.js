'use client'
import React, { useEffect } from "react";
import LeftMenu from "./LeftMenu";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
const AdminLayout = ({ children }) => {
    const userInfo = useSelector?.((state) => state?.user?.info);
    const router = useRouter()
    useEffect(() => {
        const savedUser = localStorage.getItem("userInfo");
        if (savedUser && userInfo?.role != "user") return
        else {
            router?.push("/")
        }
    }, [])
    return (
        <div className="flex flex-col lg:flex-row bg-bgSecondary gap-6 pt-6 px-2">
            <div className="lg:min-h-screen lg:bg-background rounded-xl">
                <LeftMenu />
            </div>
            {children}
        </div>
    )
}

export default AdminLayout