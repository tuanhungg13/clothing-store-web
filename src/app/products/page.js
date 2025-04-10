"use client"
import ProductSlider from "@/component/products/ProductSlider";
import CollectionSlider from "@/component/collection/CollectionSlider";
import Banner from "@/component/banner/Banner";
import ProductCategory from "@/component/products/ProductCategory";
import PageTitle from "@/component/pageTitle/PageTitle";
import SectionTitle from "@/component/ui/SectionTitle";
import ProductList from "@/component/products/ProductList";
export default function Products() {
    return (
        <div >
            <PageTitle data={{ sectionTitle: "Sản phẩm" }} />
            <ProductCategory />
            <ProductList type={0} title="Quần áo" />
            <ProductList type={1} title="Giày" />
            <Banner />

            {/* <CollectionHot /> */}
        </div>
    );
}
