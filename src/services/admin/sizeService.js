import axios from "../../config/admin/axios";

const createSize = (name, code, description) => {
    return axios.post("/api/v1/admin/size/create", {
        name,
        code,
        description,
    });
}

const getAllSize = (page, limit, search = "", sort = {}) => {
    let query = `/api/v1/admin/size/read?page=${page}&limit=${limit}`;

    if (search) {
        query += `&search=${encodeURIComponent(search)}`;
    }

    if (sort && sort.key && sort.direction) {
        const sortQuery = JSON.stringify(sort);
        query += `&sort=${encodeURIComponent(sortQuery)}`;
    }

    return axios.get(query);
}

const setActiveSize = (id) => {
    return axios.put(`/api/v1/admin/size/set-active`, { id: id });
}

const updateSize = (id, name, code, description) => {
    return axios.put("/api/v1/admin/size/update", {
        id,
        name,
        code,
        description,
    });
}

const deleteSize = (size) => {
    return axios.delete(`/api/v1/admin/size/delete`, { data: {id: size.id} });
}

export {
    createSize,
    getAllSize,
    setActiveSize,
    updateSize,
    deleteSize,
}