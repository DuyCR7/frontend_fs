import axios from "../../config/admin/axios";

const getAllOrders = (page, limit, search = "", sort = {}, statuses = []) => {
    let query = `/api/v1/admin/order/read?page=${page}&limit=${limit}`;

    if (search) {
        query += `&search=${encodeURIComponent(search)}`;
    }

    if (sort && sort.key && sort.direction) {
        const sortQuery = JSON.stringify(sort);
        query += `&sort=${encodeURIComponent(sortQuery)}`;
    }

    if (statuses && statuses.length > 0) {
        query += `&statuses=${encodeURIComponent(JSON.stringify(statuses))}`;
    }

    return axios.get(query);
}

const updateOrderStatus = (orderId, newStatus) => {
    return axios.put(`/api/v1/admin/order/update-status/${orderId}`, { newStatus: newStatus });
}

export {
    getAllOrders,
    updateOrderStatus,
}