import axios from "../../config/customer/axios";

const getAllTeams = () => {
    return axios.get("/api/v1/team/read");
}

export {
    getAllTeams,
}