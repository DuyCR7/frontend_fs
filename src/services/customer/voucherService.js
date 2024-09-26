import axios from "../../config/customer/axios";

const getAllVouchers = (page, limit) => {
    return axios.get(`/api/v1/voucher/get-all-vouchers?page=${page}&limit=${limit}`);
}

export {
    getAllVouchers,
}