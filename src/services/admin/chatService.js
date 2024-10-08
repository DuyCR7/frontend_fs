import axios from "../../config/admin/axios";

const adSendMessage = (chatId, senderId, senderType, content, productId = null) => {
    return axios.post(`/api/v1/admin/chat/send-message`, {
        chatId: chatId,
        senderId: senderId,
        senderType: senderType,
        content: content,
        productId: productId,
    });
}

const adGetMessages = (chatId) => {
    return axios.get(`/api/v1/admin/chat/get-messages/${chatId}`);
}

const adGetLastMessage = (chatId) => {
    return axios.get(`/api/v1/admin/chat/get-last-message/${chatId}`);
}

const adGetAdminChats = () => {
    return axios.get(`/api/v1/admin/chat/get-admin-chats`);
}

const adGetUnreadMessageCount = (userId, userType, chatId = null) => {
    let params = {
        userId: userId,
        userType: userType,
    };

    if (chatId !== null) {
        params.chatId = chatId;
    }

    return axios.get(`/api/v1/admin/chat/get-unread-message-count`, { params });
}

const adMarkMessagesAsRead = (chatId, userId, userType) => {
    return axios.put(`/api/v1/admin/chat/mark-messages-as-read`, {
        chatId: chatId,
        userId: userId,
        userType: userType,
    });
}

export {
    adSendMessage,
    adGetMessages,
    adGetLastMessage,
    adGetAdminChats,
    adGetUnreadMessageCount,
    adMarkMessagesAsRead,
}