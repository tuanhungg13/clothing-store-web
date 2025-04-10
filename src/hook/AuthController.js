import { useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut,
} from "firebase/auth";
import {
    doc,
    setDoc,
    getDoc,
    addDoc,
    updateDoc,
    collection,
    serverTimestamp
} from "firebase/firestore";
import { auth, db } from "@/utils/config/configFirebase";
import { useDispatch } from "react-redux";
import { saveUserInfo } from "@/redux/slices/userSlice";
import { message } from "antd";
import { useRouter } from "next/navigation";
import useCartController from "./useCartController";
import { initCart } from "@/redux/slices/cartSlice";
const useAuthController = () => {
    const [loading, setLoading] = useState(false);
    const {
        transferLocalCartToFirebase = () => { }
    } = useCartController()
    const dispatch = useDispatch();
    const router = useRouter()
    // Tạo một document user trong Firestore
    const createUserInFirestore = async (user, additionalData = {}) => {
        const userRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(userRef);

        if (!snapshot.exists()) {
            // 1. Tạo giỏ hàng rỗng cho user này
            const cartRef = await addDoc(collection(db, "carts"), {
                userId: user.uid,
                items: [],
                createdAt: serverTimestamp(),
            });

            // 2. Tạo dữ liệu user
            const newUserData = {
                uid: user.uid,
                email: user.email,
                fullName: additionalData.fullName || user.displayName || "",
                phoneNumber: additionalData.phoneNumber || "",
                role: "user",
                cartId: cartRef.id, // Gán cartId
                createdAt: serverTimestamp(),
            };

            await setDoc(userRef, newUserData);
            return newUserData;
        }

        return snapshot.data(); // đã tồn tại thì trả về
    };

    // Đăng ký
    const register = async ({ email, password, fullName, phoneNumber }) => {
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: fullName,
            });

            const userData = await createUserInFirestore(user, { fullName, phoneNumber });
            router.push("/login")
            message.success("Đăng ký thành công")
        } catch (error) {
            console.error("Lỗi đăng ký:", error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Đăng nhập
    const login = async (email, password) => {
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Lấy dữ liệu user từ Firestore
            const userRef = doc(db, "users", user.uid);
            const snapshot = await getDoc(userRef);

            if (snapshot.exists()) {
                dispatch(saveUserInfo(snapshot.data()));
                window.localStorage.setItem("userInfo", JSON.stringify(snapshot?.data()))
                transferLocalCartToFirebase(snapshot?.data())
            } else {
                console.warn("Không tìm thấy dữ liệu user trong Firestore");
            }

            message.success("Đăng nhập thành công");
            router?.push("/")
        } catch (error) {
            console.error("Lỗi đăng nhập:", error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Đăng xuất
    const logout = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            dispatch(saveUserInfo(null));
            localStorage.removeItem("userInfo");
            dispatch(initCart([]))
            console.log("Đăng xuất thành công");
        } catch (error) {
            console.error("Lỗi đăng xuất:", error.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        register,
        login,
        logout,
        loading,
    };
};

export default useAuthController;
