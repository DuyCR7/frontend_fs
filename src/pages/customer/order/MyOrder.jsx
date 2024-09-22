import React, {useEffect, useState} from 'react';
import PageHeader from "../components/pageHeader/PageHeader";
import {cancelOrder, confirmReceivedOrder, getMyOrders} from "../../../services/customer/orderService";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {formatCurrency} from "../../../utils/formatCurrency";
import {Card, Table} from "react-bootstrap";
import {formatDate} from "../../../utils/formatDate";
import "./myOrder.scss";
import {toast} from "react-toastify";
import ReactPaginate from "react-paginate";
import ModalReview from "./ModalReview";
import {addToCart} from "../../../services/customer/cartService";
import {updateCartCount} from "../../../redux/customer/slices/customerSlice";

const MyOrder = () => {

    const dispatch = useDispatch();
    const customer = useSelector((state) => state.customer);
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [numRows, setNumRows] = useState(10);

    const [isShowModalReview, setIsShowModalReview] = useState(false);
    const [dataReview, setDataReview] = useState(null);
    const [actionModalReview, setActionModalReview] = useState('CREATE');

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
        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    }

    const handleConfirmReceived = async (orderId) => {
        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    }

    const handleReview = async (product) => {
        setActionModalReview('CREATE');
        setDataReview(product);
        setIsShowModalReview(true);
    }

    const hanldeViewReview = async (product) => {
        setActionModalReview('VIEW');
        setDataReview(product);
        setIsShowModalReview(true);
    }

    const handleCloseModalReview = () => {
        setIsShowModalReview(false);
        setDataReview(null);
    }

    const handleRePurchase = async (product) => {
        setLoading(true);
        try {
            let res = await addToCart(product.Product.id, product.id, 1);
            if (res && res.EC === 0) {
                toast.success(res.EM);
                dispatch(updateCartCount(res.DT));
                navigate('/carts');
            } else {
                toast.error(res.EM);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

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

    const renderActionButton = (order) => {
        if (order.status === 1) {
            return (
                <button
                    disabled={loading}
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleCancelOrder(order.id)}
                >
                    Hủy Đơn Hàng
                </button>
            );
        } else if (order.status === 3) {
            return (
                <button
                    className="btn btn-sm btn-outline-success"
                    disabled={loading}
                    onClick={() => handleConfirmReceived(order.id)}
                >
                    Đã Nhận Được Hàng
                </button>
            );
        }
        return null;
    };

    const renderReviewButton = (detail) => {
        const hasReviewed = detail.Product_Detail.Product.Reviews;

        if (hasReviewed.length > 0) {
            return (
                <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => hanldeViewReview(detail.Product_Detail.Product)}
                    title="Xem đánh giá của bạn"
                >
                    Xem Đánh Giá
                </button>
            );
        } else {
            return (
                <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleReview(detail.Product_Detail.Product)}
                    title="Đánh giá sản phẩm"
                >
                    Đánh Giá
                </button>
            );
        }
    };

    console.log(orders);

    return (
        <>
            <div>
                <PageHeader title={"Lịch sử mua hàng"} curPage={"Lịch sử mua hàng"}/>

                <div className="my-orders mt-5">
                    <div className="container-fluid ps-5 pe-5">
                        <div className="section-wrapper">
                            {orders.length > 0 ? orders.map((order, index) => (
                                <React.Fragment key={order.id}>
                                    <div className="row">
                                        <div className="col-12">
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
                                                            {order.status === 4 && <th>Hành động</th>}
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {order.Order_Details.map((detail) => (
                                                            <tr key={detail.id} className="text-center">
                                                                <td>
                                                                    <Link
                                                                        to={`/products/${detail.Product_Detail.Product.slug}`}
                                                                        className="product-info">
                                                                        <img
                                                                            src={`${process.env.REACT_APP_URL_BACKEND}/${detail.Product_Detail.image}`}
                                                                            alt={detail.Product_Detail.Product.name}
                                                                            width={50} height={50}
                                                                        />
                                                                        <span>{detail.Product_Detail.Product.name}</span>
                                                                    </Link>
                                                                </td>
                                                                <td>{detail.Product_Detail.Color.name}</td>
                                                                <td>{detail.Product_Detail.Size.code}</td>
                                                                <td>{detail.quantity}</td>
                                                                <td>{formatCurrency(detail.price)}</td>
                                                                {
                                                                    order.status === 4 && (
                                                                        <td>
                                                                            <div className="action-buttons">
                                                                                <button
                                                                                    className="btn btn-sm btn-outline-warning me-2"
                                                                                    disabled={loading}
                                                                                    onClick={() => handleRePurchase(detail.Product_Detail)}>
                                                                                    Mua Lại
                                                                                </button>
                                                                                {renderReviewButton(detail)}
                                                                            </div>
                                                                        </td>
                                                                    )
                                                                }
                                                            </tr>
                                                        ))}
                                                        </tbody>
                                                    </Table>
                                                    <div className="row order-info">
                                                        <div className="info-purchase col-md-6">
                                                            <div className="info-item"><strong>Ngày đặt
                                                                hàng:</strong> {formatDate(order.createdAt)}</div>
                                                            <div className="info-item"><strong>Phí vận
                                                                chuyển:</strong> {order.shippingMethod === 'standard' ? formatCurrency(20000) : formatCurrency(50000)}
                                                            </div>
                                                            <div className="info-item"><strong>Phương thức thanh
                                                                toán:</strong> {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Thanh toán bằng PayPal'}
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
                                                        <hr className="d-md-none d-block mt-2"/>
                                                        <div className="info-address col-md-6">
                                                            <strong
                                                                className="d-flex justify-content-center align-items-center mb-2">Địa
                                                                chỉ nhận hàng</strong>
                                                            <div className="address-info">
                                                                <div className="info-item">
                                                                    <strong>Tên:</strong> {order.addName}</div>
                                                                <div className="info-item">
                                                                    <strong>Email:</strong> {order.addEmail}
                                                                </div>
                                                                <div className="info-item"><strong>Số điện
                                                                    thoại:</strong> {order.addPhone}</div>
                                                                <div className="info-item"><strong>Địa
                                                                    chỉ:</strong> {order.addLocation}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </div>
                                    </div>
                                    {index < orders.length - 1 && <hr className="mb-5"/>}
                                </React.Fragment>
                            ))
                            :
                                (
                                    <div className="text-center">
                                        <h3>Không tìm thấy đơn hàng nào</h3>
                                    </div>
                                )
                            }
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

            <ModalReview
                actionModalReview={actionModalReview}
                isShowModalReview={isShowModalReview}
                handleCloseModalReview={handleCloseModalReview}
                dataReview={dataReview}
                fetchMyOrders={fetchMyOrders}
                numRows={numRows}
                currentPage={currentPage}
            />
        </>
    );
};

export default MyOrder;