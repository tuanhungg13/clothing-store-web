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
                const listItems = await getInventoryForCartItems(cartItems)
                dispatch(initCart(listItems));
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
            item?.productId === cartItem?.productId &&
            item?.variant?.color === cartItem?.variant?.color &&
            item?.variant?.size === cartItem?.variant?.size
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
                    item?.productId === cartItem?.productId &&
                    item?.variant?.color === cartItem?.variant?.color &&
                    item?.variant?.size === cartItem?.variant?.size
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
            message.success("Thêm sản phẩm vào giỏ hàng thành công!");
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
    const updateCartItem = async ({ productId, variant, newQuantity }) => {
        try {
            const user = auth?.currentUser;
            let updatedCartItems = [];

            if (user && userInfo?.cartId) {
                const cartRef = doc(db, 'carts', userInfo.cartId);
                const cartSnap = await getDoc(cartRef);

                if (cartSnap.exists()) {
                    let cartItems = cartSnap.data()?.cartItems || [];
                    const matchIndex = cartItems.findIndex(item =>
                        item.productId === productId &&
                        item.variant.color === variant.color &&
                        item.variant.size === variant.size
                    );

                    if (matchIndex > -1) {
                        cartItems[matchIndex].quantity = newQuantity;
                        await updateDoc(cartRef, { cartItems });
                    }

                    updatedCartItems = cartItems;
                }
            } else {
                let localCart = JSON.parse(localStorage.getItem(LOCAL_CART_KEY)) || [];
                const matchIndex = localCart.findIndex(item =>
                    item.productId === productId &&
                    item.variant.color === variant.color &&
                    item.variant.size === variant.size
                );

                if (matchIndex > -1) {
                    localCart[matchIndex].quantity = newQuantity;
                    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(localCart));
                }

                updatedCartItems = localCart;
            }

            const cartWithStock = await getInventoryForCartItems(updatedCartItems);
            dispatch(initCart(cartWithStock));

            message.success("Thay đổi số lượng thành công");
        } catch (error) {
            console.error("🔥 Lỗi khi cập nhật sản phẩm:", error);
            message.error("Không thể cập nhật số lượng sản phẩm.");
        }
    };


    const removeCartItem = async ({ productId, variant }) => {
        try {
            const user = auth?.currentUser;

            if (user && userInfo?.cartId) {
                const cartRef = doc(db, 'carts', userInfo.cartId);
                const cartSnap = await getDoc(cartRef);

                if (cartSnap.exists()) {
                    let cartItems = cartSnap.data()?.cartItems || [];
                    cartItems = cartItems.filter(item =>
                        !(item.productId === productId &&
                            item.variant.color === variant.color &&
                            item.variant.size === variant.size)
                    );
                    await updateDoc(cartRef, { cartItems });
                    dispatch(initCart(cartItems));
                }
            } else {
                let localCart = JSON.parse(localStorage.getItem(LOCAL_CART_KEY)) || [];
                localCart = localCart.filter(item =>
                    !(item.productId === productId &&
                        item.variant.color === variant.color &&
                        item.variant.size === variant.size)
                );
                localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(localCart));
                dispatch(initCart(localCart));
            }
        } catch (error) {
            console.error("🔥 Lỗi khi xoá sản phẩm:", error);
            message.error("Không thể xoá sản phẩm khỏi giỏ hàng.");
        }
    };

    const removeMultipleCartItems = async (itemsToRemove) => {
        try {
            const user = auth?.currentUser;

            if (user && userInfo?.cartId) {
                const cartRef = doc(db, 'carts', userInfo?.cartId);
                const cartSnap = await getDoc(cartRef);

                if (cartSnap.exists()) {
                    let cartItems = cartSnap?.data()?.cartItems || [];

                    // Lọc ra những sản phẩm KHÔNG nằm trong danh sách xóa
                    cartItems = cartItems.filter(item => {
                        return !itemsToRemove.some(toRemove =>
                            item?.productId === toRemove?.productId &&
                            item?.variant?.color === toRemove?.variant?.color &&
                            item?.variant?.size === toRemove?.variant?.size
                        );
                    });

                    await updateDoc(cartRef, { cartItems });
                    dispatch(initCart(cartItems));
                }
            } else {
                let localCart = JSON.parse(localStorage.getItem(LOCAL_CART_KEY)) || [];

                localCart = localCart.filter(item => {
                    return !itemsToRemove.some(toRemove =>
                        item.productId === toRemove.productId &&
                        item.variant.color === toRemove.variant.color &&
                        item.variant.size === toRemove.variant.size
                    );
                });

                localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(localCart));
                dispatch(initCart(localCart));
            }
        } catch (error) {
            console.error("🔥 Lỗi khi xoá nhiều sản phẩm:", error);
            message.error("Không thể xoá các sản phẩm khỏi giỏ hàng.");
        }
    };

    const getInventoryForCartItems = async (cartItems) => {
        const updatedItems = [];

        for (const item of cartItems) {
            const { productId, variant } = item;

            try {
                const docRef = doc(db, "products", productId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const product = docSnap.data();

                    const colorMatch = product.variants?.find(v => v?.color === variant?.color);
                    const sizeMatch = colorMatch?.sizes?.find(s => s?.size === variant?.size);

                    const stock = sizeMatch?.quantity ?? 0;

                    updatedItems.push({ ...item, stock });
                } else {
                    updatedItems.push({ ...item, stock: 0 });
                }
            } catch (error) {
                console.error(`Lỗi khi lấy tồn kho sản phẩm ${productId}:`, error);
                updatedItems.push({ ...item, stock: 0 });
            }
        }

        return updatedItems;
    };


    return {
        addToCartFunc,
        transferLocalCartToFirebase,
        getUserCartFromFirebase,
        updateCartItem,
        removeCartItem,
        removeMultipleCartItems,
        getInventoryForCartItems
    };
};

export default useCartController;
