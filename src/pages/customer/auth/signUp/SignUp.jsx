import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import { FaEye, FaEyeSlash} from 'react-icons/fa';
import { useState } from 'react';
import "./SignUp.scss";
import { Spin } from 'antd';
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {validateEmail} from "../../../../utils/validateEmail";
import {signUpCustomer} from "../../../../services/customer/authService";

const SignUp = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cfPassword, setCfPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showCfPassword, setShowCfPassword] = useState(false);

    const defaultValidInput = {
        isEmail: true,
        isPassword: true,
        isCfPassword: true
    }

    const [objValidInput, setObjValidInput] = useState(defaultValidInput);

    const isValidInputs = () => {
        setObjValidInput(defaultValidInput);
        if(!email){
            setObjValidInput({...defaultValidInput, isEmail: false});
            toast.error("Vui lòng nhập email!")
            return false;
        }

        if (!validateEmail(email)){
            setObjValidInput({...defaultValidInput, isEmail: false});
            toast.error("Vui lòng nhập đúng định dạng email!");
            return false;
        }

        if(!password){
            setObjValidInput({...defaultValidInput, isPassword: false});
            toast.error("Vui lòng nhập mật khẩu!");
            return false;
        }

        if(password !== cfPassword){
            setObjValidInput({...defaultValidInput, isCfPassword: false});
            toast.error("Xác nhận lại mật khẩu!");
            return false;
        }

        return true;
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (!objValidInput.isEmail) {
            setObjValidInput({ ...objValidInput, isEmail: true });
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (!objValidInput.isPassword) {
            setObjValidInput({ ...objValidInput, isPassword: true });
        }
    };

    const handleCfPasswordChange = (e) => {
        setCfPassword(e.target.value);
        if (!objValidInput.isCfPassword) {
            setObjValidInput({ ...objValidInput, isCfPassword: true });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleCfPasswordVisibility = () => {
        setShowCfPassword(!showCfPassword);
    };

    const handelSignUp = async () => {
        let check = isValidInputs();
        if (check) {
            setLoading(true);
            try {
                let res = await signUpCustomer(email, password);
                // console.log("Check res: ", res);

                if(res.EC === 0){
                    setMsg(res.EM);
                    setError("");
                    // navigate('/sign-in');
                } else {
                    setMsg("");
                    setError(res.EM);
                }
            } catch (error) {
                console.log("Error: ", error);
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
        <Container fluid className="my-5">
            <Row className="justify-content-center">
                <Col xs={12} sm={8} md={6} lg={4}>
                    <Card className="p-4">
                        <Card.Body>
                            <h2 className="text-center mb-3">Đăng ký</h2>
                            <div className="text-center mt-3">
                                <span>Bạn đã có tài khoản? </span><Link to="/sign-in" style={{color: "#007bff"}}>Đăng
                                nhập</Link>
                            </div>
                            <Form className="mt-3">
                                <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" placeholder="Email"
                                                  value={email}
                                                  onChange={(e) => handleEmailChange(e)}
                                                  className={objValidInput.isEmail ? "form-control" : "form-control is-invalid"}
                                                  onKeyPress={(e) => handlePressEnter(e)}/>
                                </Form.Group>

                                <Form.Group className="password-input mt-3">
                                    <Form.Label>Mật khẩu</Form.Label>
                                    <Form.Control type={showPassword ? 'text' : 'password'} placeholder="Mật khẩu"
                                                  value={password}
                                                  onChange={(e) => handlePasswordChange(e)}
                                                  className={objValidInput.isPassword ? "form-control" : "form-control is-invalid"}
                                                  onKeyPress={(e) => handlePressEnter(e)}/>
                                    <div className="password-toggle" onClick={togglePasswordVisibility}>
                                        {objValidInput.isPassword && (showPassword ? <FaEyeSlash/> : <FaEye/>)}
                                    </div>
                                </Form.Group>

                                <Form.Group className="password-input mt-3">
                                    <Form.Label>Nhập lại mật khẩu</Form.Label>
                                    <Form.Control type={showCfPassword ? 'text' : 'password'}
                                                  placeholder="Nhập lại mật khẩu"
                                                  value={cfPassword}
                                                  onChange={(e) => handleCfPasswordChange(e)}
                                                  className={objValidInput.isCfPassword ? "form-control" : "form-control is-invalid"}
                                                  onKeyPress={(e) => handlePressEnter(e)}/>
                                    <div className="password-toggle" onClick={toggleCfPasswordVisibility}>
                                        {objValidInput.isCfPassword && (showCfPassword ? <FaEyeSlash/> : <FaEye/>)}
                                    </div>
                                </Form.Group>

                                <div className="text-center mt-3">
                            <span>Tôi đồng ý với <a
                                style={{color: "#007bff", cursor: "pointer"}}>Điều khoản dịch vụ</a> và <a
                                style={{color: "#007bff", cursor: "pointer"}}>Chính sách bảo mật</a></span>
                                </div>

                                {msg && <Alert variant="success" className="mt-3" style={{color: "green"}}>{msg}</Alert>}
                                {error && <Alert variant="danger" className="mt-3" style={{color: "red"}}>{error}</Alert>}
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