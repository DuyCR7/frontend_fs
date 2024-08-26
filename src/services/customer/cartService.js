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

const getCart = (cusId) => {
    return axios.get(`/api/v1/cart/get-cart`, {
        params: {
            cusId,
        }
    });
}

const updateCartItemQuantity = (cartDetailId, newQuantity) => {
    return axios.put("/api/v1/cart/update-cart-item-quantity", {
        cartDetailId,
        newQuantity,
    });
}

const deleteCartItem = (cartDetailId) => {
    return axios.delete(`/api/v1/cart/delete-cart-item`, {
        data: {
            cartDetailId,
        }
    });
}

export {
    addToCart,
    getCount,
    getCart,
    updateCartItemQuantity,
    deleteCartItem,
}