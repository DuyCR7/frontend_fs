import axios from "../../config/customer/axios";

const addToCart = (productId, productDetailId, quantity) => {
    return axios.post("/api/v1/cart/add-to-cart", {
        productId,
        productDetailId,
        quantity,
    });
}

const getCartCount = () => {
    return axios.get(`/api/v1/cart/get-count`);
}

const getCart = () => {
    return axios.get(`/api/v1/cart/get-cart`);
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
    getCartCount,
    getCart,
    updateCartItemQuantity,
    deleteCartItem,
}