import axios from "../../config/admin/axios";

const createTeam = (name, image) => {
    const data = new FormData();
    data.append("name", name);
    data.append("image", image);

    return axios.post("/api/v1/admin/team/create", data);
}

export {
    createTeam
}