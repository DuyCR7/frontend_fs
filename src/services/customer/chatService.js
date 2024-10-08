import axios from "../../config/customer/axios";

const createOrGetChat = (cusId) => {
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

const getUnreadMessageCount = (userId, userType, chatId = null) => {
    let params = {
        userId: userId,
        userType: userType,
    };

    if (chatId !== null) {
        params.chatId = chatId;
    }

    return axios.get(`/api/v1/chat/get-unread-message-count`, { params });
}

const markMessagesAsRead = (chatId, userId, userType) => {
    return axios.put(`/api/v1/chat/mark-messages-as-read`, {
        chatId: chatId,
        userId: userId,
        userType: userType,
    });
}

export {
    createOrGetChat,
    sendMessage,
    getMessages,
    getUnreadMessageCount,
    markMessagesAsRead,
}