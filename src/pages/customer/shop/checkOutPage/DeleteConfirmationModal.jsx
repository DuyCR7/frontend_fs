import React from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./deleteConfirmationModal.scss";

const DeleteConfirmationModal = ({show, onHide, addressToDelete, onConfirmDeleteAddress, loading}) => {
    const handleDelete = () => {
        if (addressToDelete && addressToDelete.id) {
            onConfirmDeleteAddress(addressToDelete.id);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered size="sm" backdrop="static"
               keyboard={false} className="delete-confirmation-address">
            <Modal.Header closeButton>
                <Modal.Title>Xác nhận xóa địa chỉ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Bạn có chắc chắn muốn xóa địa chỉ này?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-dark" onClick={onHide}>
                    Hủy
                </Button>
                <Button variant="outline-danger" disabled={loading} onClick={handleDelete}>
                    Xóa
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteConfirmationModal;