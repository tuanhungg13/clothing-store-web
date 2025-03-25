import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/utils/config/configFirebase";

const useProductController = () => {
    const [products, setProducts] = useState([])

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const response = await getDocs(collection(db, "products"));
            const products = response.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log(products);
            setProducts(products)
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
        }
    }

    return {
        products,
        fetchProducts
    }
}

export default useProductController