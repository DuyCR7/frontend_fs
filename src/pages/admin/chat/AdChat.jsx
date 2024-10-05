import React, {useCallback, useEffect, useRef, useState} from 'react';
import "./adChat.scss";
import InputEmoji from "react-input-emoji";
import { IoClose } from "react-icons/io5";
import {
    getAdminChats, getLastMessage,
    getMessages,
    getUnreadMessageCount,
    markMessagesAsRead,
    sendMessage
} from "../../../services/chatService";
import {useSelector} from "react-redux";
import {formatCurrency} from "../../../utils/formatCurrency";
import moment from "moment";
import 'moment/locale/vi';
import {debounce} from "lodash";
import {connectSocket, emitSocket, offSocket, onSocket} from "../../../services/socket/socket";

const AdChat = () => {

    const [chats, setChats] = useState([])
    const [selectedChat, setSelectedChat] = useState(null);
    const [textMessage, setTextMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const user = useSelector(state => state.user);
    const scroll = useRef();

    const [onlineCustomers, setOnlineCustomers] = useState([]);

    const debouncedMarkMessagesAsRead = useCallback(
        debounce((chatId, userId) => {
            markMessagesAsRead(chatId, userId, 'user');
        }, 500), []
    );
console.log(onlineCustomers);
    useEffect(() => {

        connectSocket();

        emitSocket("getOnlineCustomers");

        onSocket("updateOnlineCustomers", (res) => {
            setOnlineCustomers(res);
        })

        onSocket("receiveMessage", async (message) => {
            setChats(prevChats => {
                const existingChat = prevChats.find(chat => chat.id === message.chatId);
                if (existingChat) {
                    // Update existing chat
                    const updatedChats = prevChats.map(chat =>
                        chat.id === message.chatId
                            ? {
                                ...chat,
                                lastMessage: message.content,
                                lastMessageTime: message.createdAt,
                                lastMessageSender: getSenderName(message, chat),
                                unreadCount: chat.id === selectedChat?.id ? 0 : (chat.unreadCount || 0) + 1,
                            }
                            : chat
                    );

                    return updatedChats.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
                } else {
                    // Add new chat
                    handleGetAdminChats(); // Fetch all chats to get the new one
                    return prevChats;
                }
            });

            if (selectedChat && message.chatId === selectedChat.id) {
                setMessages(prevMessages => [...prevMessages, message]);
                // await markMessagesAsRead(selectedChat.id, user.id, 'user');
                debouncedMarkMessagesAsRead(selectedChat.id, user.id);
            }
        });

        return () => {
            offSocket("updateOnlineCustomers");
            offSocket("receiveMessage");
        }
    }, [selectedChat, debouncedMarkMessagesAsRead]);

    const handleGetAdminChats = useCallback(async () => {
        try {
            let res = await getAdminChats(user.id);
            if (res && res.EC === 0) {
                const chatsWithLastMessage = await Promise.all(res.DT.map(async (chat) => {
                    const lastMessageRes = await getLastMessage(chat.id);
                    const unreadCountRes = await getUnreadMessageCount(user.id, 'user', chat.id);

                    if (lastMessageRes && lastMessageRes.EC === 0 && Object.keys(lastMessageRes.DT).length > 0) {
                        const lastMessage = lastMessageRes.DT;
                        return {
                            ...chat,
                            lastMessage: lastMessage.content,
                            lastMessageTime: lastMessage.createdAt,
                            lastMessageSender: getSenderName(lastMessage, chat),
                            unreadCount: unreadCountRes.EC === 0 ? unreadCountRes.DT : 0
                        };
                    }
                    return {
                        ...chat,
                        unreadCount: unreadCountRes.EC === 0 ? unreadCountRes.DT : 0
                    };
                }));

                const sortedChats = chatsWithLastMessage.sort((a, b) =>
                    new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
                );

                setChats(sortedChats);
            } else {
                console.error(res.EM);
            }
        } catch (e) {
            console.error(e);
        }
    }, [user.id]);

    const handleGetMessages = async (chatId) => {
        try {
            let res = await getMessages(chatId);
            if (res && res.EC === 0) {
                setMessages(res.DT);
            } else {
                console.error(res.EM);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        handleGetAdminChats();
    }, [handleGetAdminChats]);

    useEffect(() => {
        if (selectedChat) {
            handleGetMessages(selectedChat.id);
            markMessagesAsRead(selectedChat.id, user.id, 'user');
            setChats(prevChats => prevChats.map(chat =>
                chat.id === selectedChat.id ? { ...chat, unreadCount: 0 } : chat
            ));
        }
    }, [selectedChat]);

    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleChatSelect = (chat) => {
        setSelectedChat(chat);
    };

    const handleSendMessage = async () => {
        if (!textMessage.trim() || !selectedChat) return;
        setLoading(true);
        try {
            let res = await sendMessage(selectedChat.id, user.id, 'user', textMessage);
            if (res && res.EC === 0) {
                const newMessage = res.DT;
                setMessages(prevMessages => [...prevMessages, newMessage]);
                setTextMessage("");
                // socket.emit("sendMessage", newMessage);
                emitSocket("sendMessage", newMessage);

                setChats(prevChats => {
                    const updatedChats = prevChats.map(chat =>
                        chat.id === selectedChat.id
                            ? {
                                ...chat,
                                lastMessage: newMessage.content,
                                lastMessageTime: newMessage.createdAt,
                                lastMessageSender: getSenderName(newMessage, chat),
                                unreadCount: 0
                            }
                            : chat
                    );

                    return updatedChats.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
                });

                await markMessagesAsRead(selectedChat.id, user.id, 'user');
            } else {
                console.error(res.EM);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const isOutgoingMessage = (message) => {
        return message.senderType === 'user' && message.senderId === user.id;
    };

    const renderProductInfo = (productInfo) => {
        if (!productInfo) return null;

        return (
            <div className="product-info">
                <p>Khách hàng đang trao đổi về sản phẩm này</p>
                <hr/>
                <div className="product-details">
                    {productInfo.images && productInfo.images.length > 0 && (
                        <>
                            {productInfo.images.find(image => image.isMainImage) && (
                                <img
                                    src={`${process.env.REACT_APP_URL_BACKEND}/${productInfo.images.find(image => image.isMainImage).image}`}
                                    alt=""
                                />
                            )}
                        </>
                    )}
                    <div className="product-text">
                        <p>{productInfo.name}</p>
                        <p>
                            {productInfo.isSale && (
                                <span className="old-price">{formatCurrency(productInfo.price)}</span>
                            )}
                            <span className={productInfo.isSale ? "new-price" : ""}>
                                {productInfo.isSale ? formatCurrency(productInfo.price_sale) : formatCurrency(productInfo.price)}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    const getSenderName = (message, chat) => {
        if (message.senderType === 'user' && message.senderId === user.id) {
            return 'Bạn';
        } else if (message.senderType === 'customer') {
            return chat ? chat.Customer.email : 'Khách hàng';
        } else {
            if (chat) {
                const sender = JSON.parse(chat.participants).find(p => p.id === message.senderId);
                return sender ? `TVV ${sender.username}` : 'TVV';
            }
            return 'TVV';
        }
    };

    const truncateContent = (content = '', maxLength = 20) => {
        const strippedContent = content.replace(/<[^>]+>/g, '');
        if (strippedContent.length <= maxLength) return strippedContent;
        return strippedContent.slice(0, maxLength) + '...';
    };


    console.log(selectedChat);
    return (
        <div className="page-inner admin-chatbox">
            <div className="chat-list mb-4 mb-md-0">
                <h2>Danh sách chat</h2>
                {chats.map((chat) => {
                    return (
                        <div
                            key={chat.id}
                            className={`chat-item ${selectedChat?.id === chat.id ? 'selected' : ''}`}
                            onClick={() => handleChatSelect(chat)}
                        >
                            <div className="avatar-container">
                                <img src={chat.Customer.image.startsWith('https')
                                    ? chat.Customer.image
                                    : `${process.env.REACT_APP_URL_BACKEND}/${chat.Customer.image}`}
                                     alt={chat.Customer.email}
                                     className="chat-avatar"/>
                                {onlineCustomers?.some((cus) => cus?.cusId === chat.Customer.id) && (
                                    <span className="online-status"></span>
                                )}
                            </div>
                            <div className="chat-info">
                                <h3>{chat.Customer.email}</h3>
                                <p> {
                                    chat.lastMessageSender ? (
                                        <span>{truncateContent(chat.lastMessageSender, 12)}: </span>
                                    ) : (
                                        <span></span>
                                    )
                                }
                                    <span className={chat.unreadCount > 0 ? 'unread-message' : ''}>
                                        {truncateContent(chat.lastMessage) || "Chưa có tin nhắn"}
                                    </span>
                                </p>
                            </div>
                            <span className="chat-time">
                                 {chat.lastMessageTime
                                     ? moment(chat.lastMessageTime).isSame(new Date(), 'day')
                                         ? moment(chat.lastMessageTime).format('HH:mm')  // Chỉ hiển thị giờ nếu là hôm nay
                                         : moment(chat.lastMessageTime).format('DD/MM, HH:mm')  // Hiển thị thứ và giờ nếu không phải hôm nay
                                     : ''}
                            </span>
                            {chat.unreadCount > 0 && (
                                <span className="unread-count">{chat.unreadCount}</span>
                            )}
                        </div>
                    )
                })}
            </div>
            {selectedChat ? (
                    <div className="chat-details">
                        <div className="chat-header">
                            <img src={selectedChat.Customer.image.startsWith('https')
                                ? selectedChat.Customer.image
                                : `${process.env.REACT_APP_URL_BACKEND}/${selectedChat.Customer.image}`}
                                 alt={selectedChat.Customer.email}
                                 className="chat-avatar"/>
                            <h2>{selectedChat.Customer.email}</h2>
                            <IoClose className="close-btn" onClick={() => setSelectedChat(null)}/>
                        </div>
                        <div className="chat-messages">
                            {messages.map((message, index) => (
                                <React.Fragment key={index}>
                                    {message.productInfo && renderProductInfo(message.productInfo)}
                                    <div className={`message ${isOutgoingMessage(message) ? 'outgoing' : 'incoming'}`}>
                                        {!isOutgoingMessage(message) && (
                                            <p className="chat-user">{getSenderName(message, selectedChat)}</p>
                                    )}
                                    <p className="chat-text">{message.content}</p>
                                    <p className="chat-time">
                                        {
                                            moment(message.createdAt).isSame(new Date(), 'day')
                                               ? moment(message.createdAt).format('HH:mm')
                                                : moment(message.createdAt).format('DD/MM, HH:mm')
                                        }
                                    </p>
                                </div>
                            </React.Fragment>
                        ))}
                        <div ref={scroll} />
                    </div>
                    <div className="chat-input">
                        <InputEmoji
                            value={textMessage}
                            onChange={setTextMessage}
                            cleanOnEnter
                            onEnter={handleSendMessage}
                            placeholder="Nhập tin nhắn..."
                        />
                    </div>
                </div>
            )
                : (
                    <div className="chat-details d-flex flex-column align-items-center justify-content-center">
                        <h5>Chào mừng bạn đến với trang quản lý chat</h5>
                        <p>Click vào một cuộc trò chuyện để bắt đầu</p>
                    </div>
                )
            }
        </div>
    );
};

export default AdChat;