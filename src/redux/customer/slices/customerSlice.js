import { createSlice } from '@reduxjs/toolkit'

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
}

export const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        loginCustomer: (state, action) => {
            const { isAuthenticated, id, email, image, access_token, typeLogin } = action.payload;

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
    },
})

// Action creators are generated for each case reducer function
export const { loginCustomer, resetCustomer, updateCartCount, setWishList, updateWishListCount } = customerSlice.actions

export default customerSlice.reducer