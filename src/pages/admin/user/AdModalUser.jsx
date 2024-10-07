import React, {useEffect, useState} from 'react';
import {createUser, getAllRoles, updateUser} from "../../../services/admin/userService";
import {Spin} from "antd";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import _ from "lodash";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import {toast} from "react-toastify";

const AdModalUser = (props) => {

    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);
    const [showPassword, setShowPassword] = useState(false);

    const defaultUserData = {
        email: "",
        password: "",
        phone: "",
        username: "",
        roles: [],
    }

    const [userData, setUserData] = useState(defaultUserData);
    const [image, setImage] = useState("");
    const [previewImage, setPreviewImage] = useState("");

    const [errors, setErrors] = useState({});

    const handleOnChangeInput = (value, name) => {
        let _userData = _.cloneDeep(userData);
        _userData[name] = value;
        setUserData(_userData);

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: undefined
        }));
    }

    const handleUpLoadImage = (e) => {
        let _userData = _.cloneDeep(userData);

        if (e.target && e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
            setPreviewImage(URL.createObjectURL(e.target.files[0]));
            _userData.image = e.target.files[0];
            setUserData(_userData);

            setErrors(prevErrors => ({
                ...prevErrors,
                image: undefined
            }));
        } else {
            setImage("");

            _userData.image = "";
            setUserData(_userData);

            setPreviewImage("");
        }
    }

    const handleOnChangeRole = (isChecked, roleId) => {
        let _userData = _.cloneDeep(userData);

        if (isChecked) {
            _userData.roles.push(roleId);  // Thêm role vào danh sách
        } else {
            _userData.roles = _userData.roles.filter(id => id !== roleId);  // Xóa role nếu bỏ chọn
        }

        setUserData(_userData);
    }

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        if (!userData.email) {
            newErrors.email = 'Vui lòng nhập email!';
            isValid = false;
        }

        if (props.actionModalUser === "CREATE") {
            if (!userData.password) {
                newErrors.password = 'Vui lòng nhập mật khẩu!';
                isValid = false;
            }
        }

        if (props.actionModalUser === "CREATE") {
            if (!userData.phone) {
                newErrors.phone = 'Vui lòng nhập số điện thoại!';
                isValid = false;
            }
        }

        if (props.actionModalUser === "CREATE") {
            if (!userData.username) {
                newErrors.username = 'Vui lòng nhập tên người dùng!';
                isValid = false;
            }
        }

        if (!image) {
            newErrors.image = 'Vui lòng chọn ảnh đại diện!';
            isValid = false;
        }

        if (userData.roles.length === 0) {
            newErrors.roles = 'Vui lòng chọn ít nhất một quyền!';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }

    const handleBackendValidationErrors = (errorField, message) => {
        let newErrors = {};
        if (errorField && message) {
            newErrors[errorField] = message;
        }
        setErrors(prevErrors => ({
            ...prevErrors,
            ...newErrors
        }));
    }

    const renderError = (error) => {
        return error ? <div className="text-danger mt-1">{error}</div> : null;
    };

    useEffect(() => {
        fetchAllRoles();
    }, []);

    const fetchAllRoles = async () => {
        try {
            let res = await getAllRoles();
            if (res && res.EC === 0) {
                setRoles(res.DT);
            } else {
                console.log("Error: ", res.EM);
            }
        } catch (e) {
            console.error(e);
        }
    }

    const handleSubmit = async () => {
        let check = validateForm();
        if (check) {
            setLoading(true);
            try {
                let res = props.actionModalUser === "CREATE" ?
                    await createUser(userData.email.trim(), userData.password, userData.phone.trim(), userData.username.trim(), image, userData.roles)
                    :
                    await updateUser(userData.id, userData.email.trim(), image, userData.roles);

                if (res && res.EC === 0) {
                    toast.success(res.EM);
                    handleClickCloseModal();

                    if(props.actionModalTeam === "CREATE") {
                        props.setCurrentPage(1);
                        props.setSortConfig({ key: 'id', direction: 'DESC' });
                        await props.fetchAllUsers(1, props.numRows);
                    } else {
                        await props.fetchAllUsers(props.currentPage, props.numRows, props.searchKeyword, props.sortConfig);
                    }

                } else if (res && res.EC === 1) {
                    handleBackendValidationErrors(res.DT, res.EM);
                } else {
                    toast.error(res.EM);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
    }

    const handlePressEnter = (e) => {
        if (e.key === "Enter") {
            if (!loading){
                handleSubmit();
            }
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        if (props.actionModalUser === "EDIT" && props.dataUpdate && Object.keys(props.dataUpdate).length > 0) {
            setUserData({
                id: props.dataUpdate.id,
                email: props.dataUpdate.email,
                roles: props.dataUpdate.Roles.map(role => role.id),
            });

            const image = props.dataUpdate.image ? `${process.env.REACT_APP_URL_BACKEND}/${props.dataUpdate.image}` : "";
            setPreviewImage(image);
            setImage(props.dataUpdate.image);
        } else {
            setUserData(defaultUserData);
            setPreviewImage("");
            setImage("");
            setErrors({});
        }
    }, [props.actionModalUser, props.dataUpdate]);

    const handleClickCloseModal = () => {
        props.handleCloseModalUser();
        setUserData(defaultUserData);
        setImage("");
        setPreviewImage("");
        setErrors({});
    }

    return (
        <Modal show={props.isShowModalUser} onHide={() => handleClickCloseModal()} size={"lg"} className="modal-user" centered>
            <Spin spinning={loading}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <span>
                            {props.actionModalUser === "CREATE" ? "Thêm nhân viên" : "Sửa nhân viên"}
                        </span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="content-body row">
                        <div className={`${props.actionModalUser === "EDIT" ? "col-12 form-group" : "col-12 col-sm-6 form-group"}`}>
                            <label>Email (<span style={{color: "red"}}>*</span>):</label>
                            <input
                                type="email"
                                placeholder={"Nhập email..."}
                                className={errors.email ? "form-control custom-is-invalid" : "form-control"}
                                value={userData.email || ""}
                                onChange={(e) => handleOnChangeInput(e.target.value, "email")}
                                onKeyPress={(e) => handlePressEnter(e)}
                            />
                            {renderError(errors.email)}
                        </div>

                        {
                            props.actionModalUser === "CREATE" && (
                                <div className="col-12 col-sm-6 form-group">
                                    <label>Mật khẩu (<span style={{color: "red"}}>*</span>):</label>
                                    <div className="password-input">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder={"Nhập mật khẩu..."}
                                            className={errors.password ? "form-control custom-is-invalid" : "form-control"}
                                            value={userData.password || ""}
                                            onChange={(e) => handleOnChangeInput(e.target.value, "password")}
                                            onKeyPress={(e) => handlePressEnter(e)}
                                        />
                                        <div className="password-toggle" onClick={togglePasswordVisibility}>
                                            {showPassword ? <FaEyeSlash/> : <FaEye/>}
                                        </div>
                                    </div>
                                    {renderError(errors.password)}
                                </div>
                            )
                        }

                        {
                            props.actionModalUser === "CREATE" && (
                                <div className="col-12 col-sm-6 form-group">
                                    <label>Số điện thoại (<span style={{color: "red"}}>*</span>):</label>
                                    <input
                                        type="text"
                                        placeholder={"Nhập số điện thoại..."}
                                        className={errors.phone ? "form-control custom-is-invalid" : "form-control"}
                                        value={userData.phone || ""}
                                        onChange={(e) => handleOnChangeInput(e.target.value, "phone")}
                                        onKeyPress={(e) => handlePressEnter(e)}
                                    />
                                    {renderError(errors.phone)}
                                </div>
                            )
                        }

                        {
                            props.actionModalUser === "CREATE" && (
                                <div className="col-12 col-sm-6 form-group">
                                    <label>Tên người dùng (<span style={{color: "red"}}>*</span>):</label>
                                    <input
                                        type="text"
                                        placeholder={"Nhập tên người dùng..."}
                                        className={errors.username ? "form-control custom-is-invalid" : "form-control"}
                                        value={userData.username || ""}
                                        onChange={(e) => handleOnChangeInput(e.target.value, "username")}
                                        onKeyPress={(e) => handlePressEnter(e)}
                                    />
                                    {renderError(errors.username)}
                                </div>
                            )
                        }

                        <div
                            className={`col-12 form-group`}>
                            <label>Chọn ảnh (<span style={{color: "red"}}>*</span>):</label>
                            <input type="file"
                                   accept="image/*"
                                   className={errors.image ? "form-control custom-is-invalid" : "form-control"}
                                   onChange={(e) => handleUpLoadImage(e)}
                            />
                            {renderError(errors.image)}
                        </div>

                        <div className="col-12 form-group">
                            <label>Phân quyền:</label>
                            <div className="row">
                                {roles && roles.length > 0 && roles.map(role => (
                                    <div key={role.id} className="col-12 col-sm-6 col-md-4 d-flex align-items-center">
                                        <input
                                            className="form-check-input me-2"
                                            type="checkbox"
                                            id={`role-${role.id}`}
                                            value={role.id}
                                            onChange={(e) => handleOnChangeRole(e.target.checked, role.id)}
                                            checked={userData.roles.includes(role.id)}
                                        />
                                        <label className="form-check-label mt-2" htmlFor={`role-${role.id}`}>
                                            {role.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            {renderError(errors.roles)}
                        </div>


                        {previewImage === "" || previewImage === null ? ""
                            :
                            <div className="col-12 form-group mt-3 text-center">
                                <img src={previewImage} width={150} height={150} className="img-thumbnail"/>
                            </div>
                        }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" disabled={loading} onClick={() => handleClickCloseModal()}>
                        Đóng
                    </Button>
                    <Button variant="primary" disabled={loading} onClick={() => handleSubmit()}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Spin>
        </Modal>
    );
};

export default AdModalUser;