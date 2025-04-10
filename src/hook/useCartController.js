import { useDispatch, useSelector } from 'react-redux';
import { addToCart, initCart } from '@/redux/slices/cartSlice';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '@/utils/config/configFirebase';
import { message } from 'antd';

const LOCAL_CART_KEY = "cartItems";

const useCartController = () => {
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.user?.info);

    const getUserCartFromFirebase = async (info) => {
        try {
            console.log(info)
            if (!info?.cartId) {
                return;
            }

            const cartRef = doc(db, 'carts', info?.cartId);
            const cartSnap = await getDoc(cartRef);

            if (cartSnap.exists()) {
                const cartItems = cartSnap.data()?.cartItems || [];
                dispatch(initCart(cartItems));
            } else {
                message?.error("Đồng bộ giỏ hàng thất bại")
                dispatch(initCart([]));
            }
        } catch (error) {
            console.error("🔥 Lỗi khi lấy giỏ hàng:", error);
            message.error("Không thể lấy giỏ hàng. Vui lòng thử lại!");
        }
    };

    const saveToLocalCart = (cartItem) => {
        let localCart = JSON.parse(localStorage.getItem(LOCAL_CART_KEY)) || [];

        const matchIndex = localCart.findIndex(item =>
            item.productId === cartItem.productId &&
            item.variant.color === cartItem.variant.color &&
            item.variant.size === cartItem.variant.size
        );

        if (matchIndex > -1) {
            localCart[matchIndex].quantity += cartItem.quantity;
        } else {
            localCart.push(cartItem);
        }

        localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(localCart));
    };

    const addToCartFunc = async ({ product, variant, quantity = 1 }) => {
        const user = auth?.currentUser;
        const cartItem = {
            productId: product?.productId,
            productName: product?.productName,
            image: product?.images[0],
            price: product?.price,
            variant,
            quantity
        };

        try {
            if (user && userInfo?.cartId) {
                const cartRef = doc(db, 'carts', userInfo?.cartId);
                const cartSnap = await getDoc(cartRef);
                let cartItems = cartSnap.exists() ? cartSnap.data()?.cartItems || [] : [];

                const matchIndex = cartItems.findIndex(item =>
                    item.productId === cartItem.productId &&
                    item.variant.color === cartItem.variant.color &&
                    item.variant.size === cartItem.variant.size
                );

                if (matchIndex > -1) {
                    cartItems[matchIndex].quantity += quantity;
                    await updateDoc(cartRef, { cartItems });
                } else {
                    await updateDoc(cartRef, {
                        cartItems: arrayUnion(cartItem)
                    });
                }
            } else {
                saveToLocalCart(cartItem);
            }

            dispatch(addToCart({ product, variant, quantity }));
        } catch (error) {
            console.error("🔥 Lỗi khi thêm vào giỏ hàng:", error);
            message.error("Có lỗi xảy ra. Vui lòng thử lại!");
        }
    };

    const transferLocalCartToFirebase = async (info) => {
        const localCart = JSON.parse(localStorage.getItem(LOCAL_CART_KEY)) || [];
        if (!info?.uid || !info?.cartId || localCart.length === 0) return;

        const cartRef = doc(db, 'carts', info?.cartId);
        const cartSnap = await getDoc(cartRef);
        let existingItems = cartSnap.exists() ? cartSnap.data()?.cartItems || [] : [];

        for (const item of localCart) {
            const index = existingItems.findIndex(existing =>
                existing.productId === item.productId &&
                existing.variant.color === item.variant.color &&
                existing.variant.size === item.variant.size
            );

            if (index > -1) {
                existingItems[index].quantity += item.quantity;
            } else {
                existingItems.push(item);
            }
        }

        if (!cartSnap.exists()) {
            await setDoc(cartRef, { cartItems: existingItems });
        } else {
            await updateDoc(cartRef, { cartItems: existingItems });
        }
        dispatch(initCart(existingItems));
        localStorage.removeItem(LOCAL_CART_KEY);
    };

    return {
        addToCartFunc,
        transferLocalCartToFirebase,
        getUserCartFromFirebase
    };
};

export default useCartController;
