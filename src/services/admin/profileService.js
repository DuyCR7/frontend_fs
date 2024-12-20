import axios from "../../config/admin/axios";

const getProfile = () => {
    return axios.get("/api/v1/admin/profile/get-profile");
}

const updateProfile = (address, username, phone, sex, birthdate, image) => {
    const data = new FormData();
    if (address) data.append("address", address);
    if (username) data.append("username", username);
    if (phone) data.append("phone", phone);
    if (sex) data.append("sex", sex);
    if (birthdate) data.append("birthdate", birthdate);
    if (image) data.append("image", image);

    return axios.put(`/api/v1/admin/profile/update-profile`, data);
}

const changePassword = (oldPassword, newPassword, confirmPassword) => {
    return axios.put(`/api/v1/admin/profile/change-password`, {
        oldPassword,
        newPassword,
        confirmPassword,
    });
}

export {
    getProfile,
    updateProfile,
    changePassword,
}