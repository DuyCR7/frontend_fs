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

const updateCategory = (id, name, parent_id, description, image) => {
    const data = new FormData();
    data.append("id", id);
    data.append("name", name);
    data.append("parent_id", parent_id);
    data.append("description", description);
    data.append("image", image);

    return axios.put("/api/v1/admin/category/update", data);
}

const setActiveCategory = (id) => {
    return axios.put(`/api/v1/admin/category/set-active`, { id: id });
}

const deleteCategory = (category) => {
    return axios.delete(`/api/v1/admin/category/delete`, { data: {id: category.id} });
}

export {
    getParentCategory,
    createCategory,
    getAllCategory,
    updateCategory,
    setActiveCategory,
    deleteCategory
}