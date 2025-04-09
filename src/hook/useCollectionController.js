import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from "firebase/firestore";
import { db } from "@/utils/config/configFirebase";
import { useState, useEffect } from "react";
import { message } from "antd";

const useCollectionController = ({ params = {} }) => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalElements, setTotalElements] = useState(0);

    const defaultParams = {
        size: 10,
        page: 1,
    };

    useEffect(() => {
        fetchCollections();
    }, [params]);

    const fetchCollections = async () => {
        setLoading(true);
        try {
            const filterParams = { ...defaultParams, ...params };
            const page = filterParams.page || 1;
            const size = filterParams.size || 10;

            const filters = [];

            if (filterParams?.collectionType) {
                filters.push(where("collectionType", "==", filterParams.collectionType));
            }

            let baseQuery = query(
                collection(db, "collections"),
                ...filters,
                orderBy("createdAt", "desc")
            );

            let lastVisible = null;

            if (page > 1) {
                const prevQuery = query(baseQuery, limit((page - 1) * size));
                const prevSnapshot = await getDocs(prevQuery);
                lastVisible = prevSnapshot.docs[prevSnapshot.docs.length - 1];
            }

            const currentPageQuery = query(
                baseQuery,
                ...(lastVisible ? [startAfter(lastVisible)] : []),
                limit(size)
            );

            const snapshot = await getDocs(currentPageQuery);

            const results = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setCollections(results);

            // Chỉ đếm tổng khi ở trang đầu
            if (page === 1) {
                const totalSnapshot = await getDocs(query(collection(db, "collections"), ...filters));
                setTotalElements(totalSnapshot.size);
            }

        } catch (error) {
            console.error("❌ Lỗi khi lấy collections:", error);
        } finally {
            setLoading(false);
        }
    };

    const addCollection = async (data) => {
        setLoading(true);
        try {
            await addDoc(collection(db, "collections"), {
                ...data,
                createdAt: new Date(), // nhớ thêm field này để orderBy
            });
            message.success("Thêm bộ sưu tập thành công!");
            fetchCollections();
        } catch (error) {
            console.error("❌ Lỗi khi thêm:", error);
            message.error("Thêm bộ sưu tập thất bại!");
        } finally {
            setLoading(false);
        }
    };

    const updateCollection = async (id, data) => {
        setLoading(true);
        try {
            const docRef = doc(db, "collections", id);
            await updateDoc(docRef, data);
            message.success("Cập nhật thành công!");
            fetchCollections();
        } catch (error) {
            console.error("❌ Lỗi khi cập nhật:", error);
            message.error("Cập nhật thất bại!");
        } finally {
            setLoading(false);
        }
    };

    const deleteCollection = async (id) => {
        setLoading(true);
        try {
            await deleteDoc(doc(db, "collections", id));
            message.success("Xoá thành công!");
            fetchCollections();
        } catch (error) {
            console.error("❌ Lỗi khi xoá:", error);
            message.error("Xoá thất bại!");
        } finally {
            setLoading(false);
        }
    };

    return {
        collections,
        loading,
        totalElements,
        fetchCollections,
        addCollection,
        updateCollection,
        deleteCollection,
    };
};

export default useCollectionController;
