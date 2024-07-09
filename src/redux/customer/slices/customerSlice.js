import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuthenticated: false,
    email: '',
    image: '',
    access_token: '',
}

export const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        loginCustomer: (state, action) => {
            const { isAuthenticated, email, image, access_token } = action.payload;

            state.isAuthenticated = isAuthenticated;
            state.email = email;
            state.image = image;
            state.access_token = access_token;
        },
        resetCustomer: (state) => {
            state.isAuthenticated = false;
            state.email = "";
            state.image = "";
            state.access_token = "";
        }
    },
})

// Action creators are generated for each case reducer function
export const { loginCustomer, resetCustomer } = customerSlice.actions

export default customerSlice.reducer