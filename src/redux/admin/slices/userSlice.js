import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuthenticated: false,
    id: '',
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
            const { isAuthenticated, id, email, username, image, access_token } = action.payload;

            state.isAuthenticated = isAuthenticated;
            state.id = id;
            state.email = email;
            state.username = username;
            state.image = image;
            state.access_token = access_token;
        },
        resetUser: (state) => {
            state.isAuthenticated = false;
            state.id = "";
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