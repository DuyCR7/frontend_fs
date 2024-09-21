import React, {useEffect, useState} from 'react';
import useDebounce from "../../../utils/useDebounce";
import {getAllOrders, updateOrderStatus} from "../../../services/admin/orderService";
import {IoReload} from "react-icons/io5";
import {Spin} from "antd";
import {FaLongArrowAltDown, FaLongArrowAltUp} from "react-icons/fa";
import {formatDate} from "../../../utils/formatDate";
import ReactPaginate from "react-paginate";
import {formatCurrency} from "../../../utils/formatCurrency";
import {toast} from "react-toastify";
import "./adOrder.scss";
import AdModalOrderDetail from "./AdModalOrderDetail";

const AdOrder = () => {

    const [listOrders, setListOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [numRows, setNumRows] = useState(10);

    const [searchKeyword, setSearchKeyword] = useState("");
    const debouncedSearchInput = useDebounce(searchKeyword, 500);

    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'DESC' });

    const [isShowModalDetailOrder, setIsShowModalDetailOrder] = useState(false);
    const [dataOrderDetail, setDataOrderDetail] = useState(null);

    const handlePageClick = async (event) => {
        // console.log(event);
        setCurrentPage(+event.selected + 1);
    };

    const handleShowRows = async (numRows) => {
        setNumRows(numRows);
        setCurrentPage(1);
    }

    const handleSearch = (e) => {
        setSearchKeyword(e.target.value);
        setCurrentPage(1);
    }

    const handleSort = (key) => {
        let direction = 'DESC';
        if (sortConfig.key === key && sortConfig.direction === 'DESC') {
            direction = 'ASC';
        }
        setSortConfig({ key, direction });
    }

    const fetchAllOrders = async (currentPage, numRows, searchKeyword = "", sortConfig = {key: 'id', direction: 'DESC'}) => {
        setLoading(true);
        try {
            let res = await getAllOrders(currentPage, numRows, searchKeyword.trim(), sortConfig);
            if (res && res.EC === 0) {
                setListOrders(res.DT.orders);
                setTotalPage(res.DT.totalPages);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (debouncedSearchInput === searchKeyword) {
            fetchAllOrders(currentPage, numRows, debouncedSearchInput, sortConfig);
        }
    }, [currentPage, numRows, debouncedSearchInput, sortConfig]);

    const handleRefresh = () => {
        setCurrentPage(1);
        setSearchKeyword("");
        setSortConfig({ key: 'id', direction: 'DESC' });
    }

    const handleStatusChange = async (orderId, newStatus) => {
        setLoading(true);
        try {
            let res = await updateOrderStatus(orderId, newStatus);
            if (res && res.EC === 0) {
                toast.success(res.EM);
                await fetchAllOrders(currentPage, numRows, debouncedSearchInput, sortConfig);
            } else {
                toast.error(res.EM);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const getStatusButton = (status, orderId) => {
        let buttonText = '';
        let buttonClass = 'btn btn-sm ';
        let isDisabled = false;

        switch(status) {
            case 0:
                buttonText = 'Đã hủy';
                buttonClass += 'btn-danger';
                isDisabled = true;
                break;
            case 1:
                buttonText = 'Xác nhận';
                buttonClass += 'btn-primary';
                break;
            case 2:
                buttonText = 'Gửi hàng';
                buttonClass += 'btn-info';
                break;
            case 3:
                buttonText = 'Đang giao';
                buttonClass += 'btn-warning';
                isDisabled = true;
                break;
            case 4:
                buttonText = 'Hoàn thành';
                buttonClass += 'btn-success';
                isDisabled = true;
                break;
            default:
                buttonText = 'Không xác định';
                buttonClass += 'btn-secondary';
        }

        return (
            <button
                className={buttonClass}
                disabled={isDisabled}
                onClick={() => !isDisabled && handleStatusChange(orderId, status + 1)}
            >
                {buttonText}
            </button>
        );
    };

    const handleCloseModalOrderDetail = () => {
        setIsShowModalDetailOrder(false);
        setDataOrderDetail(null);
    }

    const viewDetailOrder = (order) => {
        setIsShowModalDetailOrder(true);
        setDataOrderDetail(order);
    }

    return (
        <>
            <div className="page-inner">
                <div className="d-flex align-items-center mb-3">
                    <button
                        className="d-flex align-items-center justify-content-center gap-1 col-md-2 col-xl-2 col-5 btn btn-outline-success"
                        onClick={handleRefresh}
                        style={{width: "max-content", marginRight: "10px"}}
                    >
                        <IoReload size={22}/>
                        <span className="d-none d-sm-block">Làm mới</span>
                    </button>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Nhập mã đơn hàng..."
                        value={searchKeyword}
                        onChange={(e) => handleSearch(e)}
                    />
                </div>

                <div className="table-orders table-responsive">
                    <Spin spinning={loading}>
                        <table className="table table-hover table-striped">
                            <thead className="on-top">
                            <tr className="text-center table-active">
                                <th scope="col">STT</th>
                                <th scope="col" style={{cursor: "pointer"}} onClick={() => handleSort('id')}>
                                    Mã
                                    {
                                        sortConfig && sortConfig.key === 'id' && sortConfig.direction === 'ASC' &&
                                        <FaLongArrowAltDown/>
                                    }
                                    {
                                        sortConfig && sortConfig.key === 'id' && sortConfig.direction === 'DESC' &&
                                        <FaLongArrowAltUp/>
                                    }
                                </th>
                                <th scope="col">Điện thoại</th>
                                <th scope="col" style={{cursor: "pointer"}} onClick={() => handleSort('totalPrice')}>
                                    Tổng tiền
                                    {
                                        sortConfig && sortConfig.key === 'totalPrice' && sortConfig.direction === 'ASC' &&
                                        <FaLongArrowAltDown/>
                                    }
                                    {
                                        sortConfig && sortConfig.key === 'totalPrice' && sortConfig.direction === 'DESC' &&
                                        <FaLongArrowAltUp/>
                                    }
                                </th>
                                <th scope="col">Ngày đặt hàng</th>
                                <th scope="col">Thanh toán</th>
                                <th scope="col">Tình trạng</th>
                                <th scope="col">Thông tin</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                listOrders && listOrders.length > 0 ?
                                    <>
                                        {
                                            listOrders.map((item, index) => {
                                                return (
                                                    <tr className="text-center" key={item.id}>
                                                        <td>{(currentPage - 1) * numRows + index + 1}</td>
                                                        <td>{item.id}</td>
                                                        <td>{item.addPhone}</td>
                                                        <td>{formatCurrency(item.totalPrice)}</td>
                                                        <td>{formatDate(item.createdAt)}</td>
                                                        <td>{item.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Thanh toán bằng PayPal'}</td>
                                                        <td>{getStatusButton(item.status, item.id)}</td>
                                                        <td>
                                                            <button className="btn btn-sm btn-outline-info"
                                                                    onClick={() => viewDetailOrder(item)}>
                                                                Chi tiết
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </>
                                    :
                                    <>
                                        <tr>
                                            <td colSpan={9}>Không tìm thấy dữ liệu</td>
                                        </tr>
                                    </>
                            }
                            </tbody>
                        </table>
                    </Spin>
                </div>

                {totalPage > 0 &&
                    <div className="orders-footer mt-3 row">
                        <div className="col d-flex justify-content-sm-end justify-content-center align-items-center">
                            <div className="me-3">
                                <ReactPaginate
                                    nextLabel="Next"
                                    onPageChange={handlePageClick}
                                    pageRangeDisplayed={3}
                                    marginPagesDisplayed={2}
                                    pageCount={totalPage}
                                    previousLabel="Prev"
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
                                    <option value={10}>Show 10</option>
                                    <option value={20}>Show 20</option>
                                    <option value={30}>Show 30</option>
                                </select>
                            </div>
                        </div>
                    </div>
                }
            </div>

            <AdModalOrderDetail
                isShowModalDetailOrder={isShowModalDetailOrder}
                handleCloseModalOrderDetail={handleCloseModalOrderDetail}
                dataOrderDetail={dataOrderDetail}
            />
        </>
    );
};

export default AdOrder;