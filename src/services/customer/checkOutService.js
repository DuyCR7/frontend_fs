import axios from "../../config/customer/axios";

const getCustomerAddress = () => {
    return axios.get(`/api/v1/checkout/get-address`);
}

const getMyVoucher = () => {
    return axios.get(`/api/v1/checkout/get-my-voucher`);
}

const createCustomerAddress = (name, address, phone, email, isDefault) => {
    return axios.post(`/api/v1/checkout/add-new-address`, {
        name,
        address,
        phone,
        email,
        isDefault
    });
}

const updateCustomerAddress = (id, name, address, phone, email, isDefault) => {
    return axios.put(`/api/v1/checkout/update-address`, {
        id,
        name,
        address,
        phone,
        email,
        isDefault
    });
}

const deleteCustomerAddress = (id) => {
    return axios.delete(`/api/v1/checkout/delete-address`, {
        data: {
            addressId: id
        }
    });
}

const createOrder = (paymentMethod, shippingMethod, totalPrice, addLocation, addName, addPhone, addEmail, note = null, orderDetails, paypalOrderId = null, voucherId, appliedDiscount) => {
    return axios.post(`/api/v1/checkout/create-order`, {
        paymentMethod,
        shippingMethod,
        totalPrice,
        addLocation,
        addName,
        addPhone,
        addEmail,
        note,
        orderDetails,
        paypalOrderId,
        voucherId,
        appliedDiscount,
    });
}

export {
    getCustomerAddress,
    getMyVoucher,
    createCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress,
    createOrder,
}