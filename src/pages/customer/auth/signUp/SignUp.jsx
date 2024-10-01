import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import { FaEye, FaEyeSlash} from 'react-icons/fa';
import React, { useState } from 'react';
import "./SignUp.scss";
import { Spin } from 'antd';
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {validateEmail} from "../../../../utils/validateEmail";
import {signUpCustomer} from "../../../../services/customer/authService";
import _ from "lodash";

const SignUp = () => {

    const navigate = useNavigate();

    const defaultSignUpData = {
        email: "",
        password: "",
        cfPassword: ""
    }

    const [signUpData, setSignUpData] = useState(defaultSignUpData);

    const [errors, setErrors] = useState({});

    const handleOnChangeInput = (value, name) => {
        let _signUpData = _.cloneDeep(signUpData);
        _signUpData[name] = value;
        setSignUpData(_signUpData);

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: undefined
        }));
    }

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showCfPassword, setShowCfPassword] = useState(false);

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        if (!signUpData.email) {
            newErrors.email = 'Vui lòng nhập email!';
            isValid = false;
        }

        if (!signUpData.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu!';
            isValid = false;
        }

        if (signUpData.password.includes(' ')) {
            newErrors.password = 'Mật khẩu không được chứa khoảng trắng!';
            isValid = false;
        }

        if (!signUpData.cfPassword) {
            newErrors.cfPassword = 'Vui lòng xác nhận lại mật khẩu!';
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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleCfPasswordVisibility = () => {
        setShowCfPassword(!showCfPassword);
    };

    const handelSignUp = async () => {
        let check = validateForm();
        if (check) {
            setLoading(true);
            try {
                let res = await signUpCustomer(signUpData.email, signUpData.password, signUpData.cfPassword);
                // console.log("Check res: ", res);

                if(res.EC === 0){
                    toast.success(res.EM);
                    // navigate('/sign-in');
                } else if (res.EC === 1) {
                    handleBackendValidationErrors(res.DT, res.EM);
                } else {
                    toast.error(res.EM);
                }
            } catch (error) {
                console.log("Error: ", error);
                toast.error(error);
            } finally {
                setLoading(false);
            }
        }
    }

    const handlePressEnter = (e) => {
        if (e.key === "Enter") {
            if (!loading) {
                handelSignUp();
            }
        }
    }

    return (
        <Container fluid className="page-sign-up my-5">
            <Row className="justify-content-center">
                <Col xs={12} sm={8} md={6} lg={4}>
                    <Card className="p-4">
                        <Card.Body>
                            <Link to="/" className="d-flex align-items-center justify-content-center">
                                <img src="/admin/assets/img/kaiadmin/cus_logo_dark.png" width={90}/>
                            </Link>
                            <h2 className="text-center mb-3">Đăng ký</h2>
                            <div className="text-center mt-3">
                                <span>Bạn đã có tài khoản? </span><Link to="/sign-in" style={{color: "#007bff"}}>Đăng
                                nhập</Link>
                            </div>
                            <Form className="mt-3">
                                <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" placeholder="Email"
                                                  value={signUpData.email}
                                                  onChange={(e) => handleOnChangeInput(e.target.value, "email")}
                                                  className={errors.email ? "form-control custom-is-invalid" : "form-control"}
                                                  onKeyPress={(e) => handlePressEnter(e)}/>
                                    {renderError(errors.email)}
                                </Form.Group>

                                <Form.Group className="password-input mt-3">
                                    <Form.Label>Mật khẩu</Form.Label>
                                    <Form.Control type={showPassword ? 'text' : 'password'} placeholder="Mật khẩu"
                                                  value={signUpData.password}
                                                  onChange={(e) => handleOnChangeInput(e.target.value, "password")}
                                                  className={errors.password ? "form-control custom-is-invalid" : "form-control"}
                                                  onKeyPress={(e) => handlePressEnter(e)}/>
                                    <div className="password-toggle" onClick={togglePasswordVisibility}>
                                        {showPassword ? <FaEyeSlash/> : <FaEye/>}
                                    </div>
                                </Form.Group>
                                {renderError(errors.password)}

                                <Form.Group className="password-input mt-3">
                                    <Form.Label>Nhập lại mật khẩu</Form.Label>
                                    <Form.Control type={showCfPassword ? 'text' : 'password'}
                                                  placeholder="Nhập lại mật khẩu"
                                                  value={signUpData.cfPassword}
                                                  onChange={(e) => handleOnChangeInput(e.target.value, "cfPassword")}
                                                  className={errors.cfPassword ? "form-control custom-is-invalid" : "form-control"}
                                                  onKeyPress={(e) => handlePressEnter(e)}/>
                                    <div className="password-toggle" onClick={toggleCfPasswordVisibility}>
                                        {showCfPassword ? <FaEyeSlash/> : <FaEye/>}
                                    </div>
                                </Form.Group>
                                {renderError(errors.cfPassword)}

                                <div className="text-center mt-3">
                            <span>Tôi đồng ý với <a
                                style={{color: "#007bff", cursor: "pointer"}}>Điều khoản dịch vụ</a> và <a
                                style={{color: "#007bff", cursor: "pointer"}}>Chính sách bảo mật</a></span>
                                </div>

                                <Spin spinning={loading}>
                                    <Button variant="primary" className="w-100 mt-3" type="button"
                                            onClick={() => handelSignUp()}
                                            disabled={loading}>
                                        Đăng ký
                                    </Button>
                                </Spin>

                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default SignUp;