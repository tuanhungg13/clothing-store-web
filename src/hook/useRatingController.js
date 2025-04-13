import { useState } from "react";
import {
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    doc,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "@/utils/config/configFirebase";

const useRatingController = () => {
    const [loading, setLoading] = useState(false);

    // ✅ Thêm đánh giá mới vào bảng 'ratings' cho nhiều sản phẩm
    const addRating = async ({ productIds, uid, rate, comment }, callbackSuccess) => {
        setLoading(true);
        try {
            // Lặp qua mỗi productId và thêm đánh giá
            for (const productId of productIds) {
                await addDoc(collection(db, "ratings"), {
                    productId,
                    uid,
                    rate,
                    comment: comment || "",
                    createdAt: serverTimestamp(),
                });
            }

            // ✅ Cập nhật tổng rating cho toàn bộ sản phẩm
            await updateProductRating(productIds, callbackSuccess);

            console.log("Thêm đánh giá cho nhiều sản phẩm thành công!");
        } catch (error) {
            console.error("Lỗi khi thêm đánh giá:", error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Cập nhật tổng đánh giá cho nhiều sản phẩm
    const updateProductRating = async (productIds = [], callbackSuccess) => {
        try {
            for (const productId of productIds) {
                const ratingsRef = collection(db, "ratings");
                const q = query(ratingsRef, where("productId", "==", productId));
                const snapshot = await getDocs(q);

                let totalRating = 0;
                let totalReviews = 0;

                snapshot.forEach((doc) => {
                    const data = doc.data();
                    totalRating += data?.rate;
                    totalReviews++;
                });

                if (totalReviews > 0) {
                    const averageRating = totalRating / totalReviews;

                    const productRef = doc(db, "products", productId);
                    await updateDoc(productRef, {
                        totalRating: averageRating,
                    });
                }
            }
            callbackSuccess()
        } catch (error) {
            console.error("Lỗi khi cập nhật tổng đánh giá:", error);
        }
    };

    return {
        loading,
        addRating, // Truyền { productIds: [...], uid, rate, comment }
        updateProductRating,
    };
};

export default useRatingController;
