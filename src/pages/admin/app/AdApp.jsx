import AdSidebar from "./AdSidebar";
import AdLogoHeader from "./AdLogoHeader";
import AdNavbarHeader from "./AdNavbarHeader";
import {Outlet} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {logoutUser} from "../../../services/admin/authService";
import {resetUser} from "../../../redux/admin/slices/userSlice";
import {toast} from "react-toastify";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {useSocket} from "../../../context/SocketContext";

const AdApp = (props) => {

    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const { onSocket, offSocket, disconnectSocket } = useSocket();

    const [showLockModal, setShowLockModal] = useState(false);

    useEffect(() => {

        onSocket('lockUser', async (data) => {
            console.log(data);
            if (data.id === user.id) {
                setShowLockModal(true);
                let res = await logoutUser();
                if (res && res.EC === 0) {
                    disconnectSocket();
                    localStorage.removeItem("jwt");
                    dispatch(resetUser());
                } else {
                    toast.error(res.EM);
                }
            }
        })
        
        return () => {
            offSocket('lockUser');
        }
    }, [disconnectSocket, dispatch, offSocket, onSocket]);
    
    return (
        <>
            <div className="wrapper">
                <AdSidebar/>

                <div className="main-panel">
                    <div className="main-header">

                        <AdLogoHeader/>

                        <AdNavbarHeader/>

                    </div>

                    <div className="container">
                        <Outlet />
                    </div>
                </div>
            </div>

            <Modal show={showLockModal} onHide={() => setShowLockModal(false)} centered backdrop={"static"} keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Tài khoản bị khóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Tài khoản của bạn đã bị khóa!</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowLockModal(false)}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AdApp;