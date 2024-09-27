import axios from "../../config/customer/axios";

const getAllVouchersForGuest = (page, limit) => {
    return axios.get(`/api/v1/voucher/get-all-vouchers-guest?page=${page}&limit=${limit}`);
}

const getAllVouchers = (page, limit) => {
    return axios.get(`/api/v1/voucher/get-all-vouchers?page=${page}&limit=${limit}`);
}

const saveVoucher = (id) => {
    return axios.post(`/api/v1/voucher/save-voucher`, {
        voucherId: id,
    });
}

export {
    getAllVouchersForGuest,
    getAllVouchers,
    saveVoucher,
}