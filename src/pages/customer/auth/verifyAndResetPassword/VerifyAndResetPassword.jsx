import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {
    resetPasswordVerifyLink, verifyAndResetPassword,
} from "../../../../services/customer/authService";
import "./verifyAndResetPassword.scss"
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import {Spin} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import NotFoundPageCus from "../../../../components/NotFoundPageCus/NotFoundPageCus";

const VerifyAndResetPassword = (props) => {

    const navigate = useNavigate();
    const params = useParams();
    const [validUrl, setValidUrl] = useState(false);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingPage, setLoadingPage] = useState(true);
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");
    const defaultValidInput = {
        isPassword: true,
    }

    const [objValidInput, setObjValidInput] = useState(defaultValidInput);

    const isValidInputs = () => {
        setObjValidInput(defaultValidInput);
        if(!password){
            setObjValidInput({...defaultValidInput, isPassword: false});
            toast.error("Vui lòng nhập mật khẩu!")
            return false;
        }

        return true;
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (!objValidInput.isPassword) {
            setObjValidInput({ ...objValidInput, isPassword: true });
        }
    };

    const handlePressEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (!loading) {
                handleVerifyAndResetPassword();
            }
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        handleResetPasswordVerify();
    }, [params]);

    const handleResetPasswordVerify = async () => {
        try {
            let res = await resetPasswordVerifyLink(params.id, params.token);
            if (res && res.EC === 0){
                setValidUrl(true);
            } else {
                toast.error(res.EM);
            }
        } catch (e) {
            console.log(e);
            toast.error(e);
            setValidUrl(false);
        } finally {
            setLoadingPage(false);
        }
    }

    const handleVerifyAndResetPassword = async () => {
        let check = isValidInputs();
        if(check) {
            setLoading(true);
            try {
                let res = await verifyAndResetPassword(password, params.id, params.token);
                if (res && res.EC === 0) {
                    setMsg(res.EM);
                    toast.success(res.EM);
                    setError("");
                    navigate('/sign-in');
                }
                if (res && res.EC !== 0) {
                    setError(res.EM);
                    setMsg("");
                }
            } catch (error) {
                setError(error);
                setMsg("");
            } finally {
                setLoading(false);
            }
        }
    }

    if (loadingPage) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spin spinning={loadingPage}/>
            </div>
        )
    }

    return (
        <>
            {
                validUrl ?
                    <Container fluid className="my-5">
                        <Row className="justify-content-center">
                            <Col xs={12} sm={8} md={6} lg={4}>
                                <Card className="p-4">
                                    <Card.Body>
                                        <h2 className="text-center mb-3 fw-bold">Xác nhận và Đặt lại mật khẩu</h2>
                                        <Form className="mt-3">
                                            <Form.Group className="password-input">
                                                <Form.Label>Mật khẩu mới</Form.Label>
                                                <Form.Control type={showPassword ? 'text' : 'password'} placeholder="Mật khẩu mới"
                                                              value={password}
                                                              onChange={(e) => handlePasswordChange(e)}
                                                              className={objValidInput.isPassword ? "form-control" : "form-control is-invalid"}
                                                              onKeyPress={(e) => handlePressEnter(e)}/>
                                                <div className="password-toggle" onClick={togglePasswordVisibility}>
                                                    {objValidInput.isPassword && (showPassword ? <FaEyeSlash/> :
                                                        <FaEye/>)}
                                                </div>
                                            </Form.Group>

                                            {error && <Alert variant="danger" className="mt-3"
                                                             style={{color: "red"}}>{error}</Alert>}
                                            {msg && <Alert variant="success" className="mt-3" style={{color: "green"}}>{msg}</Alert>}
                                            <Spin spinning={loading}>
                                                <Button variant="primary" className="w-100 mt-3 mb-3" type="button"
                                                        onClick={() => handleVerifyAndResetPassword()}
                                                        disabled={loading}>
                                                    Lưu
                                                </Button>
                                            </Spin>

                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                    :
                    <NotFoundPageCus />
            }
        </>
    )
}

export default VerifyAndResetPassword;