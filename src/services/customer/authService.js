import axios from "../../config/customer/axios";

const signUpCustomer = (email, password) => {
    return axios.post('/api/v1/sign-up', {
        email,
        password,
    });
}

const signInCustomer = (email, password) => {
    return axios.post('/api/v1/sign-in', {
        email,
        password,
        delay: 1500
    });
}

const logoutCustomer = () => {
    return axios.post("/api/v1/logout");
}

const testApi = () => {
    return axios.get('/api/v1/test');
}

export {
    signUpCustomer,
    signInCustomer,
    logoutCustomer,
    testApi,
}
