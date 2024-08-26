import axios from "../../config/customer/axios";

const addToWishList = (productId) => {
    return axios.post(`/api/v1/wishlist/add-to-wishlist`, {
        productId: productId
    });
}

const getWishListCount = () => {
    return axios.get(`/api/v1/wishlist/get-count`);
}

const getWishList = () => {
    return axios.get(`/api/v1/wishlist/get-wish-list`);
}

const deleteWishListItem = (productId) => {
    return axios.delete(`/api/v1/wishlist/delete-wishlist-item`, {
        data: {
            productId: productId
        }
    });
}

export {
    addToWishList,
    getWishListCount,
    getWishList,
    deleteWishListItem,
}