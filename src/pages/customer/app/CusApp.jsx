import React, {useEffect, useState} from 'react';
import NavItems from "../components/navItems/NavItems";
import {Outlet, useNavigate} from "react-router-dom";
import Footer from "../components/footer/Footer";
import { IoIosChatboxes } from "react-icons/io";
import "./cusApp.scss";

import "../../../assets/css/icofont.min.css";
import "../../../assets/css/animate.css";
import "../../../assets/css/style.min.css";
import ChatBox from "../components/chatBox/ChatBox";
import {useDispatch, useSelector} from "react-redux";
import {closeChatBox, openChatBox, setUnreadCount} from "../../../redux/customer/slices/chatSlice";
import {io} from "socket.io-client";
import {getUnreadMessageCount} from "../../../services/chatService";

const CusApp = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showScrollTopButton, setShowScrollTopButton] = useState(false);
    const { isOpenChatBox, unreadCount } = useSelector(state => state.chat);
    const customer = useSelector((state) => state.customer);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io("http://localhost:4000");
        setSocket(newSocket);

        return () => newSocket.disconnect();
    }, []);

    useEffect(() => {
        if (socket === null) return;

        socket.on("receiveMessage", (message) => {
            if (message.senderType === 'user' && !isOpenChatBox) {
                dispatch(setUnreadCount(unreadCount + 1));
            }
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [socket, isOpenChatBox, unreadCount, dispatch]);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            if (customer.isAuthenticated) {
                try {
                    const response = await getUnreadMessageCount(customer.id, 'customer');
                    if (response.EC === 0) {
                        dispatch(setUnreadCount(response.DT));
                    }
                } catch (error) {
                    console.error("Failed to fetch unread message count:", error);
                }
            }
        };

        fetchUnreadCount();
    }, [customer.isAuthenticated, customer.id, dispatch]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollTopButton(true);
            } else {
                setShowScrollTopButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        if (!customer.isAuthenticated && isOpenChatBox) {
            dispatch(closeChatBox());
        }
    }, [customer.isAuthenticated, isOpenChatBox, dispatch]);

    const handleChatBoxClick = () => {
        if (customer.isAuthenticated) {
            dispatch(openChatBox(null));
            dispatch(setUnreadCount(0));
        } else {
            navigate('/sign-in');
        }
    };

    return (
        <>
            <NavItems />
            <div className='min-vh-100'>
                <Outlet />
            </div>
            <Footer />

            {showScrollTopButton && (
                <button
                    onClick={scrollToTop}
                    className="btn btn-primary btn-scroll-to-top"
                >
                    <i className="icofont-simple-up"></i>
                </button>
            )}

            {!isOpenChatBox && (
                <button className="btn-chatbox" onClick={() => handleChatBoxClick()}>
                    <IoIosChatboxes size={30}/>
                    <span>Chat</span>
                    {unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}
                </button>
            )}

            {isOpenChatBox && <ChatBox />}
        </>
    );
};

export default CusApp;