import React, {useEffect, useState} from 'react';
import _ from "lodash";
import {Spin} from "antd";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {createVoucher, updateVoucher} from "../../../services/admin/voucherService";
import {toast} from "react-toastify";

const AdModalVoucher = (props) => {

    const [loading, setLoading] = useState(false);

    const defaultVoucherData = {
        code: "",
        discountType: "percentage",
        discountValue: 0,
        maxDiscountAmount: 0,
        minOrderValue: 0,
        startDate: '',
        endDate: '',
        usageLimit: 0,
    }

    const [voucherData, setVoucherData] = useState(defaultVoucherData);

    const [errors, setErrors] = useState({});

    const handleOnChangeInput = (value, name) => {
        let _voucherData = _.cloneDeep(voucherData);
        _voucherData[name] = value;

        if (name === 'discountType') {
            // Nếu chuyển từ percentage sang fixed
            if (value === 'fixed') {
                _voucherData.maxDiscountAmount = "";
            }
        }

        setVoucherData(_voucherData);

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: undefined
        }));
    }

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        if (!voucherData.code.trim()) {
            newErrors.code = "Vui lòng nhập mã code giảm giá";
            isValid = false;
        }

        if (voucherData.discountType === "fixed") {
            if (!voucherData.discountValue) {
                newErrors.discountValue = "Vui lòng nhập giá trị giảm";
                isValid = false;
            }
            if (voucherData.discountValue <= 0) {
                newErrors.discountValue = "Giá trị giảm phải lớn hơn 0";
                isValid = false;
            }
        }

        if (voucherData.discountType === "percentage") {
            if (!voucherData.discountValue) {
                newErrors.discountValue = "Vui lòng nhập giá trị giảm";
                isValid = false;
            }
            if (voucherData.discountValue <= 0 || voucherData.discountValue > 100) {
                newErrors.discountValue = "Giá trị giảm phải trong khoảng từ 1 đến 100";
                isValid = false;
            }
            if (!voucherData.maxDiscountAmount) {
                newErrors.maxDiscountAmount = "Vui lòng nhập giá trị giảm tối đa";
                isValid = false;
            }
            if (voucherData.maxDiscountAmount <= 0) {
                newErrors.maxDiscountAmount = "Giá trị giảm tối đa phải lớn hơn 0";
                isValid = false;
            }
        }

        if (!voucherData.minOrderValue) {
            newErrors.minOrderValue = "Vui lòng nhập giá trị đơn hàng tối thiểu";
            isValid = false;
        }

        if (voucherData.minOrderValue <= 0) {
            newErrors.minOrderValue = "Giá trị đơn hàng tối thiểu phải lớn hơn 0";
            isValid = false;
        }

        const startDate = new Date(voucherData.startDate);
        const endDate = new Date(voucherData.endDate);

        if (!voucherData.startDate.trim()) {
            newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
            isValid = false;
        }
        if (!voucherData.endDate.trim()) {
            newErrors.endDate = "Vui lòng chọn ngày kết thúc";
            isValid = false;
        } else if (startDate >= endDate) {
            newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
            isValid = false;
        }

        if (!voucherData.usageLimit) {
            newErrors.usageLimit = "Vui lòng nhập giới hạn sử dụng";
            isValid = false;
        }

        if (voucherData.usageLimit <= 0) {
            newErrors.usageLimit = "Giới hạn sử dụng phải lớn hơn 0";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }

    const handleBackendValidationErrors = (errorField, message) => {
        let newErrors = {};
        if (errorField && message) {
            newErrors[errorField] = message;
        }
        setErrors(prevErrors => ({
            ...prevErrors,
            ...newErrors
        }));
    }

    const renderError = (error) => {
        return error ? <div className="text-danger mt-1">{error}</div> : null;
    };

    useEffect(() => {
        if(props.actionModalVoucher === "EDIT" && props.dataUpdate && Object.keys(props.dataUpdate).length > 0) {
            let updatedVoucherData = {...props.dataUpdate};

            if (updatedVoucherData.startDate && updatedVoucherData.endDate) {
                updatedVoucherData.startDate = new Date(updatedVoucherData.startDate).toISOString().slice(0, 10);
                updatedVoucherData.endDate = new Date(updatedVoucherData.endDate).toISOString().slice(0, 10);
            }
            setVoucherData(updatedVoucherData);
        } else {
            setVoucherData(defaultVoucherData);
            setErrors({});
        }
    }, [props.actionModalVoucher, props.dataUpdate]);

    const handleSubmit = async () => {
        let check = validateForm();
        if (check) {
            setLoading(true);
            try {
                let res = props.actionModalVoucher === "CREATE" ?
                    await createVoucher(
                        voucherData.code,
                        voucherData.discountType,
                        voucherData.discountValue,
                        voucherData.maxDiscountAmount,
                        voucherData.minOrderValue,
                        voucherData.startDate,
                        voucherData.endDate,
                        voucherData.usageLimit,
                    )
                    :
                    await updateVoucher(
                        voucherData.id,
                        voucherData.code,
                        voucherData.discountType,
                        voucherData.discountValue,
                        voucherData.maxDiscountAmount,
                        voucherData.minOrderValue,
                        voucherData.startDate,
                        voucherData.endDate,
                        voucherData.usageLimit,
                    );
                if (res && res.EC === 0) {
                    toast.success(res.EM);
                    props.handleCloseModalVoucher();
                    setVoucherData(defaultVoucherData);
                    setErrors({});

                    if(props.actionModalVoucher === "CREATE") {
                        props.setCurrentPage(1);
                        props.setSortConfig({key: 'id', direction: 'DESC'});
                        await props.fetchAllVouchers(1, props.numRows);
                    } else {
                        await props.fetchAllVouchers(props.currentPage, props.numRows, props.searchKeyword, props.setSortConfig);
                    }
                } else if (res && res.EC === 1) {
                    handleBackendValidationErrors(res.DT, res.EM);
                } else {
                    toast.error(res.EM);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
    }

    const handlePressEnter = (e) => {
        if (e.key === "Enter") {
            if (!loading){
                handleSubmit();
            }
        }
    }

    const handleClickCloseModal = () => {
        props.handleCloseModalVoucher();
        setErrors({});
        setVoucherData(defaultVoucherData);
    }

    return (
        <Modal show={props.isShowModalVoucher} onHide={() => handleClickCloseModal()} size={"lg"} className="modal-voucher" centered>
            <Spin spinning={loading}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <span>
                            {props.actionModalVoucher === "CREATE" ? "Thêm voucher" : "Sửa voucher"}
                        </span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="content-body row">
                        <div className="col-12 col-sm-6 form-group">
                            <label>Mã giảm giá (<span style={{color: "red"}}>*</span>):</label>
                            <input
                                type="text"
                                placeholder={"Nhập mã giảm giá..."}
                                className={errors.code ? "form-control is-invalid" : "form-control"}
                                value={voucherData.code || ""}
                                onChange={(e) => handleOnChangeInput(e.target.value, "code")}
                                onKeyPress={(e) => handlePressEnter(e)}
                            />
                            {renderError(errors.code)}
                        </div>

                        <div className="col-12 col-sm-6 form-group">
                            <label>Loại voucher (<span style={{color: "red"}}>*</span>):</label>
                            <select
                                className="form-select form-group"
                                value={voucherData.discountType || ""}
                                onChange={(e) => handleOnChangeInput(e.target.value, "discountType")}
                            >
                                <option value={'percentage'}>Phần trăm</option>
                                <option value={'fixed'}>Số tiền cố định</option>
                            </select>
                        </div>

                        <div className="col-12 col-sm-6 form-group">
                            <label>Giá trị giảm ({voucherData.discountType === 'percentage' ? '%' : 'VND'}) (<span style={{color: "red"}}>*</span>):</label>
                            <input
                                type="number"
                                placeholder={"Nhập giá trị giảm..."}
                                className={errors.discountValue ? "form-control is-invalid" : "form-control"}
                                value={voucherData.discountValue || ""}
                                onChange={(e) => handleOnChangeInput(e.target.value, "discountValue")}
                                onKeyPress={(e) => handlePressEnter(e)}
                            />
                            {renderError(errors.discountValue)}
                        </div>

                        <div className="col-12 col-sm-6 form-group">
                            <label>Số tiền giảm tối đa (<span style={{color: "red"}}>*</span>):</label>
                            <input
                                type="number"
                                placeholder={"Nhập số tiền giảm tối đa..."}
                                className={errors.maxDiscountAmount ? "form-control is-invalid" : "form-control"}
                                value={voucherData.maxDiscountAmount || ""}
                                onChange={(e) => handleOnChangeInput(e.target.value, "maxDiscountAmount")}
                                onKeyPress={(e) => handlePressEnter(e)}
                                disabled={voucherData.discountType === "fixed"}
                            />
                            {renderError(errors.maxDiscountAmount)}
                        </div>

                        <div className="col-12 col-sm-6 form-group">
                            <label>Giá trị đơn hàng tối thiểu (<span style={{color: "red"}}>*</span>):</label>
                            <input
                                type="number"
                                placeholder={"Nhập giá trị đơn hàng tối thiểu..."}
                                className={errors.minOrderValue ? "form-control is-invalid" : "form-control"}
                                value={voucherData.minOrderValue || ""}
                                onChange={(e) => handleOnChangeInput(e.target.value, "minOrderValue")}
                                onKeyPress={(e) => handlePressEnter(e)}
                            />
                            {renderError(errors.minOrderValue)}
                        </div>

                        <div className="col-12 col-sm-6 form-group">
                            <label>Giới hạn sử dụng (<span style={{color: "red"}}>*</span>):</label>
                            <input
                                type="number"
                                placeholder={"Nhập giới hạn sử dụng..."}
                                className={errors.usageLimit ? "form-control is-invalid" : "form-control"}
                                value={voucherData.usageLimit || ""}
                                onChange={(e) => handleOnChangeInput(e.target.value, "usageLimit")}
                                onKeyPress={(e) => handlePressEnter(e)}
                            />
                            {renderError(errors.usageLimit)}
                        </div>

                        <div className="col-12 col-sm-6 form-group">
                            <label>Ngày bắt đầu (<span style={{color: "red"}}>*</span>):</label>
                            <input
                                type="date"
                                className={errors.startDate ? "form-control is-invalid" : "form-control"}
                                value={voucherData.startDate || ""}
                                onChange={(e) => handleOnChangeInput(e.target.value, "startDate")}
                            />
                            {renderError(errors.startDate)}
                        </div>

                        <div className="col-12 col-sm-6 form-group">
                            <label>Ngày kết thúc (<span style={{color: "red"}}>*</span>):</label>
                            <input
                                type="date"
                                className={errors.endDate ? "form-control is-invalid" : "form-control"}
                                value={voucherData.endDate || ""}
                                onChange={(e) => handleOnChangeInput(e.target.value, "endDate")}
                            />
                            {renderError(errors.endDate)}
                        </div>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" disabled={loading} onClick={() => handleClickCloseModal()}>
                        Đóng
                    </Button>
                    <Button variant="primary" disabled={loading}
                        onClick={() => handleSubmit()}
                    >
                        Lưu
                    </Button>
                </Modal.Footer>
            </Spin>
        </Modal>
    );
};

export default AdModalVoucher;