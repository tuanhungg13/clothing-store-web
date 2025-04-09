"use client"
import ProductSlider from "@/component/products/ProductSlider";
import CollectionSlider from "@/component/collection/CollectionSlider";
import ProductHot from "@/component/products/ProductHot";
import CollectionHot from "@/component/collection/CollectionHot";
import Banner from "@/component/banner/Banner";
import ProductCategory from "@/component/products/ProductCategory";
export default function Home() {
  return (
    <div >
      <CollectionSlider />
      <ProductSlider />
      <Banner />
      <ProductHot />
      <ProductCategory />
      <CollectionHot />
    </div>
  );
}
