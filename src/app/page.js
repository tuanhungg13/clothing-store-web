"use client"
import ProductSlider from "@/component/products/ProductSlider";
import CollectionSlider from "@/component/collection/CollectionSlider";
import ProductList from "@/component/products/ProductList";
import Banner from "@/component/banner/Banner";
import ProductCategory from "@/component/products/ProductCategory";
export default function Home() {
  return (
    <div >
      <CollectionSlider />
      <ProductSlider />
      <Banner />
      {/* <ProductHot /> */}
      <ProductList type={0} title="Quần áo" />
      <ProductList type={1} title="Giày" />

      {/* <CollectionHot /> */}
    </div>
  );
}
