import React, { useEffect, useRef, useState } from 'react';
import "./profile.scss";
import { Container, Row, Col, Form, Button, Image } from 'react-bootstrap';
import PageHeader from "../components/pageHeader/PageHeader";
import {useDispatch, useSelector} from "react-redux";
import {getProfile, updateProfile} from "../../../services/customer/profileService";
import { useNavigate } from "react-router-dom";
import { TbUpload } from "react-icons/tb";
import { FiEdit } from "react-icons/fi";
import {toast} from "react-toastify";
import {loginCustomer} from "../../../redux/customer/slices/customerSlice";
import ChangePassword from "./ChangePassword";

const Profile = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const customer = useSelector(state => state.customer);
    const [profile, setProfile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const [imageChanged, setImageChanged] = useState(false);

    const [isShowModalChangePassword, setIsShowModalChangePassword] = useState(false);

    useEffect(() => {
        if (!customer || !customer.isAuthenticated) {
            navigate('/sign-in');
        } else {
            fetchMyProfile();
        }
    }, [customer.isAuthenticated, navigate]);

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const fetchMyProfile = async () => {
        try {
            let res = await getProfile();
            if (res && res.EC === 0) {
                setProfile(res.DT);
            } else {
                console.log("Error: ", res.EM);
            }
        } catch (e) {
            console.error(e);
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            let res = await updateProfile(profile.fullname, profile.username, profile.phone, profile.sex, profile.birthdate, imageChanged ? imageFile : null);
            if (res && res.EC === 0) {
                toast.success(res.EM);
                await fetchMyProfile();

                if (imageFile) {
                    const imageUrl = `${process.env.REACT_APP_URL_BACKEND}/${res.DT.image}`;
                    dispatch(loginCustomer({
                        ...customer,
                        image: imageUrl
                    }));
                }

                setImageChanged(false);

            } else {
                toast.warn(res.EM);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = async (e) => {
        if (e.target && e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setImageChanged(true);
        }
    };

    const handleEditEmail = () => {
        const currentEmail = profile?.email || '';
        navigate('/account/email', { state: { email: currentEmail } });
    };

    return (
        <>
            <div className="profile-page">
                <PageHeader title={"Thông tin tài khoản"} curPage={"Thông tin tài khoản"}/>

                <Container fluid className="my-profiles mt-5 mb-5 ps-5 pe-5">
                    <Row className="section-wrapper">
                        <Col md={4} className="text-center mb-4 mb-md-0">
                            <div className="image-container" onClick={handleImageClick}>
                                <Image src={imagePreview || (profile?.image.startsWith('https')
                                    ? profile?.image
                                    : `${process.env.REACT_APP_URL_BACKEND}/${profile?.image}`)} roundedCircle
                                       className="profile-image mb-3"/>
                                <div className="image-overlay">
                                    <span><TbUpload size={30}/></span>
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                style={{display: 'none'}}
                                accept="image/*"
                            />
                            <h3>{profile?.username || profile?.email}</h3>
                        </Col>
                        <Col md={8}>
                            <Form onSubmit={(e) => e.preventDefault()}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Họ và tên</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="fullname"
                                                value={profile?.fullname || ''}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Tên người dùng</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="username"
                                                value={profile?.username || ''}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email</Form.Label>
                                            <div className="d-flex">
                                                <Form.Control
                                                    type="email"
                                                    name="email"
                                                    value={profile?.email || ''}
                                                    disabled
                                                />
                                                {
                                                    customer.typeLogin === 'normal' || customer.typeLogin === 'github' && (
                                                        <Button variant="outline-primary" onClick={handleEditEmail}
                                                                className="ms-2">
                                                            <FiEdit
                                                                className="d-flex align-items-center justify-content-center"/>
                                                        </Button>
                                                    )
                                                }
                                            </div>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Số điện thoại</Form.Label>
                                            <div className="d-flex">
                                                <Form.Control
                                                    type="tel"
                                                    name="phone"
                                                    value={profile?.phone || ''}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Giới tính</Form.Label>
                                            <Form.Select
                                                className="form-control"
                                                name="sex"
                                                value={profile?.sex || ''}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Chọn giới tính</option>
                                                <option value="nam">Nam</option>
                                                <option value="nu">Nữ</option>
                                                <option value="khac">Khác</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Ngày sinh</Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="birthdate"
                                                value={profile?.birthdate || ''}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="d-flex flex-wrap gap-3 justify-content-end mt-3">
                                    {
                                        customer.typeLogin === 'normal' && (
                                            <Button variant="outline-dark" disabled={loading} type="button"
                                                    onClick={() => setIsShowModalChangePassword(true)}>
                                                Đổi mật khẩu
                                            </Button>
                                        )
                                    }
                                    <Button variant="outline-primary" disabled={loading} type="button"
                                            onClick={() => handleSubmit()}>
                                        {loading ? 'Đang xử lý...' : 'Lưu'}
                                    </Button>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>

            <ChangePassword
                isShowModalChangePassword={isShowModalChangePassword}
                onCloseModalChangePassword={() => setIsShowModalChangePassword(false)}
            />
        </>
    );
};

export default Profile;