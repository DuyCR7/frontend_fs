import React from 'react';
import "./voucherModal.scss";
import {Button, Card, Modal} from "react-bootstrap";
import {CiDiscount1} from "react-icons/ci";
import {formatCurrency} from "../../../../utils/formatCurrency";
import {formatOnlyDate} from "../../../../utils/formatOnlyDate";
import {useNavigate} from "react-router-dom";

const VoucherModal = ({show, onHide, vouchers, onApplyVoucher, subtotal}) => {

    const navigate = useNavigate();

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

    const calculateDiscount = (voucher) => {
        if (subtotal < voucher.minOrderValue) {
            return 0;
        }

        let discount = 0;
        if (voucher.discountType === 'fixed') {
            discount = voucher.discountValue;
        } else {
            discount = (subtotal * voucher.discountValue) / 100;
            if (voucher.maxDiscountAmount && discount > voucher.maxDiscountAmount) {
                discount = voucher.maxDiscountAmount;
            }
        }
        return discount;
    };

    const isVoucherApplicable = (voucher) => {
        return subtotal >= voucher.minOrderValue;
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            backdrop="static"
            keyboard={false}
            className="checkout-voucher-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title>Chọn mã giảm giá</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {vouchers.length > 0 ? (
                        vouchers.map((voucher) => {
                            const usagePercentage = getUsagePercentage(voucher);
                            const isApplicable = isVoucherApplicable(voucher);
                            return (
                                <Card key={voucher.id} className="voucher-card mb-3">
                                    <Card.Body>
                                        <div className="d-flex row align-items-center">
                                            <div className="voucher-icon mb-2 mb-md-0 col-12 col-md-4">
                                                <CiDiscount1 size={100}/>
                                            </div>
                                            <div className="voucher-info d-flex flex-column gap-2 col-12 col-md-8">
                                                <h3>{getDiscountText(voucher)}</h3>
                                                <span
                                                    className="fs-6 fw-bolder">Đơn tối thiểu: {formatCurrency(voucher.minOrderValue)}</span>
                                                {voucher.discountType === 'percentage' && voucher.maxDiscountAmount > 0 && (
                                                    <p className="fs-6 fw-bolder">
                                                        Giảm tối đa: {formatCurrency(voucher.maxDiscountAmount)}
                                                    </p>
                                                )}
                                                <p className="code">{voucher.code}</p>
                                                <span className="date">
                                                        HSD: {`${formatOnlyDate(voucher.endDate)}`}
                                                </span>
                                                {!isApplicable && (
                                                    <p className="text-danger">
                                                        Áp dụng cho đơn hàng từ {formatCurrency(voucher.minOrderValue)}
                                                    </p>
                                                )}
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
                                        <button className="voucher-btn"
                                                onClick={() => onApplyVoucher(voucher, calculateDiscount(voucher))}
                                                disabled={!isApplicable}>
                                            Áp dụng
                                        </button>
                                    </Card.Body>
                                </Card>
                            )
                        })
                    )
                    :
                    (
                        <div className="d-flex flex-wrap align-items-center justify-content-center">
                            <span>Bạn chưa có mã giảm giá nào.</span>
                            <Button className="ms-0 ms-md-2 p-0" variant={"link"} onClick={() => navigate('/vouchers')}>Săn ngay</Button>
                        </div>
                    )
                }
            </Modal.Body>
        </Modal>
    );
};

export default VoucherModal;