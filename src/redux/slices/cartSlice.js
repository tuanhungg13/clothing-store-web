import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [], // Mỗi item gồm: productId, productName, image, price, color, size, quantity
    },
    reducers: {
        initCart: (state, action) => {
            state.items = action.payload || [];
        },
        addToCart: (state, action) => {
            const { product, quantity = 1, variant } = action?.payload;
            const { color, size } = variant;

            const existingItem = state?.items?.find(item =>
                item?.productId === product?.productId &&
                item?.variant?.color === color &&
                item?.variant?.size === size
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state?.items?.push({
                    productId: product?.productId,
                    productName: product?.productName,
                    image: product?.images[0],
                    price: product?.price,
                    variant: variant,
                    quantity
                });
            }
        },
        removeFromCart: (state, action) => {
            const { productId, color, size } = action.payload;
            state.items = state.items.filter(item =>
                !(item.productId === productId && item.color === color && item.size === size)
            );
        },
        updateQuantity: (state, action) => {
            const { productId, color, size, quantity } = action.payload;
            const item = state.items.find(item =>
                item.productId === productId &&
                item.color === color &&
                item.size === size
            );
            if (item) {
                if (quantity > 0) {
                    item.quantity = quantity;
                } else {
                    state.items = state.items.filter(i =>
                        !(i.productId === productId && i.color === color && i.size === size)
                    );
                }
            }
        },
        clearCart: (state) => {
            state.items = [];
        }
    }
});

export const {
    initCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
