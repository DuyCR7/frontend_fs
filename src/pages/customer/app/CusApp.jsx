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
import {getUnreadMessageCount} from "../../../services/customer/chatService";
import {toast} from "react-toastify";
import {logoutCustomer} from "../../../services/customer/authService";
import {resetCustomer, updateCartCount, updateWishListCount} from "../../../redux/customer/slices/customerSlice";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {useSocket} from "../../../context/SocketContext";

const CusApp = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showScrollTopButton, setShowScrollTopButton] = useState(false);
    const { isOpenChatBox, unreadCount } = useSelector(state => state.chat);
    const customer = useSelector((state) => state.customer);
    const { onSocket, emitSocket, offSocket, disconnectSocket } = useSocket();

    const [showLockModal, setShowLockModal] = useState(false);

    useEffect(() => {

        emitSocket("addNewCustomer", customer.id);

        onSocket("receiveMessage", async (message) => {
            if (message.senderType === 'user' && !isOpenChatBox) {
                const response = await getUnreadMessageCount(customer.id, 'customer');
                if (response.EC === 0) {
                    dispatch(setUnreadCount(response.DT));
                }
            }
        });

        onSocket("lockCustomer", async (data) => {
            console.log(data);
            if (data.cusId === customer.id) {
                setShowLockModal(true);
                let data = await logoutCustomer(); // clear cookie
                if (data && data.EC === 0) {
                    disconnectSocket();
                    localStorage.removeItem("cus_jwt"); // clear local storage
                    dispatch(resetCustomer());
                    dispatch(updateCartCount(0));
                    dispatch(updateWishListCount(0));

                } else {
                    toast.error(data.EM);
                }
            }
        })

        return () => {
            offSocket("receiveMessage");
            offSocket("lockCustomer");
        };
    }, [isOpenChatBox, unreadCount, dispatch, emitSocket, onSocket, disconnectSocket, offSocket]);

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
        if (!customer.isAuthenticated) {
            if (isOpenChatBox) {
                dispatch(closeChatBox());
            }
            else {
                dispatch(setUnreadCount(0));
            }
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

            <Modal show={showLockModal} onHide={() => setShowLockModal(false)} centered backdrop={"static"} keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Tài khoản bị khóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Tài khoản của bạn đã bị khóa vì vi phạm chính sách. Vui lòng liên hệ chúng tôi để được hỗ trợ.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowLockModal(false)}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CusApp;