import React from 'react';
import {Modal, Card, Button} from 'react-bootstrap';
import "./addressModal.scss";

const AddressModal = ({
                          show,
                          onHide,
                          addresses,
                          onSelectAddress,
                          onEditAddress,
                          onAddAddress
                      }) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            backdrop="static"
            keyboard={false}
            className="address-modal"
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
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            {
                                                address.isDefault && (
                                                    <span className="text-danger">Địa chỉ mặc định</span>
                                                )
                                            }
                                        </div>
                                        <div className="">
                                            <Button
                                                variant="outline-success"
                                                onClick={() => onSelectAddress(address)}
                                                className="me-2"
                                            >
                                                Chọn địa chỉ này
                                            </Button>
                                            <Button
                                                variant="outline-primary"
                                                onClick={() => onEditAddress(address)}
                                            >
                                                Sửa
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
        </Modal>
    );
};

export default AddressModal;