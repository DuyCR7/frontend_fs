import React, {useEffect, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {Card, Table} from "react-bootstrap";
import {formatCurrency} from "../../../utils/formatCurrency";
import {formatDate} from "../../../utils/formatDate";

const AdModalOrderDetail = (props) => {

    const [orderDetail, setOrderDetail] = useState(null);

    const {dataOrderDetail, isShowModalDetailOrder, handleCloseModalOrderDetail} = props;

    useEffect(() => {
        if(dataOrderDetail && Object.keys(dataOrderDetail).length > 0) {
            setOrderDetail(dataOrderDetail);
        } else {
            setOrderDetail(null);
        }
    }, [dataOrderDetail]);

    const getOrderStatus = (status) => {
        switch (status) {
            case 0:
                return {text: 'Đã huỷ', class: 'canceled'}
            case 1:
                return {text: 'Chờ xác nhận', class: 'pending'};
            case 2:
                return {text: 'Đã xác nhận', class: 'confirmed'};
            case 3:
                return {text: 'Đang vận chuyển đến bạn', class: 'shipping'};
            case 4:
                return {text: 'Đã nhận được hàng', class: 'received'};
            default:
                return {text: 'Không xác định', class: ''};
        }
    };

    const getCancelReasonText = (reason) => {
        const reasonMap = {
            "wrong_product": "Tôi đặt nhầm sản phẩm",
            "update_address_phone": "Tôi muốn cập nhật địa chỉ/sđt nhận hàng",
            "change_discount_code": "Tôi muốn thay đổi mã giảm giá",
            "change_product": "Tôi muốn thay đổi sản phẩm (Kích thước, màu sắc, số lượng)",
            "no_longer_want_to_buy": "Tôi không có nhu cầu mua nữa",
            "no_reason_fits": "Tôi không tìm thấy lý do phù hợp"
        };
        return reasonMap[reason] || reasonMap;
    }

    const calculateSubtotal = () => {
        return orderDetail?.Order_Details.reduce((total, detail) => total + (detail.price * detail.quantity), 0) || 0;
    };

    const getShippingFee = () => {
        return orderDetail?.shippingMethod === 'standard' ? 20000 : 50000;
    };

    console.log(orderDetail);
    return (
        <Modal show={props.isShowModalDetailOrder} onHide={() => props.handleCloseModalOrderDetail()} size={"xl"} className="modal-order-detail"
               centered>
            <Modal.Header closeButton>
                <Modal.Title>
                        <span>
                            Chi Tiết Đơn Hàng #{orderDetail?.id}
                        </span>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-md-8">
                        <Card className="order-card">
                            <Card.Body>
                                <Card.Title className="mb-3">
                                    <h5>Đơn hàng #{orderDetail?.id}</h5>
                                </Card.Title>
                                <Table responsive hover>
                                    <thead>
                                    <tr className="text-center">
                                        <th>Sản phẩm</th>
                                        <th>Màu sắc</th>
                                        <th>Kích thước</th>
                                        <th>Số lượng</th>
                                        <th>Giá</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {orderDetail && orderDetail?.Order_Details.map((detail) => (
                                        <tr key={detail.id} className="text-center">
                                            <td>
                                                <div className="product-info">
                                                    <img
                                                        src={`${process.env.REACT_APP_URL_BACKEND}/${detail.Product_Detail.image}`}
                                                        alt={detail.Product_Detail.Product.name}
                                                        width={50} height={50}
                                                    />
                                                    <span>{detail.Product_Detail.Product.name}</span>
                                                </div>
                                            </td>
                                            <td>{detail.Product_Detail.Color.name}</td>
                                            <td>{detail.Product_Detail.Size.code}</td>
                                            <td>{detail.quantity}</td>
                                            <td>{formatCurrency(detail.price)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                                <div className="order-info">
                                    <div className="info-item"><strong>Ngày đặt
                                        hàng:</strong> {formatDate(orderDetail?.createdAt)}</div>
                                    {
                                        orderDetail?.voucherId && (
                                            <div className="info-item"><strong>Voucher
                                                giảm giá:</strong> {orderDetail?.Voucher?.code}</div>
                                        )
                                    }
                                    <div className="info-item"><strong>Phương thức thanh
                                        toán:</strong> {orderDetail?.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Thanh toán bằng PayPal'}
                                    </div>
                                    {
                                        orderDetail?.note && (
                                            <div className="info-item">
                                                <strong>Ghi chú:</strong> {orderDetail?.note}
                                            </div>
                                        )
                                    }
                                    <div className="info-item">
                                        <strong>Trạng thái:</strong>
                                        <span
                                            className={`order-status ${getOrderStatus(orderDetail?.status).class}`}>
                                                                            {getOrderStatus(orderDetail?.status).text}
                                                                        </span>
                                        {
                                            orderDetail?.status !== 1 && (
                                                <span
                                                    className="ms-3">({formatDate(orderDetail?.updatedAt)})</span>
                                            )
                                        }
                                    </div>
                                    {orderDetail?.status === 0 && orderDetail?.cancelReason && (
                                        <div className="info-item">
                                            <strong>Lý do hủy:</strong> {getCancelReasonText(orderDetail?.cancelReason)}
                                        </div>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className="col-md-4">
                        <Card className="address-card">
                            <Card.Body>
                                <Card.Title>Địa chỉ nhận hàng</Card.Title>
                                <hr/>
                                <div className="address-info">
                                    <div className="info-item">
                                        <strong>Tên:</strong> {orderDetail?.addName}</div>
                                    <div className="info-item">
                                        <strong>Email:</strong> {orderDetail?.addEmail}</div>
                                    <div className="info-item"><strong>Số điện
                                        thoại:</strong> {orderDetail?.addPhone}</div>
                                    <div className="info-item"><strong>Địa
                                        chỉ:</strong> {orderDetail?.addLocation}</div>
                                </div>
                            </Card.Body>
                        </Card>

                        <Card className="more-info-card">
                            <Card.Body>
                                <Card.Title>Thông tin</Card.Title>
                                <hr/>
                                <div className="more-info">
                                    <div className="info-item">
                                        <strong>Tổng tiền hàng:</strong> {formatCurrency(calculateSubtotal())}
                                    </div>
                                    <div className="info-item">
                                        <strong>Phí vận chuyển:</strong> {formatCurrency(getShippingFee())}
                                    </div>
                                    {
                                        orderDetail?.voucherId && (
                                            <div className="info-item">
                                                <strong>Giảm giá:</strong> {formatCurrency(orderDetail?.appliedDiscount)}
                                            </div>
                                        )
                                    }
                                    <div className="info-item-total">
                                        <strong>Tổng thanh toán:</strong> {formatCurrency(orderDetail?.totalPrice)}
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark" onClick={() => props.handleCloseModalOrderDetail()}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AdModalOrderDetail;