import axios from "../../config/admin/axios";

const getParentCategory = () => {
    return axios.get("/api/v1/admin/category/get-parent");
}

const createCategory = (name, parent_id, description, image) => {
    const data = new FormData();
    data.append("name", name);
    data.append("parent_id", parent_id);
    data.append("description", description);
    data.append("image", image);

    return axios.post("/api/v1/admin/category/create", data);
}

const getAllCategory = () => {
    return axios.get('/api/v1/admin/category/read');
}

export {
    getParentCategory,
    createCategory,
    getAllCategory,
}