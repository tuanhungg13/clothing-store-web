"use client"
import { Menu, Drawer } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
// import { MenuOutlined } from "@ant-design/icons";

export const ROUTE = {
    HOME: { route: "/", label: "Trang chủ" },
    CONFIG: { route: "/config", label: "Thông tin website" },
    THEME: { route: "/theme", label: "Giao diện" },
    CATEGORIES: { route: "/categories", label: "Danh mục" },
    PRODUCTS: { route: "/products", label: "Sản phẩm" },
    SERVICES: { route: "/services", label: "Dịch vụ" },
    PROMOTION: { route: "/promotion", label: "Khuyến mại" },
    ABOUT: { route: "/about", label: "Bài viết giới thiệu" },
    POPUP: { route: "/popup", label: "Popup" },
    NEWS: { route: "/news", label: "Bài viết" },
    NEWS_CATEGORIES: { route: "/news_categories", label: "Chuyên mục" },
    CREATE_POPUP: { route: "/popup/create_popup", label: "Thêm popup" },
    CREATE_NEWS: { route: "/news/create_news", label: "Thêm bài viết" }

    //    NEWS: {route: "/news", label: "Tin tức"},
    //    NEWS_DETAIL: {route: "/news/:slug/:languageCode"},
}

const MENU_ITEMS = [
    {
        key: "3",
        label: "Hàng hoá",
        icon: "",
        children: [
            { key: ROUTE.CATEGORIES.route, label: <Link href={ROUTE.CATEGORIES.route}>{ROUTE.CATEGORIES.label}</Link> },
            { key: ROUTE.PRODUCTS.route, label: <Link href={ROUTE.PRODUCTS.route}>{ROUTE.PRODUCTS.label}</Link> },
            { key: ROUTE.SERVICES.route, label: <Link href={ROUTE.SERVICES.route}>{ROUTE.SERVICES.label}</Link> },
        ]
    },

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
        console.log("route", route);
        setConfigTailwindOrigin();
        setDefaultRoute(route);
    }, []);

    const setConfigTailwindOrigin = () => {
        document.documentElement.style.setProperty('--primary', '#1F984D');
        document.documentElement.style.setProperty('--background', "#fff");
        document.documentElement.style.setProperty('--bgSecondary', "#F7F9F9");
    }

    return (
        <React.Fragment>
            <div className="hidden lg:block w-60 bg-background p-2 rounded-lg h-full">
                <Menu
                    defaultSelectedKeys={[defaultRoute?.key]}
                    defaultOpenKeys={["2", "3",]}
                    mode="inline"
                    items={MENU_ITEMS}
                    className="!border-0"
                />
            </div>
            {/* <div className="block lg:hidden">
                <div className="cursor-pointer " onClick={() => { setIsOpenMenu(true) }}><MenuOutlined style={{ fontSize: "24px" }} /></div>
                <Drawer onClose={() => { setIsOpenMenu(false) }} open={isOpenMenu} width={"70vw"}>
                    <Menu
                        defaultSelectedKeys={[defaultRoute?.key]}
                        defaultOpenKeys={["2", "3",]}
                        mode="inline"
                        items={MENU_ITEMS}
                        className="!border-0"
                    />
                </Drawer>
            </div> */}
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
