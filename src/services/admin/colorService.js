import axios from "../../config/admin/axios";

const createColor = (name, code, description) => {
    return axios.post("/api/v1/admin/color/create", {
        name,
        code,
        description,
    });
}

const getAllColor = (page, limit, search = "", sort = {}) => {
    let query = `/api/v1/admin/color/read?page=${page}&limit=${limit}`;

    if (search) {
        query += `&search=${encodeURIComponent(search)}`;
    }

    if (sort && sort.key && sort.direction) {
        const sortQuery = JSON.stringify(sort);
        query += `&sort=${encodeURIComponent(sortQuery)}`;
    }

    return axios.get(query);
}

const setActiveColor = (id) => {
    return axios.put(`/api/v1/admin/color/set-active`, { id: id });
}

const updateColor = (id, name, code, description) => {
    return axios.put("/api/v1/admin/color/update", {
        id,
        name,
        code,
        description,
    });
}

const deleteColor = (color) => {
    return axios.delete(`/api/v1/admin/color/delete`, { data: {id: color.id} });
}

export {
    createColor,
    getAllColor,
    setActiveColor,
    updateColor,
    deleteColor,
}