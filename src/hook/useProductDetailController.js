import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/config/configFirebase";

const useProductDetailController = ({ productId }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (productId) {
            fetchProductDetail(productId);
        }
    }, [productId]);

    const fetchProductDetail = async (id) => {
        setLoading(true);
        setError(null);

        try {
            const productRef = doc(db, "products", id);
            const productSnap = await getDoc(productRef);

            if (productSnap.exists()) {
                const productData = productSnap.data();
                productData.productId = productSnap.id;

                // Lấy thêm thông tin category nếu có
                let category = null;
                if (productData.categoryId) {
                    const categoryRef = doc(db, "categories", productData.categoryId);
                    const categorySnap = await getDoc(categoryRef);
                    if (categorySnap.exists()) {
                        category = categorySnap.data();
                    }
                }
                setProduct({ ...productData, category });
            } else {
                setError("Sản phẩm không tồn tại.");
                setProduct(null);
            }

        } catch (err) {
            console.error("Lỗi khi lấy chi tiết sản phẩm:", err);
            setError("Đã xảy ra lỗi khi lấy dữ liệu.");
        } finally {
            setLoading(false);
        }
    };

    return {
        product,
        loading,
        error
    };
};

export default useProductDetailController;
