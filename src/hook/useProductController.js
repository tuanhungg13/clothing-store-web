import React, { useState, useEffect } from "react";
import {
    doc,
    collection,
    getDocs,
    getDoc,
    query,
    where,
    orderBy,
    startAfter,
    deleteDoc,
    limit
} from "firebase/firestore";
import { db } from "@/utils/config/configFirebase";
import { message } from "antd";

const useProductController = ({ params }) => {
    const [products, setProducts] = useState([]);
    const [defaultParams] = useState({ size: 12, page: 1 });
    const [loading, setLoading] = useState(false);
    const [totalElements, setTotalElements] = useState(0);

    useEffect(() => {
        fetchProducts();
    }, [params]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const filterParams = { ...defaultParams, ...params };
            const page = filterParams.page || 1;
            const size = filterParams.size || 5;

            const filters = [];

            // Lọc theo productType nếu có
            if (filterParams?.productType != null) {
                filters.push(where("productType", "==", Number(filterParams?.productType)));
            }

            // Lọc thêm các điều kiện khác nếu có (ví dụ categoryId, brand...)
            if (filterParams?.categoryId) {
                filters.push(where("categoryId", "==", filterParams?.categoryId));
            }

            // Tạo query ban đầu với lọc và sắp xếp
            let baseQuery = query(
                collection(db, "products"),
                ...filters,
                orderBy("createdAt", "desc") // cần index nếu có where kèm orderBy
            );

            let lastVisible = null;

            // Tính toán vị trí bắt đầu nếu đang ở trang > 1
            if (page > 1) {
                const prevQuery = query(baseQuery, limit((page - 1) * size));
                const prevSnapshot = await getDocs(prevQuery);
                lastVisible = prevSnapshot.docs[prevSnapshot.docs.length - 1];
            }

            // Truy vấn trang hiện tại
            const pagedQuery = query(
                baseQuery,
                ...(lastVisible ? [startAfter(lastVisible)] : []),
                limit(size)
            );

            const snapshot = await getDocs(pagedQuery);

            const productsWithCategoryAndCollection = await Promise.all(
                snapshot.docs.map(async (docSnap) => {
                    const product = { productId: docSnap.id, ...docSnap.data() };

                    // Lấy thông tin danh mục nếu có
                    let category = null;
                    if (product.categoryId) {
                        const categoryRef = doc(db, "categories", product.categoryId);
                        const categorySnap = await getDoc(categoryRef);
                        if (categorySnap.exists()) {
                            category = categorySnap.data();
                        }
                    }

                    // Lấy thông tin bộ sưu tập nếu có
                    let collection = null;
                    if (product.collectionId) {
                        const collectionRef = doc(db, "collections", product.collectionId);
                        const collectionSnap = await getDoc(collectionRef);
                        if (collectionSnap.exists()) {
                            collection = collectionSnap.data();
                        }
                    }

                    return { ...product, category, collection };
                })
            );

            setProducts(productsWithCategoryAndCollection);

            // Đếm tổng số sản phẩm (chỉ cần ở page 1)
            if (page === 1) {
                const totalQuery = query(
                    collection(db, "products"),
                    ...filters
                );
                const totalSnapshot = await getDocs(totalQuery);
                setTotalElements(totalSnapshot.size);
            }

        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm:", error);
        } finally {
            setLoading(false);
        }
    };


    const getLowStockProductsCount = async () => {
        try {
            // Truy vấn tất cả các sản phẩm từ Firestore
            const productsQuery = query(
                collection(db, "products")
            );

            const snapshot = await getDocs(productsQuery);

            // Lọc các sản phẩm có số lượng nhỏ hơn 30
            const lowStockCount = snapshot.docs.filter(docSnap => {
                const product = docSnap.data();
                return product.variants && product.variants.some(variant =>
                    variant.sizes.some(size => size.quantity < 30)
                );
            }).length;

            return lowStockCount;
        } catch (error) {
            console.error("Lỗi khi lấy số lượng sản phẩm ít hơn 30:", error);
            return 0;
        }
    };

    const deleteProduct = async (productId) => {
        setLoading(true);
        try {
            // Lấy tham chiếu đến sản phẩm cần xóa
            const productRef = doc(db, "products", productId);

            // Thực hiện xóa sản phẩm
            await deleteDoc(productRef);

            // Cập nhật lại danh sách sản phẩm sau khi xóa
            setProducts(prevProducts => prevProducts.filter(product => product?.productId !== productId));

            message.success("Xóa sản phẩm thành công");
        } catch (error) {
            message.error("Xóa sản phẩm thất bại");
            console.error("Lỗi khi xóa sản phẩm:", error);
        } finally {
            setLoading(false);
        }
    };

    return {
        products,
        fetchProducts,
        deleteProduct,
        loading,
        totalElements,
        getLowStockProductsCount
    };
};

export default useProductController;
