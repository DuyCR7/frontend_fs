import axios from "../../config/customer/axios";

const getAllPost = () => {
    return axios.get("/api/v1/post/get-all-post");
}

const getSinglePost = (slug) => {
    return axios.get(`/api/v1/post/get-single-post/${slug}`)
}

export {
    getAllPost,
    getSinglePost,
}