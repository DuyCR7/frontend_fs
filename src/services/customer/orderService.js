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

const submitReview = (productId, rating, comment) => {
    return axios.post(`/api/v1/order/submit-review/${productId}`, {
        rating: rating,
        comment: comment,
    });
}

const updateReview = (reviewId, rating, comment) => {
    return axios.put(`/api/v1/order/update-review/${reviewId}`, {
        rating: rating,
        comment: comment,
    });
}

export {
    getMyOrders,
    cancelOrder,
    confirmReceivedOrder,
    submitReview,
    updateReview,
}