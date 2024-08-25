import axios from "../../config/customer/axios";

const addToCart = (productId, productDetailId, quantity) => {
    return axios.post("/api/v1/cart/add-to-cart", {
        productId,
        productDetailId,
        quantity,
    });
}

const getCount = (cusId) => {
    return axios.get(`/api/v1/cart/get-count`, {
        params: {
            cusId,
        }
    });
}

export {
    addToCart,
    getCount,
}