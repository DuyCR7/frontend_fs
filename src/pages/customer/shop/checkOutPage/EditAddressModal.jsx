import React from 'react';
import {Modal, Form, Button} from 'react-bootstrap';
import "./editAddressModal.scss";

const EditAddressModal = ({
                              show,
                              onHide,
                              onActionModalAddress,
                              editingAddress,
                              originalIsDefault,
                              onUpdateAddress,
                              loading,
                              onChangeInput,
                              errors,
                              onRenderError,
                          }) => {

    return (
        <Modal
            show={show}
            onHide={onHide}
            backdrop="static"
            keyboard={false}
            centered
            className="edit-address-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {onActionModalAddress === "CREATE" ? "Thêm thông tin vận chuyển" : "Sửa thông tin vận chuyển"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Họ và tên</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            className={errors.name ? "form-control is-invalid" : "form-control"}
                            value={editingAddress?.name || ''}
                            onChange={(e) => onChangeInput(e.target.value, 'name')}
                            required
                        />
                        {onRenderError(errors.name)}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Địa chỉ</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            className={errors.address ? "form-control is-invalid" : "form-control"}
                            value={editingAddress?.address || ''}
                            onChange={(e) => onChangeInput(e.target.value, 'address')}
                            required
                        />
                        {onRenderError(errors.address)}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Số điện thoại</Form.Label>
                        <Form.Control
                            type="tel"
                            name="phone"
                            className={errors.phone ? "form-control is-invalid" : "form-control"}
                            value={editingAddress?.phone || ''}
                            onChange={(e) => onChangeInput(e.target.value, 'phone')}
                            required
                        />
                        {onRenderError(errors.phone)}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            className={errors.email ? "form-control is-invalid" : "form-control"}
                            value={editingAddress?.email || ''}
                            onChange={(e) => onChangeInput(e.target.value, 'email')}
                            required
                        />
                        {onRenderError(errors.email)}
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center gap-2">
                        <div className={`checkbox-label-wrapper ${originalIsDefault ? 'disabled' : ''}`}>
                            <Form.Check
                                type="checkbox"
                                checked={editingAddress?.isDefault || false}
                                onChange={(e) => onChangeInput(e.target.checked, 'isDefault')}
                                disabled={originalIsDefault}
                                id="default-address-checkbox"
                            />
                            <Form.Label htmlFor="default-address-checkbox" className="mt-2">
                                Đặt làm địa chỉ mặc định
                            </Form.Label>
                            {originalIsDefault &&
                                <span className="tooltip">Bạn không thể xoá nhãn Địa chỉ mặc định. Hãy đặt địa chỉ khác làm Địa chỉ mặc định của bạn nhé.</span>}
                        </div>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-success" disabled={loading} onClick={onHide}>
                    Trở lại
                </Button>
                <Button variant="outline-primary" disabled={loading} onClick={onUpdateAddress}>
                    {onActionModalAddress === "CREATE" ? "Thêm" : "Cập nhật"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditAddressModal;