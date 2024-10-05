import React from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {Form} from "react-bootstrap";
import "./modalCancel.scss";

const ModalCancel = ({isShowModalCancel, handleCloseModalCancel, cancelReason, setCancelReason, handleCancelOrder, loading}) => {

    const reasons = [
        { value: "wrong_product", label: "Tôi đặt nhầm sản phẩm" },
        { value: "update_address_phone", label: "Tôi muốn cập nhật địa chỉ/sđt nhận hàng" },
        { value: "change_discount_code", label: "Tôi muốn thay đổi mã giảm giá" },
        { value: "change_product", label: "Tôi muốn thay đổi sản phẩm (Kích thước, màu sắc, số lượng)" },
        { value: "no_longer_want_to_buy", label: "Tôi không có nhu cầu mua nữa" },
        { value: "no_reason_fits", label: "Tôi không tìm thấy lý do phù hợp" }
    ];

    return (
        <Modal show={isShowModalCancel} onHide={() => handleCloseModalCancel()} size={"md"} className="modal-cancel" centered>
            <Modal.Header closeButton>
                <Modal.Title>Hủy đơn hàng</Modal.Title>
            </Modal.Header>
            <Modal.Body className="">
                <p>Vui lòng chọn lý do hủy đơn hàng:</p>
                <Form>
                    {reasons.map((reason) => (
                        <Form.Check
                            key={reason.value}
                            type="radio"
                            id={reason.value}
                            label={reason.label}
                            name="cancelReason"
                            value={reason.value}
                            checked={cancelReason === reason.value}
                            onChange={(e) => setCancelReason(e.target.value)}
                        />
                    ))}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark" onClick={() => handleCloseModalCancel()}>
                    Đóng
                </Button>
                <Button variant="danger" onClick={handleCancelOrder} disabled={loading || !cancelReason}>
                    Xác nhận hủy đơn
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalCancel;