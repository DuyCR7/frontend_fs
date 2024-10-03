import React, {useState} from 'react';
import {Spin} from "antd";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {lockCustomer, unlockCustomer} from "../../../services/admin/manageCustomerService";
import {toast} from "react-toastify";

const AdModalLockCustomer = ({
                                 isShowModalLockCustomer,
                                 handleCloseModalLock,
                                 customerToLock,
                                 fetchAllCustomers,
                                 numRows,
                                 currentPage,
                                 setCurrentPage,
                                 actionModalLockCustomer
                             }) => {

    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            let res;
            if (actionModalLockCustomer === "LOCK") {
                res = await lockCustomer(customerToLock.id);
                if (res && res.EC === 0) {
                    toast.success(res.EM);
                } else {
                    toast.error(res.EM);
                }
            } else if (actionModalLockCustomer === "UNLOCK") {
                res = await unlockCustomer(customerToLock.id);
                if (res && res.EC === 0) {
                    toast.success(res.EM);
                } else {
                    toast.error(res.EM);
                }
            }

            handleCloseModalLock();
            setCurrentPage(1);
            await fetchAllCustomers(1, numRows);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal show={isShowModalLockCustomer} onHide={handleCloseModalLock} centered>
            <Spin spinning={loading}>
                <Modal.Header closeButton>
                    <Modal.Title>{actionModalLockCustomer === "LOCK" ? "Khóa khách hàng" : "Mở khóa khách hàng"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc chắn muốn {actionModalLockCustomer === "LOCK" ? "khóa" : "mở khóa"} khách hàng: <strong>{customerToLock.email}</strong>?</Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" disabled={loading} onClick={handleCloseModalLock}>
                        Đóng
                    </Button>
                    <Button variant="danger" disabled={loading} onClick={handleSubmit}>
                        {actionModalLockCustomer === "LOCK" ? "Khóa" : "Mở khóa"}
                    </Button>
                </Modal.Footer>
            </Spin>
        </Modal>
    );
};

export default AdModalLockCustomer;