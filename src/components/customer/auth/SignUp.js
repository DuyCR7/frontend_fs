import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaEye, FaEyeSlash} from 'react-icons/fa';
import { useState } from 'react';
import "./SignUp.scss";
import {Link} from "react-router-dom";

const SignUp = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [showCfPassword, setShowCfPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleCfPasswordVisibility = () => {
        setShowCfPassword(!showCfPassword);
    };

    return (
        <Container fluid className="my-5">
            <Row className="justify-content-center">
                <Col xs={12} sm={8} md={6} lg={4}>
                    <h2 className="text-center mb-4">Đăng ký</h2>
                    <div className="text-center mt-3">
                        <span>Bạn đã có tài khoản?</span><Link to="/signin" style={{color: "#007bff"}}> Đăng nhập</Link>
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

                        <Form.Group className="password-input mt-3">
                            <Form.Label>Nhập lại mật khẩu</Form.Label>
                            <Form.Control type={showCfPassword ? 'text' : 'password'} placeholder="Nhập lại mật khẩu"/>
                            <div className="password-toggle" onClick={toggleCfPasswordVisibility}>
                                {showCfPassword ? <FaEyeSlash/> : <FaEye/>}
                            </div>
                        </Form.Group>

                        <div className="text-center mt-3">
                            <span>Tôi đồng ý với <a
                                style={{color: "#007bff", cursor: "pointer"}}>Điều khoản dịch vụ</a> và <a
                                style={{color: "#007bff", cursor: "pointer"}}>Chính sách bảo mật</a></span>
                        </div>

                        <Button variant="primary" className="w-100 mt-3">
                            Đăng ký
                        </Button>

                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default SignUp;