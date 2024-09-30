import axios from "../../config/admin/axios";

const getStatisticSome = () => {
    return axios.get('/api/v1/admin/statistic/get-statistic-some')
}

const getRevenue = (type, year) => {
    return axios.get('/api/v1/admin/statistic/get-revenue', {
        params: {
            type,
            year
        }
    })
}

const getBestSlowSelling = (type, year) => {
    return axios.get('/api/v1/admin/statistic/get-best-slow-selling', {
        params: {
            type,
            year
        }
    })
}

const getBestWishlist = () => {
    return axios.get('/api/v1/admin/statistic/get-best-wishlist')
}

const getOrderStatus = (type, value) => {
    return axios.get('/api/v1/admin/statistic/get-order-status', {
        params: {
            type,
            value
        }
    })
}

const getAvailableProduct = (page, limit) => {
    return axios.get(`/api/v1/admin/statistic/get-available-product?page=${page}&limit=${limit}`);
}

export {
    getStatisticSome,
    getRevenue,
    getBestSlowSelling,
    getBestWishlist,
    getOrderStatus,
    getAvailableProduct,
}