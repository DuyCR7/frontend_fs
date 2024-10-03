import axios from "../../config/admin/axios";

const getAllCustomers = (page, limit, search = "", sort = {}) => {
    let query = `/api/v1/admin/customer/read?page=${page}&limit=${limit}`;

    if (search) {
        query += `&search=${encodeURIComponent(search)}`;
    }

    if (sort && sort.key && sort.direction) {
        const sortQuery = JSON.stringify(sort);
        query += `&sort=${encodeURIComponent(sortQuery)}`;
    }

    return axios.get(query);
}

const lockCustomer = (cusId) => {
    return axios.put(`/api/v1/admin/customer/lock`, {
        cusId: cusId,
    });
}

const unlockCustomer = (cusId) => {
    return axios.put(`/api/v1/admin/customer/unlock`, {
        cusId: cusId,
    });
}

export {
    getAllCustomers,
    lockCustomer,
    unlockCustomer,
}