import axios from "../../config/admin/axios";

const signInUser = (email, password) => {
    return axios.post('/api/v1/admin/sign-in', {
        email,
        password,
        delay: 1500
    });
}

const logoutUser = () => {
    return axios.post("/api/v1/admin/logout");
}

const getUserAccount = () => {
    return axios.get("/api/v1/admin/account");
}

const getUserById = (id) => {
    return axios.get(`/api/v1/admin/get-by-id/${id}`);
}

export {
    signInUser,
    logoutUser,
    getUserAccount,
    getUserById
}