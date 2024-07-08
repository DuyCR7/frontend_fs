import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaEye, FaEyeSlash} from 'react-icons/fa';
import { useState } from 'react';
import "./SignIn.scss";
import {Link} from "react-router-dom";

const SignIn = () => {

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Container fluid className="my-5">
            <Row className="justify-content-center">
                <Col xs={12} sm={8} md={6} lg={4}>
                    <h2 className="text-center mb-4">Đăng nhập</h2>
                    <div className="text-center mt-3">
                        <span>Bạn chưa có tài khoản?</span><Link to="/signup" style={{color: "#007bff"}}> Tạo tài khoản</Link>
                    </div>
                    <Form className="mt-3">
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Email"/>
                        </Form.Group>

                        <Form.Group className="password-input mt-3">
                            <Form.Label>Mật khẩu</Form.Label>
                            <Form.Control type={showPassword ? 'text' : 'password'} placeholder="Mật khẩu"/>
                            <div className="password-toggle" onClick={togglePasswordVisibility}>
                                {showPassword ? <FaEyeSlash/> : <FaEye/>}
                            </div>
                        </Form.Group>

                        <Form.Group>
                            <Form.Check type="checkbox" label="Lưu đăng nhập"/>
                        </Form.Group>

                        <Button variant="primary" className="w-100">
                            Đăng nhập
                        </Button>

                        <div className="text-center mt-3">
                            <a href="#" style={{color: "#007bff"}}>Quên mật khẩu?</a>
                        </div>

                        <hr />

                        <div className="text-center mt-3">
                            Hoặc đăng nhập bằng:
                        </div>

                        <div className="d-flex justify-content-center mt-3 gap-3 align-items-center">
                            <button className="custom-button">
                                <img src="/assets/img/kaiadmin/icons8-google.svg" className="social-icon"/>
                                <span style={{color: "#007bff"}}>Đăng nhập với Google</span>
                            </button>
                            <button className="custom-button">
                                <img src="/assets/img/kaiadmin/icons8-facebook.svg" className="social-icon"/>
                                <span style={{color: "#007bff"}}>Đăng nhập với Facebook</span>
                            </button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default SignIn;