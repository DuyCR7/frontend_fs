import axios from "../../config/customer/axios";

const addToWishList = (productId) => {
    return axios.post(`/api/v1/wishlist/add-to-wishlist`, {
        productId: productId
    });
}

const getWishListCount = (cusId) => {
    return axios.get(`/api/v1/wishlist/get-count`, {
        params: {
            cusId: cusId
        }
    });
}

const getWishList = (cusId) => {
    return axios.get(`/api/v1/wishlist/get-wish-list`, {
        params: {
            cusId: cusId
        }
    });
}

const deleteWishListItem = (cusId, productId) => {
    return axios.delete(`/api/v1/wishlist/delete-wishlist-item`, {
        data: {
            cusId: cusId,
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