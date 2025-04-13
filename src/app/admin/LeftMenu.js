"use client"
import { Menu, Drawer } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { IoIosMenu } from "react-icons/io";
import { LuBox, LuList } from "react-icons/lu";
import { MdOutlineCategory, MdOutlineCollections, MdOutlineGroups } from "react-icons/md";
import { RiCoupon3Line } from "react-icons/ri";

export const ROUTE = {
    HOME: { route: "/", label: "Trang chủ" },
    CATEGORIES: { route: "/admin/categories", label: "Danh mục" },
    PRODUCTS: { route: "/admin/products", label: "Sản phẩm" },
    ORDER: { route: "/admin/orders", label: "Đơn hàng" },
    COLLECTION: { route: "/admin/collection", label: "Bộ sưu tập" },
    CUSTOMER: { route: "/admin/customers", label: "Người dùng" },
    COUPON: { route: "/admin/coupons", label: "Phiếu giảm giá" }



}

const MENU_ITEMS = [
    { key: ROUTE.CATEGORIES.route, icon: <MdOutlineCategory size={20} />, label: <Link href={ROUTE.CATEGORIES.route}>{ROUTE.CATEGORIES.label}</Link> },
    { key: ROUTE.PRODUCTS.route, icon: <LuBox size={20} />, label: <Link href={ROUTE.PRODUCTS.route}>{ROUTE.PRODUCTS.label}</Link> },
    { key: ROUTE.ORDER.route, icon: <LuList size={20} />, label: <Link href={ROUTE.ORDER.route}>{ROUTE.ORDER.label}</Link> },
    { key: ROUTE.COLLECTION.route, icon: <MdOutlineCollections size={20} />, label: <Link href={ROUTE.COLLECTION.route}>{ROUTE.COLLECTION.label}</Link> },
    { key: ROUTE.CUSTOMER.route, icon: <MdOutlineGroups size={20} />, label: <Link href={ROUTE.CUSTOMER.route}>{ROUTE.CUSTOMER.label}</Link> },
    { key: ROUTE.COUPON.route, icon: <RiCoupon3Line size={20} />, label: <Link href={ROUTE.COUPON.route}>{ROUTE.COUPON.label}</Link> },

]

export default function LeftMenu(props) {

    const [defaultRoute, setDefaultRoute] = useState();
    const [isOpenMenu, setIsOpenMenu] = useState(false)
    const pathname = usePathname();
    useEffect(() => {
        let route = MENU_ITEMS.find(e => e?.key === pathname);
        if (!route) {
            let parent = MENU_ITEMS.find(e => e?.children?.find(c => c?.key === pathname));
            if (parent) {
                route = parent.children.find(e => e?.key === pathname)
            }
            else {
                const basePath = pathname.replace(/\/[^/]+$/, '');
                let parent = MENU_ITEMS.find(e => e?.children?.find(c => c?.key === basePath));
                route = parent?.children?.find(e => e?.key === basePath)
            }
        }
        setDefaultRoute(route);
    }, []);

    return (
        <React.Fragment>
            <div className="hidden lg:block min-w-60 bg-background p-2 rounded-lg h-full">
                <Menu
                    defaultSelectedKeys={[defaultRoute?.key]}
                    defaultOpenKeys={["2", "3",]}
                    mode="inline"
                    items={MENU_ITEMS}
                    className="!border-0"
                />
            </div>
            <div className="block lg:hidden">
                <div className="cursor-pointer " onClick={() => { setIsOpenMenu(true) }}><IoIosMenu style={{ fontSize: "24px" }} /></div>
                <Drawer onClose={() => { setIsOpenMenu(false) }} open={isOpenMenu} width={"70vw"}>
                    <Menu
                        defaultSelectedKeys={[defaultRoute?.key]}
                        defaultOpenKeys={["2", "3",]}
                        mode="inline"
                        items={MENU_ITEMS}
                        className="!border-0"
                    />
                </Drawer>
            </div>
        </React.Fragment>
    )
}


const MenuLoading = () => {

    return (
        <div className="animate-pulse flex flex-col gap-10">
            <div className="flex gap-2 items-center">
                <div className="w-6 h-6 bg-slate-200 rounded-full" />
                <div className="flex-1 ">
                    <div className="h-2 bg-slate-200 rounded" />
                    <div className="h-2 bg-slate-200 rounded w-1/2 mt-2" />
                </div>
            </div>
            <div className="flex gap-2 items-center">
                <div className="w-6 h-6 bg-slate-200 rounded-full" />
                <div className="flex-1 ">
                    <div className="h-2 bg-slate-200 rounded" />
                    <div className="h-2 bg-slate-200 rounded w-1/2 mt-2" />
                </div>
            </div>
            <div className="flex gap-2 items-center">
                <div className="w-6 h-6 bg-slate-200 rounded-full" />
                <div className="flex-1 ">
                    <div className="h-2 bg-slate-200 rounded" />
                    <div className="h-2 bg-slate-200 rounded w-1/2 mt-2" />
                </div>
            </div>
            <div className="flex gap-2 items-center">
                <div className="w-6 h-6 bg-slate-200 rounded-full" />
                <div className="flex-1 ">
                    <div className="h-2 bg-slate-200 rounded" />
                    <div className="h-2 bg-slate-200 rounded w-1/2 mt-2" />
                </div>
            </div>
            <div className="flex gap-2 items-center">
                <div className="w-6 h-6 bg-slate-200 rounded-full" />
                <div className="flex-1 ">
                    <div className="h-2 bg-slate-200 rounded" />
                    <div className="h-2 bg-slate-200 rounded w-1/2 mt-2" />
                </div>
            </div>
        </div>
    )
}
