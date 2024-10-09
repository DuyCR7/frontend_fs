import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    const connectSocket = () => {
        if (!socket) {
            const newSocket = io(process.env.REACT_APP_URL_SOCKET);
            setSocket(newSocket);
        }
    };

    const disconnectSocket = () => {
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }
    };

    useEffect(() => {
        connectSocket();
        return () => {
            disconnectSocket();
        };
    }, []);

    const onSocket = (event, callback) => {
        if (socket) {
            socket.on(event, callback);
        }
    };

    const emitSocket = (event, data) => {
        if (socket) {
            socket.emit(event, data);
        }
    };

    const offSocket = (event) => {
        if (socket) {
            socket.off(event);
        }
    };

    return (
        <SocketContext.Provider value={{ socket, connectSocket, disconnectSocket, onSocket, emitSocket, offSocket }}>
            {children}
        </SocketContext.Provider>
    );
};