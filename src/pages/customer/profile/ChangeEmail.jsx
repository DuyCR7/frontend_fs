import React, {useEffect, useState} from 'react';
import "./changeEmail.scss";
import {useLocation, useNavigate} from "react-router-dom";
import PageHeader from "../components/pageHeader/PageHeader";
import {useDispatch, useSelector} from "react-redux";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {toast} from "react-toastify";
import {validateEmail} from "../../../utils/validateEmail";
import {sendVerificationCode, updateProfileEmail} from "../../../services/customer/profileService";
import {loginCustomer} from "../../../redux/customer/slices/customerSlice";

const ChangeEmail = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const customer = useSelector(state => state.customer);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        if (!customer || !customer.isAuthenticated) {
            navigate('/sign-in');
            return;
        }

        if (customer.typeLogin === 'google' || !location.state || (location.state.email === undefined)) {
            navigate('/account/profiles');
            return;
        }

        setEmail(location.state.email);
    }, [customer, location, navigate]);

    const defaultValidInput = {
        isEmail: true,
        isVerificationCode: true,
    }

    const [objValidInput, setObjValidInput] = useState(defaultValidInput);

    const isValidInputEmail = () => {
        setObjValidInput(defaultValidInput);
        if(!email){
            setObjValidInput({...defaultValidInput, isEmail: false});
            toast.error("Vui lòng nhập email!")
            return false;
        }

        if (!validateEmail(email)){
            setObjValidInput({...defaultValidInput, isEmail: false});
            toast.error("Vui lòng nhập email hợp lệ!");
            return false;
        }

        return true;
    }

    const isValidInputVerificationCode = () => {
        setObjValidInput(defaultValidInput);
        if(!verificationCode){
            setObjValidInput({...defaultValidInput, isVerificationCode: false});
            toast.error("Vui lòng nhập mã xác nhận!")
            return false;
        }

        return true;
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (!objValidInput.isEmail) {
            setObjValidInput({...objValidInput, isEmail: true });
        }
    }

    const handleChangeVerificationCode = (e) => {
        setVerificationCode(e.target.value);
        if (!objValidInput.isVerificationCode) {
            setObjValidInput({...objValidInput, isVerificationCode: true });
        }
    }

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timerId);
        }
    }, [timeLeft]);

    const handleSendCode = async () => {
        let check = isValidInputEmail();
        if (check) {
            setLoading(true);
            try {
                let res = await sendVerificationCode(email);
                if (res && res.EC === 0) {
                    setIsCodeSent(true);
                    setTimeLeft(60);
                    toast.success(res.EM);
                } else {
                    toast.error(res.EM);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSubmit = async () => {
        let check = isValidInputEmail() && isValidInputVerificationCode();
        if (check) {
            setLoading(true);
            try {
                let res = await updateProfileEmail(email, verificationCode);
                if (res && res.EC === 0) {
                    toast.success(res.EM);
                    dispatch(loginCustomer({
                        ...customer,
                        email: email
                    }))
                    navigate('/account/profiles');
                } else {
                    toast.error(res.EM);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
    };

    const handlePressEnterSendCode = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!loading) {
                handleSendCode();
            }
        }
    }

    const handlePressEnterSubmit = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!loading) {
                handleSubmit();
            }
        }
    }
console.log(email);

    return (
        <div className="change-email-page">
            <PageHeader title={"Thay đổi email"} curPage={"Thay đổi email"}/>

            <Container fluid className="my-email mt-5 ps-5 pe-5">
                <Row className="section-wrapper mb-5">
                    <Col md={6} className="mx-auto">
                        <h2 className="text-center">Thay đổi địa chỉ Email</h2>
                        <Form onSubmit={(e) => e.preventDefault()}>
                            {!isCodeSent ? (
                                <>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Địa chỉ Email mới</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Email..."
                                            value={email}
                                            className={objValidInput.isEmail ? "form-control" : "form-control is-invalid"}
                                            onChange={(e) => handleEmailChange(e)}
                                            onKeyPress={(e) => handlePressEnterSendCode(e)}
                                            required
                                        />
                                    </Form.Group>
                                    <Button variant="primary" disabled={loading} type="button" onClick={() => handleSendCode()}>
                                        {loading ? 'Đang xử lý...' : 'Gửi mã xác nhận'}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Mã xác nhận</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Mã xác nhận..."
                                            value={verificationCode}
                                            className={objValidInput.isVerificationCode? "form-control" : "form-control is-invalid"}
                                            onChange={(e) => handleChangeVerificationCode(e)}
                                            onKeyPress={(e) => handlePressEnterSubmit(e)}
                                            required
                                        />
                                    </Form.Group>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <Button variant="primary" type="button" onClick={handleSubmit}>
                                            {loading ? 'Đang xử lý...' : 'Xác thực'}
                                        </Button>
                                        <Button
                                            variant="link"
                                            onClick={handleSendCode}
                                            disabled={loading || timeLeft > 0}
                                        >
                                            {timeLeft > 0 ? `Gửi lại sau ${timeLeft}s` : 'Gửi lại mã'}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ChangeEmail;