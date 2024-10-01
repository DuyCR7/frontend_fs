import React, {useState} from 'react';
import _ from "lodash";
import {Spin} from "antd";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {changePassword} from "../../../services/customer/profileService";
import {toast} from "react-toastify";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import "./changePassword.scss";

const ChangePassword = ({isShowModalChangePassword, onCloseModalChangePassword}) => {

    const [loading, setLoading] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const defaultPasswordData = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    }

    const [passwordData, setPasswordData] = useState(defaultPasswordData);

    const [errors, setErrors] = useState({});

    const handleOnChangeInput = (value, name) => {
        let _passwordData = _.cloneDeep(passwordData);
        _passwordData[name] = value;
        setPasswordData(_passwordData);

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: undefined
        }));
    }

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        if (!passwordData.oldPassword) {
            newErrors.oldPassword = 'Vui lòng nhập mật khẩu cũ!';
            isValid = false;
        }

        if (!passwordData.newPassword) {
            newErrors.newPassword = 'Vui lòng nhập mật khẩu mới!';
            isValid = false;
        }

        if (!passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới!';
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

    const handleClickCloseModal = () => {
        onCloseModalChangePassword();
        setPasswordData(defaultPasswordData);
        setErrors({});
    }

    const handleSubmit = async () => {
        let check = validateForm();
        if (check) {
            setLoading(true);
            try {
                let res = await changePassword(passwordData.oldPassword, passwordData.newPassword, passwordData.confirmPassword);
                if (res && res.EC === 0) {
                    toast.success(res.EM);
                    handleClickCloseModal();
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
            if (!loading) {
                handleSubmit();
            }
        }
    }

    return (
        <Modal show={isShowModalChangePassword} onHide={() => handleClickCloseModal()} size={"md"}
               className="modal-change-password" centered>
            <Spin spinning={loading}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <span>
                            Đổi mật khẩu
                        </span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="content-body row">
                        <div className="col-12 form-group password-input">
                            <label>Mật khẩu cũ (<span style={{color: "red"}}>*</span>):</label>
                            <input
                                type={showOldPassword ? 'text' : 'password'}
                                placeholder={"Nhập mật khẩu cũ..."}
                                className={errors.oldPassword ? "form-control custom-is-invalid" : "form-control"}
                                value={passwordData.oldPassword || ""}
                                onChange={(e) => handleOnChangeInput(e.target.value, "oldPassword")}
                                onKeyPress={(e) => handlePressEnter(e)}
                            />
                            <div className="password-toggle" onClick={() => setShowOldPassword(!showOldPassword)}>
                                {showOldPassword ? <FaEyeSlash/> : <FaEye/>}
                            </div>
                        </div>
                        {renderError(errors.oldPassword)}

                        <div className="col-12 form-group password-input">
                            <label>Mật khẩu mới (<span style={{color: "red"}}>*</span>):</label>
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                placeholder={"Nhập mật khẩu mới..."}
                                className={errors.newPassword ? "form-control custom-is-invalid" : "form-control"}
                                value={passwordData.newPassword || ""}
                                onChange={(e) => handleOnChangeInput(e.target.value, "newPassword")}
                                onKeyPress={(e) => handlePressEnter(e)}
                            />
                            <div className="password-toggle" onClick={() => setShowNewPassword(!showNewPassword)}>
                                {showNewPassword ? <FaEyeSlash/> : <FaEye/>}
                            </div>
                        </div>
                        {renderError(errors.newPassword)}

                        <div className="col-12 form-group password-input">
                            <label>Xác nhận mật khẩu (<span style={{color: "red"}}>*</span>):</label>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder={"Xác nhận mật khẩu..."}
                                className={errors.confirmPassword ? "form-control custom-is-invalid" : "form-control"}
                                value={passwordData.confirmPassword || ""}
                                onChange={(e) => handleOnChangeInput(e.target.value, "confirmPassword")}
                                onKeyPress={(e) => handlePressEnter(e)}
                            />
                            <div className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <FaEyeSlash/> : <FaEye/>}
                            </div>
                        </div>
                        {renderError(errors.confirmPassword)}

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" disabled={loading} onClick={() => handleClickCloseModal()}>
                        Đóng
                    </Button>
                    <Button variant="primary" disabled={loading} onClick={() => handleSubmit()}>
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Spin>
        </Modal>
    );
};

export default ChangePassword;