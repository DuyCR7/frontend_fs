import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isOpenChatBox: false,
    currentProduct: null,
}

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        openChatBox: (state, action) => {
            state.isOpenChatBox = true;
            state.currentProduct = action.payload;
        },
        closeChatBox: (state) => {
            state.isOpenChatBox = false;
            state.currentProduct = null;
        },
        setCurrentProduct: (state) => {
            state.currentProduct = null;
        }
    },
})

// Action creators are generated for each case reducer function
export const { openChatBox, closeChatBox, setCurrentProduct } = chatSlice.actions

export default chatSlice.reducer