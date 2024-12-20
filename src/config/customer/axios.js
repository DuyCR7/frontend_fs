import axios from 'axios';
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import {store} from "../../redux/store";

import nProgress from "nprogress";
import {resetCustomer, updateCartCount, updateWishListCount} from "../../redux/customer/slices/customerSlice";
import {logoutCustomer} from "../../services/customer/authService";

nProgress.configure({
    showSpinner: false,
    trickleSpeed: 100
});

// Set config defaults when creating the instance
const instance = axios.create({
    baseURL: 'http://localhost:8080'
});

// các request gửi lên server sẽ đính kèm cookie vào
instance.defaults.withCredentials = true;

// Alter defaults after instance has been created
instance.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("cus_jwt")}`;

let hasShown403Error = false;
let isRefreshing = false;
let refreshSubscribers = [];
let hasAuthError = false;

// Hàm để đăng ký các yêu cầu cần được làm mới token
const subscribeTokenRefresh = (cb) => {
    refreshSubscribers.push(cb);
};

// Hàm để thông báo cho các yêu cầu rằng token đã được làm mới
const onRefreshed = (newToken) => {
    refreshSubscribers.map(cb => cb(newToken));
    refreshSubscribers = [];
};

// Hàm làm mới token
const refreshToken = async () => {
    try {
        const response = await axios.post('http://localhost:8080/api/v1/refresh-token', {}, { withCredentials: true });
        const { DT: newToken } = response.data;
        localStorage.setItem('cus_jwt', newToken);
        instance.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("cus_jwt")}`;
        onRefreshed(newToken);
        return newToken;
    } catch (error) {
        console.error('Unable to refresh token', error);
        window.location.href = "/sign-in";
        throw error;
    }
};

const handleDecoded = () => {
    let token = localStorage.getItem("cus_jwt");
    let decoded = {}
    if (token) {
        try {
            decoded = jwtDecode(token);
        } catch (error) {
            console.error("Invalid token:", error);
            // Xóa token không hợp lệ khỏi localStorage để tránh sử dụng lại
            localStorage.removeItem("cus_jwt");
        }
    }
    return { decoded };
}

// Add a request interceptor
instance.interceptors.request.use(async function (config) {
    // Do something before request is sent
    nProgress.start();

    const token = localStorage.getItem("cus_jwt");

    const currentTime = new Date();
    const {decoded} = handleDecoded();
    if (decoded?.exp && decoded.exp < currentTime.getTime() / 1000) {
        if (!isRefreshing) {
            isRefreshing = true;
            try {
                const newToken = await refreshToken();
                config.headers['Authorization'] = `Bearer ${newToken}`;
            } catch (error) {
                return Promise.reject(error);
            } finally {
                isRefreshing = false;
            }
        } else {
            return new Promise((resolve) => {
                subscribeTokenRefresh((newToken) => {
                    config.headers['Authorization'] = `Bearer ${newToken}`;
                    resolve(config);
                });
            });
        }
    } else {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    nProgress.done();
    return response.data;
}, async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    const status = error && error.response && error.response.status || 500;
    switch (status) {
        // authentication (token related issues)
        case 401: {
            if (!hasAuthError) {
                hasAuthError = true;
                const res = await logoutCustomer();
                if (res && res.EC === 0) {
                    localStorage.removeItem("cus_jwt");
                    await store.dispatch(resetCustomer());
                    await store.dispatch(updateCartCount(0));
                    await store.dispatch(updateWishListCount(0));
                    hasAuthError = false;

                    if (window.location.pathname !== '/'
                        && window.location.pathname !== '/sign-in'
                        && window.location.pathname !== '/sign-up') {
                        window.location.href = "/sign-in";
                    }
                } else {
                    toast.error(res.EM);
                }
            }

            nProgress.done();
            // toast.error(error.response.data.EM);
            return error.response.data;
        }

        // forbidden (permission related issues)
        case 403: {
            // toast.error("You don't have permission to access!");
            // return error.response.data;

            if (!hasShown403Error) {
                toast.error("You don't have permission to access!");
                hasShown403Error = true;
                // Reset the flag after some time (e.g., 5 seconds)
                setTimeout(() => {
                    hasShown403Error = false;
                }, 100);
            }
            nProgress.done();
            return Promise.resolve({error: "Forbidden"});
        }

        // bad request
        case 400: {
            nProgress.done();
            return error.response.data;
        }

        // not found
        case 404: {
            nProgress.done();
            return error.response.data;
        }

        // conflict
        case 409: {
            nProgress.done();
            return error.response.data;
        }

        // unprocessable
        case 422: {
            nProgress.done();
            return error.response.data;
        }

        // generic api error (server related) unexpected
        default: {
            nProgress.done();
            return error.response.data;
        }
    }
});

export default instance;