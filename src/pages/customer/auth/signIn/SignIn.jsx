import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FaEye, FaEyeSlash} from 'react-icons/fa';
import React, {useEffect, useState} from 'react';
import "./SignIn.scss";
import {Link, useNavigate} from "react-router-dom";
import { Spin } from 'antd';
import {toast} from "react-toastify";
import {validateEmail} from "../../../../utils/validateEmail";
import {signInCustomer} from "../../../../services/customer/authService";
import {useDispatch, useSelector} from "react-redux";
import {loginCustomer, updateCartCount, updateWishListCount} from "../../../../redux/customer/slices/customerSlice";
import {getCartCount} from "../../../../services/customer/cartService";
import {getWishListCount} from "../../../../services/customer/wishListService";
import _ from "lodash";

const SignIn = () => {

    const customer = useSelector((state) => state.customer);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const [showPassword, setShowPassword] = useState(false);

    const defaultSignInData = {
        email: "",
        password: ""
    }

    const [signInData, setSignInData] = useState(defaultSignInData);

    const [errors, setErrors] = useState({});

    const handleOnChangeInput = (value, name) => {
        let _signInData = _.cloneDeep(signInData);
        _signInData[name] = value;
        setSignInData(_signInData);

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: undefined
        }));
    }

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        if (!signInData.email) {
            newErrors.email = 'Vui lòng nhập email!';
            isValid = false;
        }

        if (!signInData.password) {
            newErrors.password = 'Vui lòng nhập mật khẩu!';
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

    const handelSignIn = async () => {
        let check = validateForm();
        if(check) {
            setLoading(true);
            try {
                let res = await signInCustomer(signInData.email, signInData.password);
                if (res && res.EC === 0) {
                    let id = res.DT.id;
                    let email = res.DT.email;
                    // let username = res.DT.username;
                    let access_token = res.DT.access_token;
                    let image = `${process.env.REACT_APP_URL_BACKEND}/${res.DT.image}`;
                    let typeLogin = res.DT.typeLogin;

                    let data = {
                        isAuthenticated: true,
                        access_token,
                        id,
                        email,
                        image,
                        typeLogin
                    }

                    dispatch(loginCustomer(data));

                    try {
                        const [resCartCount, resWishListCount] = await Promise.all([
                            getCartCount(),
                            getWishListCount()
                        ])

                        if(resCartCount && resCartCount.EC === 0) {
                            dispatch(updateCartCount(resCartCount.DT));
                        } else if (resCartCount && resCartCount.EC === 1){
                            dispatch(updateCartCount(resCartCount.DT));
                        }

                        if(resWishListCount && resWishListCount.EC === 0) {
                            dispatch(updateWishListCount(resWishListCount.DT));
                        }

                    } catch (e) {
                        console.error(e);
                        dispatch(updateCartCount(0));
                        dispatch(updateWishListCount(0));
                    }

                    localStorage.setItem("cus_jwt", access_token);

                    toast.success(res.EM);
                    navigate('/');

                }
                else if (res && res.EC === 1) {
                    handleBackendValidationErrors(res.DT, res.EM);
                } else if (res && res.EC === 2) {
                    toast.success(res.EM);
                }
                else {
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
                handelSignIn();
            }
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSignInGoogle = () => {
        window.open(`http://localhost:8080/api/v1/auth/google`, '_self');
    }

    useEffect(() => {
        if (customer && customer.isAuthenticated && localStorage.getItem('cus_jwt')) {
            navigate('/');
        } else {
            setInitialLoading(false);
        }
    }, [customer, navigate]);

    if (initialLoading) {
        return (
            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75" style={{zIndex: 9999}}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <Container fluid className="page-sign-in my-5">
            <Row className="justify-content-center">
                <Col xs={12} sm={8} md={6} lg={4}>
                    <Card className="p-4">
                        <Card.Body>
                            <Link to="/" className="d-flex align-items-center justify-content-center">
                                <img src="/admin/assets/img/kaiadmin/cus_logo_dark.png" width={90}/>
                            </Link>
                            <h2 className="text-center mb-3">Đăng nhập</h2>
                            <div className="text-center mt-3">
                                <span>Bạn chưa có tài khoản? </span><Link to="/sign-up" style={{color: "#007bff"}}>Tạo
                                tài khoản</Link>
                            </div>
                            <Form className="mt-3">
                                <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" placeholder="Email"
                                                  value={signInData.email}
                                                  onChange={(e) => handleOnChangeInput(e.target.value, "email")}
                                                  className={errors.email ? "form-control custom-is-invalid" : "form-control"}
                                                  onKeyPress={(e) => handlePressEnter(e)}/>
                                    {renderError(errors.email)}
                                </Form.Group>

                                <Form.Group className="password-input mt-3">
                                    <Form.Label>Mật khẩu</Form.Label>
                                    <Form.Control type={showPassword ? 'text' : 'password'} placeholder="Mật khẩu"
                                                  value={signInData.password}
                                                  onChange={(e) => handleOnChangeInput(e.target.value, "password")}
                                                  className={errors.password ? "form-control custom-is-invalid" : "form-control"}
                                                  onKeyPress={(e) => handlePressEnter(e)}/>
                                    <div className="password-toggle" onClick={togglePasswordVisibility}>
                                        {showPassword ? <FaEyeSlash/> : <FaEye/>}
                                    </div>
                                </Form.Group>
                                {renderError(errors.password)}

                                <Spin spinning={loading}>
                                    <Button type="button" variant="primary" className="w-100 mt-3"
                                            onClick={() => handelSignIn()}
                                            disabled={loading}>
                                        Đăng nhập
                                    </Button>
                                </Spin>

                                <div className="text-center mt-3">
                                    <Link to="/forgot-password" style={{color: "#007bff"}}>Quên mật khẩu?</Link>
                                </div>

                                <hr/>

                                <div className="text-center mt-3">
                                    Hoặc đăng nhập bằng:
                                </div>

                                <div className="d-flex justify-content-center mt-3 gap-3 align-items-center">
                                    <button className="custom-button" type="button"
                                            onClick={() => handleSignInGoogle()}>
                                        <img src="/admin/assets/img/kaiadmin/icons8-google.svg" className="social-icon"/>
                                        <span style={{color: "#007bff"}}>Đăng nhập với Google</span>
                                    </button>
                                    {/*<button className="custom-button" type="button">*/}
                                    {/*    <img src="/assets/img/kaiadmin/icons8-facebook.svg" className="social-icon"/>*/}
                                    {/*    <span style={{color: "#007bff"}}>Đăng nhập với Facebook</span>*/}
                                    {/*</button>*/}
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default SignIn;