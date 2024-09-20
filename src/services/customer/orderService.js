import axios from "../../config/customer/axios";

const getMyOrders = () => {
    return axios.get(`/api/v1/order/my-orders`);
}

export {
    getMyOrders,
}