import axios from "../../config/admin/axios";

const createPost = (title, image, content, userId) => {
    const data = new FormData();
    data.append("title", title);
    data.append("image", image);
    data.append("content", content);
    data.append("userId", userId);

    return axios.post("/api/v1/admin/post/create", data);
}

const getAllPost = (page, limit, search = "", sort = {}) => {
    let query = `/api/v1/admin/post/read?page=${page}&limit=${limit}`;

    if (search) {
        query += `&search=${encodeURIComponent(search)}`;
    }

    if (sort && sort.key && sort.direction) {
        const sortQuery = JSON.stringify(sort);
        query += `&sort=${encodeURIComponent(sortQuery)}`;
    }

    return axios.get(query);
}

const updatePost = (id, title, image, content, userId) => {
    const data = new FormData();
    data.append("id", id);
    data.append("title", title);
    data.append("image", image);
    data.append("content", content);
    data.append("userId", userId);

    return axios.put("/api/v1/admin/post/update", data);
}

const setActivePost = (id) => {
    return axios.put(`/api/v1/admin/post/set-active`, { id: id });
}

const deletePost = (post) => {
    return axios.delete(`/api/v1/admin/post/delete`, { data: {id: post.id} });
}

export {
    createPost,
    getAllPost,
    updatePost,
    setActivePost,
    deletePost,
}