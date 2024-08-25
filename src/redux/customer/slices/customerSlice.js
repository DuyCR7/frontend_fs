import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuthenticated: false,
    id: '',
    email: '',
    image: '',
    access_token: '',
    typeLogin: '',
    cartCount: 0,
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
        }
    },
})

// Action creators are generated for each case reducer function
export const { loginCustomer, resetCustomer, updateCartCount } = customerSlice.actions

export default customerSlice.reducer