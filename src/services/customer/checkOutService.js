import axios from "../../config/customer/axios";

const getCustomerAddress = () => {
    return axios.get(`/api/v1/checkout/get-address`);
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

const createOrder = (paymentMethod, shippingMethod, totalPrice, addLocation, addName, addPhone, addEmail, orderDetails, paypalOrderId = null) => {
    return axios.post(`/api/v1/checkout/create-order`, {
        paymentMethod,
        shippingMethod,
        totalPrice,
        addLocation,
        addName,
        addPhone,
        addEmail,
        orderDetails,
        paypalOrderId,
    });
}

export {
    getCustomerAddress,
    createCustomerAddress,
    updateCustomerAddress,
    createOrder,
}