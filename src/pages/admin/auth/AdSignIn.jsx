import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FaEye, FaEyeSlash} from 'react-icons/fa';
import React, {useEffect, useState} from 'react';
import "./adSignIn.scss";
import { Spin } from 'antd';
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {signInUser} from "../../../services/admin/authService";
import {validateEmail} from "../../../utils/validateEmail";
import {useDispatch, useSelector} from "react-redux";
import {loginUser} from "../../../redux/admin/slices/userSlice";
import _ from "lodash";

const AdSignIn = () => {

    const user = useSelector((state) => state.user);
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
        //
        // if (!validateEmail(signInData.email)) {
        //     newErrors.email = 'Vui lòng nhập email hợp lệ!';
        //     isValid = false;
        // }

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
                let res = await signInUser(signInData.email, signInData.password);
                if (res && res.EC === 0) {
                    let rolesAndPermissions = res.DT.rolesAndPermissions;
                    let id = res.DT.id;
                    let email = res.DT.email;
                    let username = res.DT.username;
                    let access_token = res.DT.access_token;
                    let image = `${process.env.REACT_APP_URL_BACKEND}/${res.DT.image}`;

                    let data = {
                        isAuthenticated: true,
                        access_token,
                        rolesAndPermissions,
                        id,
                        email,
                        username,
                        image
                    }

                    dispatch(loginUser(data));

                    localStorage.setItem("jwt", access_token);
                    toast.success(res.EM);
                    navigate('/admin');

                }
                else if (res && res.EC === 1) {
                    toast.warn(res.EM);
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
            if (!loading){
                handelSignIn();
            }
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        if (user && user.isAuthenticated && localStorage.getItem('jwt')) {
            navigate('/admin')
        } else {
            setInitialLoading(false);
        }
    }, [user, navigate]);

    if (initialLoading) {
        return (
            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75" style={{zIndex: 9999}}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <Container fluid className="adpage-sign-in vh-100 d-flex align-items-center justify-content-center">
            <Row className="w-100 h-100">
                <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
                    <Card className="p-4" style={{ maxWidth: '450px', width: '100%' }}>
                        <Card.Body>
                            <h2 className="text-center mb-3">Đăng nhập</h2>

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

                                {/*<div className="text-end mt-3">*/}
                                {/*    <a href="#" style={{color: "#007bff"}}>Quên mật khẩu?</a>*/}
                                {/*</div>*/}

                                <Spin spinning={loading}>
                                    <Button type="button" variant="primary" className="w-100 mt-4"
                                            onClick={() => handelSignIn()}
                                            disabled={loading}>
                                        Đăng nhập
                                    </Button>
                                </Spin>

                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} className="d-none d-md-block p-0">
                    <div
                        className="h-100 w-100"
                        style={{
                            backgroundImage: 'url("/admin/assets/img/signin.png")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default AdSignIn;