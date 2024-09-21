import React, {useEffect, useState} from 'react';
import PageHeader from "../components/pageHeader/PageHeader";
import {cancelOrder, confirmReceivedOrder, getMyOrders} from "../../../services/customer/orderService";
import {useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {formatCurrency} from "../../../utils/formatCurrency";
import {Card, Table} from "react-bootstrap";
import {formatDate} from "../../../utils/formatDate";
import "./myOrder.scss";
import {toast} from "react-toastify";
import ReactPaginate from "react-paginate";

const MyOrder = () => {

    const customer = useSelector((state) => state.customer);
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [numRows, setNumRows] = useState(10);

    const navigate = useNavigate();

    const fetchMyOrders = async (page, limit) => {
        setLoading(true);
        try {
            let res = await getMyOrders(page, limit);
            if (res && res.EC === 0) {
                setOrders(res.DT.orders);
                setTotalPages(res.DT.totalPages);
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
            fetchMyOrders(currentPage, numRows);
        }
    }, [customer, currentPage, numRows]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handlePageClick = async (event) => {
        // console.log(event);
        setCurrentPage(+event.selected + 1);
        scrollToTop();
    };

    const handleShowRows = async (numRows) => {
        setNumRows(numRows);
        setCurrentPage(1);
        scrollToTop();
    }

    const handleCancelOrder = async (orderId) => {
        try {
            let res = await cancelOrder(orderId);
            if (res && res.EC === 0) {
                toast.success(res.EM);
                await fetchMyOrders(currentPage, numRows);
            } else {
                toast.warn(res.EM);
            }
        } catch (e) {
            console.error(e);
        }
    }

    const handleConfirmReceived = async (orderId) => {
        try {
            let res = await confirmReceivedOrder(orderId);
            if (res && res.EC === 0) {
                toast.success(res.EM);
                await fetchMyOrders(currentPage, numRows);
            } else {
                toast.warn(res.EM);
            }
        } catch (e) {
            console.error(e);
        }
    }

    const getOrderStatus = (status) => {
        switch (status) {
            case 0:
                return { text: 'Đã huỷ', class: 'canceled' }
            case 1:
                return { text: 'Chờ xác nhận', class: 'pending' };
            case 2:
                return { text: 'Đã xác nhận', class: 'confirmed' };
            case 3:
                return { text: 'Đang vận chuyển đến bạn', class: 'shipping' };
            case 4:
                return { text: 'Đã nhận được hàng', class:'received' };
            default:
                return { text: 'Không xác định', class: '' };
        }
    };

    const renderActionButton = (order) => {
        if (order.status === 1) {
            return (
                <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleCancelOrder(order.id)}
                >
                    Hủy đơn hàng
                </button>
            );
        } else if (order.status === 3) {
            return (
                <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => handleConfirmReceived(order.id)}
                >
                    Đã nhận được hàng
                </button>
            );
        }
        return null;
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
                                                        renderActionButton(order)
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
                                                    <div className="info-item"><strong>Ngày đặt hàng:</strong> {formatDate(order.createdAt)}</div>
                                                    <div className="info-item"><strong>Phí vận chuyển:</strong> {order.shippingMethod === 'standard' ? formatCurrency(20000) : formatCurrency(50000)}</div>
                                                    <div className="info-item"><strong>Phương thức thanh toán:</strong> {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Thanh toán bằng PayPal'}</div>
                                                    <div className="info-item"><strong>Tổng tiền:</strong> {formatCurrency(order.totalPrice)}</div>
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

            {totalPages > 0 &&
                <div className="orders-footer mt-3 mb-3 row">
                    <div className="col d-flex justify-content-center align-items-center">
                        <div className="me-3">
                            <ReactPaginate
                                nextLabel="Sau"
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={3}
                                marginPagesDisplayed={2}
                                pageCount={totalPages}
                                previousLabel="Trước"
                                pageClassName="page-item"
                                pageLinkClassName="page-link"
                                previousClassName="page-item"
                                previousLinkClassName="page-link"
                                nextClassName="page-item"
                                nextLinkClassName="page-link"
                                breakLabel="..."
                                breakClassName="page-item"
                                breakLinkClassName="page-link"
                                containerClassName="pagination"
                                activeClassName="active"
                                renderOnZeroPageCount={null}
                                forcePage={currentPage - 1}
                            />
                        </div>
                        <div className="mb-3">
                            <select className="form-select" aria-label="Default select example"
                                    onChange={(e) => handleShowRows(e.target.value)}
                                    value={numRows}>
                                <option value={10}>Hiển thị 10</option>
                                <option value={20}>Hiển thị 20</option>
                                <option value={30}>Hiển thị 30</option>
                            </select>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default MyOrder;