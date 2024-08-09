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

export {
    getAllBanners,
    getAllTeams,
    getAllParentCategories,
    getNewEvent,
}