import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuthenticated: false,
    id: '',
    email: '',
    username: '',
    image: '',
    access_token: '',
    rolesAndPermissions: [],
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginUser: (state, action) => {
            const { isAuthenticated, id, email, username, image, access_token, rolesAndPermissions } = action.payload;

            state.isAuthenticated = isAuthenticated;
            state.id = id;
            state.email = email;
            state.username = username;
            state.image = image;
            state.access_token = access_token;
            state.rolesAndPermissions = rolesAndPermissions;
        },
        resetUser: (state) => {
            state.isAuthenticated = false;
            state.id = "";
            state.email = "";
            state.username = "";
            state.image = "";
            state.access_token = "";
            state.rolesAndPermissions = [];
        }
    },
})

// Action creators are generated for each case reducer function
export const { loginUser, resetUser } = userSlice.actions

export default userSlice.reducer