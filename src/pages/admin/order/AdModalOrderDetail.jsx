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
                                    <div className="info-item"><strong>Phí vận
                                        chuyển:</strong> {orderDetail?.shippingMethod === 'standard' ? formatCurrency(20000) : formatCurrency(50000)}
                                    </div>
                                    <div className="info-item"><strong>Phương thức thanh
                                        toán:</strong> {orderDetail?.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Thanh toán bằng PayPal'}
                                    </div>
                                    <div className="info-item"><strong>Tổng
                                        tiền:</strong> {formatCurrency(orderDetail?.totalPrice)}</div>
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