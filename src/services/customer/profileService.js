import axios from "../../config/customer/axios";

const getProfile = () => {
    return axios.get(`/api/v1/profile/get-profile`);
}

const sendVerificationCode = (email) => {
    return axios.post(`/api/v1/profile/send-verification-code`, {
        email,
    });
}

const updateProfileEmail = (email, verificationCode) => {
    return axios.post(`/api/v1/profile/update-profile-email`, {
        email,
        verificationCode,
    });
}

const updateProfile = (fullname, username, phone, sex, birthdate, image) => {
    const data = new FormData();
    if (fullname) data.append("fullname", fullname);
    if (username) data.append("username", username);
    if (phone) data.append("phone", phone);
    if (sex) data.append("sex", sex);
    if (birthdate) data.append("birthdate", birthdate);
    if (image) data.append("image", image);

    return axios.put(`/api/v1/profile/update-profile`, data);
}

const changePassword = (oldPassword, newPassword, confirmPassword) => {
    return axios.put(`/api/v1/profile/change-password`, {
        oldPassword,
        newPassword,
        confirmPassword,
    });
}

export {
    getProfile,
    sendVerificationCode,
    updateProfileEmail,
    updateProfile,
    changePassword,
}