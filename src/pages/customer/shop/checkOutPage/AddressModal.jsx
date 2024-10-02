import React from 'react';
import {Modal, Card, Button} from 'react-bootstrap';
import "./addressModal.scss";

const AddressModal = ({
                          show,
                          onHide,
                          addresses,
                          onSelectAddress,
                          onEditAddress,
                          onAddAddress,
                          onClickDeleteAddress,
                          showDeleteModal
                      }) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            backdrop="static"
            keyboard={false}
            className={`address-modal`}
        >
            <Modal.Header closeButton>
                <Modal.Title>Chọn địa chỉ giao hàng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {addresses.length > 0 ? (
                        addresses.map(address => (
                            <Card key={address.id} className="mb-3">
                                <Card.Body>
                                    <h6>{address.name}</h6>
                                    <p>{address.address}</p>
                                    <p>SĐT: {address.phone}</p>
                                    <p>Email: {address.email}</p>
                                    <div className="d-flex flex-column flex-sm-row align-items-center justify-content-sm-between justify-content-center">
                                        <div>
                                            {
                                                address.isDefault && (
                                                    <span className="text-danger">Địa chỉ mặc định</span>
                                                )
                                            }
                                        </div>
                                        <div className="d-flex flex-wrap mt-3 mt-sm-0 align-items-center justify-content-center gap-2">
                                            <Button
                                                variant="outline-success"
                                                onClick={() => onSelectAddress(address)}
                                            >
                                                Chọn địa chỉ này
                                            </Button>
                                            <Button
                                                variant="outline-primary"
                                                onClick={() => onEditAddress(address)}
                                            >
                                                Sửa
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                onClick={() => onClickDeleteAddress(address)}
                                            >
                                                Xóa
                                            </Button>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))
                    )
                    :
                    (
                        <p>Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ mới.</p>
                    )
                }
                <div className="d-flex justify-content-end">
                    <Button variant="outline-primary" onClick={onAddAddress}>
                        {addresses.length > 0 ? "Thêm địa chỉ mới" : "Thêm địa chỉ"}
                    </Button>
                </div>
            </Modal.Body>
            {showDeleteModal && <div className="modal-overlay"></div>}
        </Modal>
    );
};

export default AddressModal;