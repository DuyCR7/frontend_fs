import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaEye, FaEyeSlash} from 'react-icons/fa';
import {useEffect, useState} from 'react';
import "./AdSignIn.scss";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {signInUser} from "../../../services/admin/authService";
import {validateEmail} from "../../../utils/validateEmail";
import {useDispatch, useSelector} from "react-redux";
import {loginUser} from "../../../redux/admin/slices/userSlice";

const AdSignIn = () => {

    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const defaultValidInput = {
        isEmail: true,
        isPassword: true,
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
            toast.error("Vui lòng nhập email hợp lệ!");
            return false;
        }

        if(!password){
            setObjValidInput({...defaultValidInput, isPassword: false});
            toast.error("Vui lòng nhập mật khẩu!");
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

    const handelSignIn = async () => {
        let check = isValidInputs();
        if(check) {
            // setLoading(true);
            try {
                let res = await signInUser(email, password);
                if (res && res.EC === 0) {
                    // let groupWithRoles = res.DT.groupWithRoles;
                    let email = res.DT.email;
                    let username = res.DT.username;
                    let access_token = res.DT.access_token;
                    let image = `data:image/jpeg;base64,${res.DT.image}`;

                    let data = {
                        isAuthenticated: true,
                        access_token,
                        // groupWithRoles,
                        email,
                        username,
                        image
                    }

                    dispatch(loginUser(data));

                    localStorage.setItem("jwt", access_token);
                    // loginContext(data);
                    navigate('/admin');

                }
                if (res && res.EC !== 0) {
                    toast.error(res.EM)
                }
            } catch (error) {
                console.log("Error: ", error);
            } finally {

            }
        }
    }

    const handlePressEnter = (e) => {
        if (e.key === "Enter") {
            handelSignIn();
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        if (user && user.isAuthenticated) {
            navigate('/admin')
        }
    }, []);

    return (
        <Container fluid className="my-5">
            <Row className="justify-content-center">
                <Col xs={12} sm={8} md={6} lg={4}>
                    <h2 className="text-center mb-4">Đăng nhập</h2>

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

                        <div className="text-end mt-3">
                            <a href="#" style={{color: "#007bff"}}>Quên mật khẩu?</a>
                        </div>

                        <Button type="button" variant="primary" className="w-100 mt-3"
                        onClick={() => handelSignIn()}>
                            Đăng nhập
                        </Button>

                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default AdSignIn;