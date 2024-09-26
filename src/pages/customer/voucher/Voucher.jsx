import React, {useEffect, useState} from 'react';
import "./voucher.scss";
import PageHeader from "../components/pageHeader/PageHeader";
import {getAllVouchers} from "../../../services/customer/voucherService";
import {Card} from "react-bootstrap";
import {formatCurrency} from "../../../utils/formatCurrency";
import {CiDiscount1} from "react-icons/ci";
import {formatDate} from "../../../utils/formatDate";
import {formatOnlyDate} from "../../../utils/formatOnlyDate";

const Voucher = () => {

    const [loading, setLoading] = useState(false);
    const [listVoucher, setListVoucher] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [numRows, setNumRows] = useState(10);

    useEffect(() => {
        fetchAllVouchers(currentPage, numRows);
    }, [currentPage, numRows]);

    const fetchAllVouchers = async (page, limit) => {
        setLoading(true);
        try {
            let res = await getAllVouchers(page, limit);
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
                                            <button className="save-btn">Lưu</button>
                                        </Card.Body>
                                    </Card>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
};

export default Voucher;