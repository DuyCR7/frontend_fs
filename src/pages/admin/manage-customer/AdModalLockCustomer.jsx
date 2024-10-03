import React, {useState} from 'react';
import {Spin} from "antd";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const AdModalLockCustomer = ({
                                 isShowModalLockCustomer,
                                 handleCloseModalLock,
                                 customerToLock,
                                 fetchAllCustomers,
                                 numRows,
                                 currentPage,
                                 setCurrentPage
                             }) => {

    const [loading, setLoading] = useState(false);

    const confirmLockCustomer = async () => {

    }

    return (
        <Modal show={isShowModalLockCustomer} onHide={handleCloseModalLock} centered>
            <Spin spinning={loading}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận khóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc muốn khóa khách hàng: <b>{customerToLock.email}</b>?</Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" disabled={loading} onClick={handleCloseModalLock}>
                        Đóng
                    </Button>
                    <Button variant="danger" disabled={loading} onClick={confirmLockCustomer}>
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Spin>
        </Modal>
    );
};

export default AdModalLockCustomer;