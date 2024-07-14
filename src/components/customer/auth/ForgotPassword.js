import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import {Spin} from "antd";
import {useState} from "react";
import {toast} from "react-toastify";
import {validateEmail} from "../../../utils/validateEmail";
import {resetPasswordSendLink} from "../../../services/customer/authService";
import Alert from "react-bootstrap/Alert";

const ForgotPassword = (props) => {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");


    const [isEmail, setIsEmail] = useState(true);

    const isValidInputs = () => {
        setIsEmail(true);
        if(!email){
            setIsEmail(false);
            toast.error("Vui lòng nhập email!")
            return false;
        }

        if (!validateEmail(email)){
            setIsEmail(false);
            toast.error("Vui lòng nhập đúng định dạng email!");
            return false;
        }

        return true;
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (!isEmail) {
            setIsEmail(true);
        }
    };

    const handlePressEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (!loading){
                handleResetPasswordSendLink();
            }
        }
    }

    const handleResetPasswordSendLink = async () => {
        let check = isValidInputs();
        if(check) {
            setLoading(true);
            try {
                let res = await resetPasswordSendLink(email);
                if (res && res.EC === 0) {
                    setMsg(res.EM);
                    setError("");
                }
                if (res && res.EC !== 0) {
                    setError(res.EM);
                    setMsg("");
                }
            } catch (error) {
                setError("");
                setMsg("");
                toast.error(error);
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <Container fluid className="my-5">
            <Row className="justify-content-center">
                <Col xs={12} sm={8} md={6} lg={4}>
                    <Card className="p-4">
                        <Card.Body>
                            <h1 className="text-center mb-3 fw-bold">Quên mật khẩu?</h1>
                            <div className="text-center mt-3">
                                <h5 className="fw-light">Nhập email của bạn để lấy lại mật khẩu</h5>
                            </div>
                            <Form className="mt-3">
                                <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" placeholder="Email"
                                                  value={email}
                                                  onChange={(e) => handleEmailChange(e)}
                                                  className={isEmail ? "form-control" : "form-control is-invalid"}
                                                  onKeyPress={(e) => handlePressEnter(e)}/>
                                </Form.Group>

                                {error && <Alert variant="danger" className="mt-3" style={{color: "red"}}>{error}</Alert>}
                                {msg && <Alert variant="success" className="mt-3" style={{color: "green"}}>{msg}</Alert>}
                                <Spin spinning={loading}>
                                    <Button variant="primary" className="w-100 mt-3 mb-3" type="button"
                                            onClick={() => handleResetPasswordSendLink()}
                                            disabled={loading}>
                                        Gửi link đặt lại mật khẩu
                                    </Button>
                                </Spin>

                                <hr/>

                                <div className="text-center mt-3">
                                    Nhớ mật khẩu?
                                </div>

                                <div className="d-flex justify-content-center mt-3 gap-3 align-items-center">
                                    <button className="custom-button" type="button" onClick={() => navigate('/sign-in') }>
                                        <span style={{color: "#007bff"}}>Quay lại đăng nhập</span>
                                    </button>
                                </div>

                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default ForgotPassword;