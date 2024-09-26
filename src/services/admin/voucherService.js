import axios from "../../config/admin/axios";

const createVoucher = (code, discountType, discountValue, maxDiscountAmount, minOrderValue, startDate, endDate, usageLimit) => {
    return axios.post("/api/v1/admin/voucher/create", {
        code,
        discountType,
        discountValue,
        maxDiscountAmount,
        minOrderValue,
        startDate,
        endDate,
        usageLimit
    })
}

const getAllVouchers = (page, limit, search = "", sort = {}) => {
    let query = `/api/v1/admin/voucher/read?page=${page}&limit=${limit}`;

    if (search) {
        query += `&search=${encodeURIComponent(search)}`;
    }

    if (sort && sort.key && sort.direction) {
        const sortQuery = JSON.stringify(sort);
        query += `&sort=${encodeURIComponent(sortQuery)}`;
    }

    return axios.get(query);
}

const updateVoucher = (id, code, discountType, discountValue, maxDiscountAmount, minOrderValue, startDate, endDate, usageLimit) => {
    return axios.put(`/api/v1/admin/voucher/update`, {
        id,
        code,
        discountType,
        discountValue,
        maxDiscountAmount,
        minOrderValue,
        startDate,
        endDate,
        usageLimit
    });
}

const setActiveVoucher = (id) => {
    return axios.put(`/api/v1/admin/voucher/set-active`, { id: id });
}

export {
    createVoucher,
    getAllVouchers,
    updateVoucher,
    setActiveVoucher,
}