import axios from "../../config/admin/axios";

const createBanner = (name, image, url) => {
    const data = new FormData();
    data.append("name", name);
    data.append("image", image);
    data.append("url", url);

    return axios.post("/api/v1/admin/banner/create", data);
}

const getAllBanner = (page, limit, search = "", sort = {}) => {
    let query = `/api/v1/admin/banner/read?page=${page}&limit=${limit}`;

    if (search) {
        query += `&search=${encodeURIComponent(search)}`;
    }

    if (sort && sort.key && sort.direction) {
        const sortQuery = JSON.stringify(sort);
        query += `&sort=${encodeURIComponent(sortQuery)}`;
    }

    return axios.get(query);
}

const setActiveBanner = (id) => {
    return axios.put(`/api/v1/admin/banner/set-active`, { id: id });
}

const updateBanner = (id, name, image, url) => {
    const data = new FormData();
    data.append("id", id);
    data.append("name", name);
    data.append("image", image);
    data.append("url", url);

    return axios.put(`/api/v1/admin/banner/update`, data);
}

const deleteBanner = (banner) => {
    return axios.delete(`/api/v1/admin/banner/delete`, { data: {id: banner.id} });
}

const deleteManyBanners = (selectedIds) => {
    return axios.delete('/api/v1/admin/banner/delete-many', {data: {ids: selectedIds}});
}

export {
    createBanner,
    getAllBanner,
    setActiveBanner,
    updateBanner,
    deleteBanner,
    deleteManyBanners,
}