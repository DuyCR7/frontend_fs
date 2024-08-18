import axios from "../../config/admin/axios";

const createTeam = (name, type, image) => {
    const data = new FormData();
    data.append("name", name);
    data.append("type", type);
    data.append("image", image);

    return axios.post("/api/v1/admin/team/create", data);
}

const getAllTeam = (page, limit, search = "", sort = {}) => {
    let query = `/api/v1/admin/team/read?page=${page}&limit=${limit}`;

    if (search) {
        query += `&search=${encodeURIComponent(search)}`;
    }

    if (sort && sort.key && sort.direction) {
        const sortQuery = JSON.stringify(sort);
        query += `&sort=${encodeURIComponent(sortQuery)}`;
    }

    return axios.get(query);
}

const updateTeam = (id, name, type, image) => {
    const data = new FormData();
    data.append("id", id);
    data.append("name", name);
    data.append("type", type);
    data.append("image", image);

    return axios.put("/api/v1/admin/team/update", data);
}

const setActiveTeam = (id) => {
    return axios.put(`/api/v1/admin/team/set-active`, { id: id });
}

const deleteTeam = (team) => {
    return axios.delete(`/api/v1/admin/team/delete`, { data: {id: team.id} });
}

export {
    createTeam,
    getAllTeam,
    updateTeam,
    setActiveTeam,
    deleteTeam,
}