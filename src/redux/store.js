import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import userSlice from './slices/userSlice';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        user: userSlice,
    }
});

export default store;
