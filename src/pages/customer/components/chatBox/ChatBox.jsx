import React, {useEffect, useRef, useState} from 'react';
import InputEmoji from "react-input-emoji";
import {IoClose} from "react-icons/io5"
import "./chatBox.scss";
import {useDispatch, useSelector} from "react-redux";
import {closeChatBox, setCurrentProduct} from "../../../../redux/customer/slices/chatSlice";
import {formatCurrency} from "../../../../utils/formatCurrency";
import {createOrUpdateChat, getMessages, markMessagesAsRead, sendMessage} from "../../../../services/chatService";
import moment from "moment";
import 'moment/locale/vi';
import {Link} from "react-router-dom";
import {io} from "socket.io-client";

const ChatBox = () => {

    const [textMessage, setTextMessage] = useState("");
    const dispatch = useDispatch();
    const {currentProduct} = useSelector(state => state.chat);
    const customer = useSelector(state => state.customer);
    const [loading, setLoading] = useState(false);

    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);

    const scroll = useRef();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io("http://localhost:4000");
        setSocket(newSocket);

        newSocket.on("receiveMessage", async (message) => {
            if (message.chatId === chat?.id) {
                setMessages(prevMessages => [...prevMessages, message]);

                await markMessagesAsRead(chat.id, customer.id, 'customer');
            }
        });

        return () => {
            newSocket.disconnect();
        };
    }, [chat]);

    const handleOnEnter = async () => {
        if (!textMessage.trim() || !chat) return;
        setLoading(true);
        try {
            let res = await sendMessage(chat?.id, customer.id, 'customer', textMessage, currentProduct ? currentProduct?.id : null);
            if (res && res.EC === 0) {
                const newMessage = res.DT;
                setMessages(prevMessages => [...prevMessages, newMessage]);

                // Emit new message to server
                socket.emit("sendMessage", newMessage);
                dispatch(setCurrentProduct());
                setTextMessage("");
            } else {
                console.error(res.EM);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const handleCreateOrUpdateChat = async () => {
        try {
            let res = await createOrUpdateChat(customer.id);
            if (res && res.EC === 0) {
                setChat(res.DT);
            } else {
                console.error(res.EM);
            }
        } catch (e) {
            console.error(e);
        }
    }

    const handleGetMessages = async (chat) => {
        try {
            let res = await getMessages(chat.id);
            if (res && res.EC === 0) {
                setMessages(res.DT);
            } else {
                console.error(res.EM);
            }
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        handleCreateOrUpdateChat();
    }, []);

    useEffect(() => {
        if (chat !== null) {
            handleGetMessages(chat);
            markMessagesAsRead(chat.id, customer.id, 'customer');
        }
    }, [chat]);

    useEffect(() => {
        scroll.current?.scrollIntoView({behavior: "smooth"});
    }, [messages, currentProduct]);

    const isOutgoingMessage = (message) => {
        return message.senderType === 'customer' && message.senderId === customer.id;
    };

    const renderProductInfo = (productInfo) => {
        if (!productInfo) return null;

        return (
            <div className="product-info">
                <p>Bạn đang trao đổi với chúng tôi về sản phẩm này</p>
                <hr/>
                <Link to={`/products/${productInfo.slug}`} className="product-details">
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
                </Link>
            </div>
        );
    };

    const getSenderName = (message) => {
        if (isOutgoingMessage(message)) return 'Bạn';
        const sender = chat?.participants.find(p => p.id === message.senderId && message.senderType === 'user');
        return sender ? `TVV ${sender.username}` : 'TVV';
    };

    const getLastMessageInfo = () => {
        if (messages.length === 0) return {text: 'Chưa có tin nhắn', time: ''};
        const lastMessage = messages[messages.length - 1];
        return {
            text: lastMessage.content,
            time: moment(lastMessage.createdAt).isSame(new Date(), 'day') ? moment(lastMessage.createdAt).format('HH:mm') : moment(lastMessage.createdAt).format('ddd, HH:mm'),
            senderName: getSenderName(lastMessage)
        };
    };

    const {text: lastMessageText, time: lastMessageTime, senderName: lastMessageSender} = getLastMessageInfo();

    const truncateContent = (content, maxLength = 20) => {
        const strippedContent = content.replace(/<[^>]+>/g, '');
        if (strippedContent.length <= maxLength) return content;
        return strippedContent.slice(0, maxLength) + '...';
    };

    return (
        <div className="chatbox">
            <div className="chatbox-header">
                <div className="header-left">
                    <div className="chat-logo"><img src="/admin/assets/img/kaiadmin/cus_logo_dark.png"/></div>
                    <div className="chat-details">
                        <p className="chat-title">Tư vấn</p>
                        <p className="chat-status">
                            {lastMessageSender &&
                                <b>{`${lastMessageSender}: `}</b>}<i>{truncateContent(lastMessageText)}</i>
                            {lastMessageTime && <span> - ({lastMessageTime})</span>}</p>
                    </div>
                </div>
                <IoClose className="close-btn" size={24} onClick={() => dispatch(closeChatBox())}/>
            </div>

            <div className="chatbox-body">
                {messages.length > 0 && messages.map((message, index) => (
                    <React.Fragment key={index}>
                        {message.productInfo && renderProductInfo(message.productInfo)}
                        <div
                            className={`message ${isOutgoingMessage(message) ? 'outgoing' : 'incoming'}`}
                        >
                            {!isOutgoingMessage(message) && (
                                <p className="chat-user">{getSenderName(message)}</p>
                            )}
                            <p className="chat-text">{message.content}</p>
                            <p className="chat-time">
                                {
                                    moment(message.createdAt).isSame(new Date(), 'day')
                                       ? moment(message.createdAt).format('HH:mm')
                                        : moment(message.createdAt).format('ddd, HH:mm')
                                }
                            </p>
                        </div>
                    </React.Fragment>
                ))}

                {currentProduct && renderProductInfo(currentProduct)}
                <div ref={scroll}/>
            </div>

            <div className="chatbox-input">
                <InputEmoji
                    value={textMessage}
                    onChange={setTextMessage}
                    cleanOnEnter
                    onEnter={handleOnEnter}
                    placeholder="Nhập tin nhắn..."
                />
            </div>
        </div>
    );
};

export default ChatBox;