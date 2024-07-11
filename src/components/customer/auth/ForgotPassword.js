import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import {Spin} from "antd";
import {useState} from "react";
import {toast} from "react-toastify";
import {validateEmail} from "../../../utils/validateEmail";

const ForgotPassword = (props) => {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
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

        return true;
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (!objValidInput.isEmail) {
            setObjValidInput({ ...objValidInput, isEmail: true });
        }
    };

    const handlePressEnter = (e) => {
        if (e.key === "Enter") {
            handleResetPassword();
        }
    }

    const handleResetPassword = async () => {

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
                                                  className={objValidInput.isEmail ? "form-control" : "form-control is-invalid"}
                                                  onKeyPress={(e) => handlePressEnter(e)}/>
                                </Form.Group>

                                <Spin spinning={loading}>
                                    <Button variant="primary" className="w-100 mt-3 mb-3" type="button"
                                            onClick={() => handleResetPassword()}
                                            disabled={loading}>
                                        Gửi link đặt lại mật khẩu
                                    </Button>
                                </Spin>

                                <hr/>

                                <div className="text-center mt-3">
                                    Nhớ mật khẩu?
                                </div>

                                <div className="d-flex justify-content-center mt-3 gap-3 align-items-center">
                                    <button className="custom-button" type="button">
                                        <Link to="/sign-in">Quay lại đăng nhập</Link>
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