import { io } from "socket.io-client";

let socket = null;

export const connectSocket = () => {
    if (!socket) {
        socket = io(process.env.REACT_APP_URL_SOCKET);
    }
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const onSocket = (event, callback) => {
    if (!socket) {
        connectSocket();
    }
    socket.on(event, callback);
};

export const emitSocket = (event, data) => {
    if (!socket) {
        connectSocket();
    }
    socket.emit(event, data);
};

export const offSocket = (event) => {
    if (socket) {
        socket.off(event);
    }
}