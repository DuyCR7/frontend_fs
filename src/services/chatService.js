import axios from "../config/customer/axios";

const createOrUpdateChat = (cusId) => {
    return axios.post(`/api/v1/chat`, {
        cusId: cusId,
    });
}

const sendMessage = (chatId, senderId, senderType, content, productId = null) => {
    return axios.post(`/api/v1/chat/send-message`, {
        chatId: chatId,
        senderId: senderId,
        senderType: senderType,
        content: content,
        productId: productId,
    });
}

const getMessages = (chatId) => {
    return axios.get(`/api/v1/chat/get-messages/${chatId}`);
}

const getAdminChats = (userId) => {
    return axios.get(`/api/v1/chat/get-admin-chats/${userId}`);
}

export {
    createOrUpdateChat,
    sendMessage,
    getMessages,
    getAdminChats,
}