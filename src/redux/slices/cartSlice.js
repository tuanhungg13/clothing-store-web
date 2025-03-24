import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import CartController from '@/controllers/CartController';
// const { addToCartFunc } = CartController()
export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
    },
    reducers: {
        initCart: (state, action) => {
            state.items = action.payload;
        },
        // addToCartWithoutLogin: (state, action) => {
        //     const product = action?.payload?.product;
        //     const quantity = action?.payload?.quantity || 0;
        //     const { variantId, variantName } = action?.payload?.variant;
        //     const variantPrice = action?.payload?.variant?.price;
        //     const variantPriceBeforeDiscount = action?.payload?.variant?.priceBeforeDiscount
        //     const existingItem = state.items.find(item => item?.variantId === variantId);
        //     if (existingItem) {
        //         if (quantity) {
        //             existingItem.quantity += quantity; // Tăng số lượng sản phẩm
        //         }
        //         else {
        //             state.items = state.items.filter(item => item?.variantId !== variantId);
        //         }
        //     } else if (quantity) {
        //         state.items.push({ ...product, variantId, variantName, variantPrice, variantPriceBeforeDiscount, quantity }); // Thêm sản phẩm mới
        //     }
        //     window.localStorage.setItem("dataCart", JSON.stringify(state?.items));
        // },
        // removeFromCart: (state, action) => {
        //     const removeIds = action?.payload;
        //     state.items = state.items.filter(item => removeIds.indexOf(item?.variantId) < 0);
        //     window.localStorage.setItem("dataCart", JSON.stringify(state?.items));
        // },
        // updateQuantity: (state, action) => {
        //     //            const product = action?.payload?.product;
        //     const quantity = action?.payload?.quantity || 0;
        //     const variantId = action?.payload?.variantId;
        //     const existingItem = state.items.find(item => item?.variantId === variantId);
        //     if (existingItem) {
        //         if (quantity > 0) {
        //             existingItem.quantity = quantity; // Cập nhật số lượng sản phẩm
        //         }
        //         else {
        //             state.items = state.items.filter(item => item?.variantId !== variantId);
        //         }
        //     }
        //     window.localStorage.setItem("dataCart", JSON.stringify(state?.items));
        // },
    },
});

export const { initCart } = cartSlice.actions;

// export const addToCart = createAsyncThunk("cart/addToCart", async (payload, { dispatch, rejectWithValue }) => {
//     try {
//         dispatch(addToCartFunc(payload))
//     } catch (error) {
//         return rejectWithValue(error?.message)
//     }
// })

export default cartSlice.reducer;
