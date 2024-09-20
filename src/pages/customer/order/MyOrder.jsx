import React, {useEffect, useState} from 'react';
import PageHeader from "../components/pageHeader/PageHeader";
import {getMyOrders} from "../../../services/customer/orderService";
import {useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {formatCurrency} from "../../../utils/formatCurrency";
import {Card, Table} from "react-bootstrap";
import {formatDate} from "../../../utils/formatDate";
import "./myOrder.scss";

const MyOrder = () => {

    const customer = useSelector((state) => state.customer);
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);

    const navigate = useNavigate();

    const fetchMyOrders = async () => {
        setLoading(true);
        try {
            let res = await getMyOrders();
            if (res && res.EC === 0) {
                setOrders(res.DT);
            } else {
                console.log("Error: ", res);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!customer || !customer.isAuthenticated) {
            navigate('/sign-in');
        } else {
            fetchMyOrders();
        }
    }, [customer]);

    const getOrderStatus = (status) => {
        switch (status) {
            case 1:
                return { text: 'Chờ xác nhận', class: 'pending' };
            case 2:
                return { text: 'Đã xác nhận', class: 'confirmed' };
            case 3:
                return { text: 'Đang vận chuyển đến bạn', class: 'shipping' };
            default:
                return { text: 'Không xác định', class: '' };
        }
    };

    console.log(orders);

    return (
        <div>
            <PageHeader title={"Lịch sử mua hàng"} curPage={"Lịch sử mua hàng"}/>

            <div className="my-orders mt-5">
                <div className="container-fluid ps-5 pe-5">
                    <div className="section-wrapper">
                        {orders.map((order, index) => (
                            <React.Fragment key={order.id}>
                                <div className="row">
                                    <div className="col-md-8">
                                        <Card className="order-card">
                                            <Card.Body>
                                                <Card.Title className="mb-3">
                                                    <h5>Đơn hàng #{order.id}</h5>
                                                    {
                                                        order.status === 1 &&
                                                        <button className="btn btn-sm btn-outline-danger">Hủy đơn
                                                            hàng</button>
                                                    }
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
                                                    {order.Order_Details.map((detail) => (
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
                                                        hàng:</strong> {formatDate(order.createdAt)}</div>
                                                    <div className="info-item"><strong>Phí vận
                                                        chuyển:</strong> {order.shippingMethod === 'standard' ? formatCurrency(20000) : formatCurrency(50000)}
                                                    </div>
                                                    <div className="info-item"><strong>Tổng
                                                        tiền:</strong> {formatCurrency(order.totalPrice)}</div>
                                                    <div className="info-item">
                                                        <strong>Trạng thái:</strong>
                                                        <span
                                                            className={`order-status ${getOrderStatus(order.status).class}`}>
                                                        {getOrderStatus(order.status).text}
                                                    </span>
                                                    </div>
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
                                                        <strong>Tên:</strong> {order.addName}</div>
                                                    <div className="info-item">
                                                        <strong>Email:</strong> {order.addEmail}</div>
                                                    <div className="info-item"><strong>Số điện
                                                        thoại:</strong> {order.addPhone}</div>
                                                    <div className="info-item"><strong>Địa
                                                        chỉ:</strong> {order.addLocation}</div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                </div>
                                { index < orders.length - 1 && <hr className="mb-5"/> }
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyOrder;