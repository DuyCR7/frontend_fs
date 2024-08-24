import axios from "../../config/customer/axios";

const getAllBanners = () => {
    return axios.get("/api/v1/banner/read");
}

const getAllTeams = () => {
    return axios.get("/api/v1/team/read");
}

const getAllParentCategories = () => {
    return axios.get("/api/v1/category/read-parent");
}

const getNewEvent = () => {
    return axios.get("/api/v1/event/get-new-event");
}

const getAllTrending = () => {
    return axios.get("/api/v1/product/get-all-trending");
}

const getAllForSearch = (search) => {
    return axios.get("/api/v1/product/get-search-products", {
        params: {search: search}
    });
}

const getAllSellerClothing = () => {
    return axios.get("/api/v1/product/get-all-seller-clothing");
}

const getPosts = () => {
    return axios.get(`/api/v1/post/get-post`)
}
export {
    getAllBanners,
    getAllTeams,
    getAllParentCategories,
    getNewEvent,
    getAllTrending,
    getAllForSearch,
    getAllSellerClothing,
    getPosts,
}