import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaEye, FaEyeSlash} from 'react-icons/fa';
import { useState } from 'react';
import "./AdSignIn.scss";
import {Link} from "react-router-dom";

const AdSignIn = () => {

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Container fluid className="my-5">
            <Row className="justify-content-center">
                <Col xs={12} sm={8} md={6} lg={4}>
                    <h2 className="text-center mb-4">Đăng nhập</h2>

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

                        <Form.Group className="mt-3">
                            <Form.Check type="checkbox" label="Lưu đăng nhập"/>
                        </Form.Group>

                        <div className="text-end">
                            <a href="#" style={{color: "#007bff"}}>Quên mật khẩu?</a>
                        </div>

                        <Button variant="primary" className="w-100 mt-3">
                            Đăng nhập
                        </Button>

                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default AdSignIn;