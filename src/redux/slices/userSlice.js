import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        info: null,
    },
    reducers: {
        saveUserInfo: (state, action) => {
            state.info = action.payload;
        }
    },
});

export const { saveUserInfo } = userSlice.actions;
export default userSlice.reducer;
