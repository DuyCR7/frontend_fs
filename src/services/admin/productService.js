import axios from "../../config/admin/axios";

const getAllCategory = () => {
    return axios.get('/api/v1/admin/product/get-category');
}

const getAllTeam = () => {
    return axios.get('/api/v1/admin/product/get-team');
}

const getAllColor = () => {
    return axios.get('/api/v1/admin/product/get-color');
}

const getAllSize = () => {
    return axios.get('/api/v1/admin/product/get-size');
}

export {
    getAllCategory,
    getAllTeam,
    getAllColor,
    getAllSize,
}