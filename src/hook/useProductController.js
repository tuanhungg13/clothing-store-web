import React, { useState, useEffect } from "react";
import { doc, collection, getDocs, getDoc } from "firebase/firestore";
import { db } from "@/utils/config/configFirebase";

const useProductController = () => {
    const [products, setProducts] = useState([])

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const productSnapshot = await getDocs(collection(db, "products"));
            const productsWithCategory = await Promise.all(
                productSnapshot.docs.map(async (docSnap) => {
                    const product = {
                        id: docSnap.id,
                        ...docSnap.data()
                    };

                    let category = null;
                    if (product.categoryId) {
                        const categoryRef = doc(db, "categories", product.categoryId);
                        const categorySnap = await getDoc(categoryRef);
                        category = categorySnap.exists() ? categorySnap.data() : null;
                    }

                    return {
                        ...product,
                        category // Gắn thông tin category vào product
                    };
                })
            );
            console.log(productsWithCategory)
            setProducts(productsWithCategory);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu sản phẩm và category:", error);
        }
    };
    return {
        products,
        fetchProducts
    }
}

export default useProductController