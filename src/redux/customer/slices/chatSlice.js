import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isOpenChatBox: false,
    currentProduct: null,
    unreadCount: 0,
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
        },
        setUnreadCount: (state, action) => {
            state.unreadCount = action.payload;
        }
    },
})

// Action creators are generated for each case reducer function
export const { openChatBox, closeChatBox, setCurrentProduct, setUnreadCount } = chatSlice.actions

export default chatSlice.reducer