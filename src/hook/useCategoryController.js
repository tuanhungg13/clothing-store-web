import React, { useState, useEffect } from "react";
import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    addDoc,
    doc,
    updateDoc,
    deleteDoc
} from "firebase/firestore";
import { db } from "@/utils/config/configFirebase";
import { message } from "antd";
const useCategoryController = (props) => {
    const {
        params = {}
    } = props
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(null)
    const [defaultParams, setDefaultParams] = useState({
        size: 12,
    })
    useEffect(() => {
        fetchCategories()
    }, [params])

    const fetchCategories = async (lastDoc = null) => {
        setLoading(true);
        try {
            const filterParams = { ...defaultParams, ...params }; // gộp param chuẩn

            const filters = [];
            if (filterParams?.categoriType != null) {
                filters.push(where("categoriType", "==", filterParams?.categoriType));
            }
            const q = query(
                collection(db, "categories"),
                ...filters,
                ...(lastDoc ? [startAfter(lastDoc)] : []),
                limit(filterParams?.size || 12)
            );

            const snapshot = await getDocs(q);
            const newCategories = snapshot.docs.map(doc => ({
                categoryId: doc.id,
                ...doc.data()
            }));
            console.log(newCategories, snapshot.docs[snapshot.docs.length - 1])
            setCategories(prev => lastDoc ? [...prev, ...newCategories] : newCategories);
            setPage(snapshot.docs[snapshot.docs.length - 1] || null);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };
    const addCategory = async (data) => {
        setLoading(true)
        try {
            await addDoc(collection(db, 'categories'), data);
            await fetchCategories()
            setLoading(false)
            message.success('Thêm danh mục thành công!');
        } catch (error) {
            console.log(error)
            message.error('Thêm danh mục thất bại!');
            setLoading(false)

        }
    }

    const updateCategory = async (id, updatedData) => {
        setLoading(true);
        try {
            const categoryRef = doc(db, 'categories', id); // tham chiếu đến document theo id
            await updateDoc(categoryRef, updatedData);
            message.success('Cập nhật danh mục thành công!');
            await fetchCategories(); // load lại danh sách
        } catch (error) {
            console.error('❌ Lỗi khi cập nhật danh mục:', error);
            message.error('Cập nhật danh mục thất bại!');
        } finally {
            setLoading(false);
        }
    };

    const deleteCategory = async (id) => {
        setLoading(true);
        try {
            const categoryRef = doc(db, 'categories', id);
            await deleteDoc(categoryRef);
            message.success('Xoá danh mục thành công!');
            await fetchCategories(); // Gọi lại để cập nhật danh sách
        } catch (error) {
            console.error('❌ Lỗi khi xoá danh mục:', error);
            message.error('Không thể xoá danh mục!');
        } finally {
            setLoading(false);
        }
    };

    return {
        categories,
        loading,
        fetchCategories,
        addCategory,
        updateCategory,
        deleteCategory
    }
}

export default useCategoryController