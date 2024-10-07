import axios from "../../config/admin/axios";

const getAllRoles = () => {
    return axios.get("/api/v1/admin/user/get-all-roles");
}

const createUser = (email, password, phone, username, image, roles) => {
    const data = new FormData();
    data.append("email", email);
    data.append("password", password);
    data.append("phone", phone);
    data.append("username", username);
    data.append("image", image);

    if (roles.length === 1) {
        data.append("roles[]", roles[0]);  // Gửi như mảng nếu chỉ có một phần tử
    } else {
        roles.forEach(roleId => {
            data.append("roles[]", roleId); // Gửi như mảng nếu có nhiều phần tử
        });
    }

    return axios.post("/api/v1/admin/user/create", data);
}

const getAllUsers = (page, limit, search = "", sort = {}) => {
    let query = `/api/v1/admin/user/read?page=${page}&limit=${limit}`;

    if (search) {
        query += `&search=${encodeURIComponent(search)}`;
    }

    if (sort && sort.key && sort.direction) {
        const sortQuery = JSON.stringify(sort);
        query += `&sort=${encodeURIComponent(sortQuery)}`;
    }

    return axios.get(query);
}

const updateUser = (id, email, image, roles) => {
    const data = new FormData();
    data.append("id", id);
    data.append("email", email);
    data.append("image", image);

    if (roles.length === 1) {
        data.append("roles[]", roles[0]);  // Gửi như mảng nếu chỉ có một phần tử
    } else {
        roles.forEach(roleId => {
            data.append("roles[]", roleId); // Gửi như mảng nếu có nhiều phần tử
        });
    }

    return axios.put(`/api/v1/admin/user/update`, data);
}

const setActiveUser = (id) => {
    return axios.put(`/api/v1/admin/user/set-active`, { id: id });
}

export {
    getAllRoles,
    createUser,
    getAllUsers,
    updateUser,
    setActiveUser,
}