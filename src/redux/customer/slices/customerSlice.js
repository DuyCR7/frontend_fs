import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    isAuthenticated: false,
    id: '',
    email: '',
    image: '',
    access_token: '',
    typeLogin: '',
    cartCount: 0,
    wishListCount: 0,
    wishList: [],
    selectedItemsForPayment: [],
}

export const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        loginCustomer: (state, action) => {
            const {isAuthenticated, id, email, image, access_token, typeLogin} = action.payload;

            state.isAuthenticated = isAuthenticated;
            state.id = id;
            state.email = email;
            state.image = image;
            state.access_token = access_token;
            state.typeLogin = typeLogin;
        },
        resetCustomer: (state) => {
            state.isAuthenticated = false;
            state.id = "";
            state.email = "";
            state.image = "";
            state.access_token = "";
            state.typeLogin = "";
            state.cartCount = 0;
            state.wishListCount = 0;
            state.wishList = [];
            state.selectedItemsForPayment = [];
        },
        updateCartCount: (state, action) => {
            state.cartCount = action.payload;
        },
        setWishList: (state, action) => {
            state.wishList = action.payload;
        },
        updateWishListCount: (state, action) => {
            state.wishListCount = action.payload;
        },
        setSelectedItemsForPayment: (state, action) => {
            state.selectedItemsForPayment = action.payload;
        },
        clearSelectedItemsForPayment: (state, action) => {
            state.selectedItemsForPayment = [];
        }
    },
})

// Action creators are generated for each case reducer function
export const {
    loginCustomer,
    resetCustomer,
    updateCartCount,
    setWishList,
    updateWishListCount,
    setSelectedItemsForPayment,
    clearSelectedItemsForPayment
} = customerSlice.actions

export default customerSlice.reducer