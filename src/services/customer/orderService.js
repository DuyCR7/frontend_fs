import axios from "../../config/customer/axios";

const getMyOrders = (page, limit) => {
    return axios.get(`/api/v1/order/my-orders?page=${page}&limit=${limit}`);
}

const cancelOrder = (orderId) => {
    return axios.put(`/api/v1/order/cancel/${orderId}`);
}

const confirmReceivedOrder = (orderId) => {
    return axios.put(`/api/v1/order/confirm-received/${orderId}`);
}

export {
    getMyOrders,
    cancelOrder,
    confirmReceivedOrder,
}