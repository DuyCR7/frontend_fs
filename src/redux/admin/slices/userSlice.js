import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuthenticated: false,
    email: '',
    username: '',
    image: '',
    access_token: '',
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginUser: (state, action) => {
            const { isAuthenticated, email, username, image, access_token } = action.payload;

            state.isAuthenticated = isAuthenticated;
            state.email = email;
            state.username = username;
            state.image = image;
            state.access_token = access_token;
        },
        resetUser: (state) => {
            state.isAuthenticated = false;
            state.email = "";
            state.username = "";
            state.image = "";
            state.access_token = "";
        }
    },
})

// Action creators are generated for each case reducer function
export const { loginUser, resetUser } = userSlice.actions

export default userSlice.reducer