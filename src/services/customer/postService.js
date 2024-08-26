import axios from "../../config/customer/axios";

const getAllPost = () => {
    return axios.get("/api/v1/post/get-all-post");
}

const getSinglePost = (slug) => {
    return axios.get(`/api/v1/post/get-single-post/${slug}`)
}

const incrementViewCount = (slug) => {
    return axios.post(`/api/v1/post/increment-view-count/${slug}`)
}

const getPopularPost = () => {
    return axios.get("/api/v1/post/get-popular-post");
}

export {
    getAllPost,
    getSinglePost,
    incrementViewCount,
    getPopularPost,
}