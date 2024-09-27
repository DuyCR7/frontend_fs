import React, {useEffect, useState} from 'react';
import "./voucher.scss";
import PageHeader from "../components/pageHeader/PageHeader";
import {getAllVouchers, getAllVouchersForGuest, saveVoucher} from "../../../services/customer/voucherService";
import {Card} from "react-bootstrap";
import {formatCurrency} from "../../../utils/formatCurrency";
import {CiDiscount1} from "react-icons/ci";
import {formatOnlyDate} from "../../../utils/formatOnlyDate";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import ReactPaginate from "react-paginate";
import {useNavigate} from "react-router-dom";

const Voucher = () => {

    const [loading, setLoading] = useState(false);
    const [listVoucher, setListVoucher] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [numRows, setNumRows] = useState(8);

    const navigate = useNavigate();
    const customer = useSelector(state => state.customer);

    useEffect(() => {
        fetchAllVouchers(currentPage, numRows);
    }, [currentPage, numRows, customer.isAuthenticated]);

    const fetchAllVouchers = async (page, limit) => {
        setLoading(true);
        try {
            let res;
            if (customer.isAuthenticated) {
                res = await getAllVouchers(page, limit);
            } else {
                res = await getAllVouchersForGuest(page, limit);
            }
            if (res && res.EC === 0) {
                setListVoucher(res.DT.vouchers);
                setTotalPages(res.DT.totalPages);
            } else {
                console.error('Error:', res.EM);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }

    const getDiscountText = (voucher) => {
        if (voucher.discountType === 'fixed') {
            return `Giảm ${formatCurrency(voucher.discountValue)}`;
        } else {
            return `Giảm ${voucher.discountValue}%`;
        }
    };

    const getUsagePercentage = (voucher) => {
        return Math.round((voucher.usedCount / voucher.usageLimit) * 100);
    };

    const handlePageClick = async (event) => {
        // console.log(event);
        setCurrentPage(+event.selected + 1);
    };

    const handleShowRows = async (numRows) => {
        setNumRows(numRows);
        setCurrentPage(1);
    }

    const handleSaveVoucher = async (id) => {
        if (!customer.isAuthenticated) {
            toast.error("Vui lòng đăng nhập để lưu voucher!");
            return;
        }

        setLoading(true);
        try {
            let res = await saveVoucher(id);
            if (res && res.EC === 0) {
                toast.success(res.EM);
                await fetchAllVouchers(currentPage, numRows);
            } else {
                toast.error(res.EM);
            }
        } catch (e) {
            console.error('Error:', e);
        } finally {
            setLoading(false);
        }
    }
    console.log(listVoucher);
    return (
        <div className="voucher-page">
            <PageHeader title={"Mã giảm giá"} curPage={"Mã giảm giá"}/>

            <div className="voucher-list container-fluid mt-5 ps-5 pe-5">
                <div className="row mb-4 d-flex justify-content-center">
                    {
                        listVoucher.length > 0 && listVoucher.map((voucher) => {
                            const usagePercentage = getUsagePercentage(voucher);
                            return (
                                <div key={voucher.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                    <Card className="voucher-card h-100">
                                        <Card.Body>
                                            <div className="d-flex row align-items-center">
                                                <div className="voucher-icon mb-2 mb-md-0 col-12 col-md-4">
                                                    <CiDiscount1 size={100}/>
                                                </div>
                                                <div className="voucher-info d-flex flex-column gap-2 col-12 col-md-8">
                                                    <h3>{getDiscountText(voucher)}</h3>
                                                    <span className="fs-6 fw-bolder">Đơn tối thiểu: {formatCurrency(voucher.minOrderValue)}</span>
                                                    {voucher.discountType === 'percentage' && voucher.maxDiscountAmount > 0 && (
                                                        <p className="fs-6 fw-bolder">
                                                            Giảm tối đa: {formatCurrency(voucher.maxDiscountAmount)}
                                                        </p>
                                                    )}
                                                    <p className="code">{voucher.code}</p>
                                                    <span className="date">
                                                        HSD: {`${formatOnlyDate(voucher.endDate)}`}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="usage-bar">
                                                <div
                                                    className="usage-progress"
                                                    style={{width: `${usagePercentage}%`}}
                                                ></div>
                                            </div>
                                            <p className="usage-text">
                                                Đã sử dụng: {usagePercentage}% ({voucher.usedCount}/{voucher.usageLimit})
                                            </p>
                                            <div className="voucher-btn">
                                                <button
                                                    className={`save-btn ${customer.isAuthenticated && voucher.Voucher_Customers.length > 0 ? 'saved' : ''}`}
                                                    disabled={loading || (customer.isAuthenticated && voucher.Voucher_Customers.length > 0)}
                                                    onClick={() => handleSaveVoucher(voucher.id)}
                                                >
                                                    {customer.isAuthenticated && voucher.Voucher_Customers.length > 0 ? 'Đã lưu' : 'Lưu'}
                                                </button>
                                                {
                                                    customer.isAuthenticated && voucher.Voucher_Customers.length > 0 && (
                                                        <button
                                                            className={`used-btn ${customer.isAuthenticated && voucher.Voucher_Customers.length > 0 && voucher.Voucher_Customers[0].isUsed ? 'used' : ''}`}
                                                            disabled={loading || (customer.isAuthenticated && voucher.Voucher_Customers.length > 0 && voucher.Voucher_Customers[0].isUsed)}
                                                            onClick={() => navigate('/shops')}
                                                        >
                                                            {customer.isAuthenticated && voucher.Voucher_Customers.length > 0 && voucher.Voucher_Customers[0].isUsed ? 'Đã sử dụng' : 'Dùng ngay'}
                                                        </button>
                                                    )
                                                }
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>
                            );
                        })
                    }
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
                                    <option value={8}>Hiển thị 8</option>
                                    <option value={16}>Hiển thị 16</option>
                                    <option value={24}>Hiển thị 24</option>
                                </select>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};

export default Voucher;