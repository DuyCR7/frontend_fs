import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Spin } from 'antd';
import _ from "lodash";
import {toast} from "react-toastify";
import {createTeam, updateTeam} from "../../../services/admin/teamService";

const AdModalTeam = (props) => {

    const [loading, setLoading] = useState(false);

    const defaultTeamData = {
        name: "",
    }

    const [teamData, setTeamData] = useState(defaultTeamData);
    const [image, setImage] = useState("");
    const [previewImage, setPreviewImage] = useState("");

    const [errors, setErrors] = useState({});

    const handleOnChangeInput = (value, name) => {
        let _teamData = _.cloneDeep(teamData);
        _teamData[name] = value;
        setTeamData(_teamData);

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: undefined
        }));
    }

    const handleUpLoadImage = (e) => {
        let _teamData = _.cloneDeep(teamData);

        if (e.target && e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
            setPreviewImage(URL.createObjectURL(e.target.files[0]));
            _teamData.image = e.target.files[0];
            setTeamData(_teamData);

            setErrors(prevErrors => ({
                ...prevErrors,
                image: undefined
            }));
        } else {
            setImage("");

            _teamData.image = "";
            setTeamData(_teamData);

            setPreviewImage("");
        }
    }

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        if(!teamData.name.trim()) {
            newErrors.name = "Vui lòng nhập tên đội bóng!";
            isValid = false;
        }

        if(!image) {
            newErrors.image = "Vui lòng chọn hình ảnh!";
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
        if(props.actionModalTeam === "EDIT" && props.dataUpdate && Object.keys(props.dataUpdate).length > 0) {
            setTeamData(props.dataUpdate);

            const image = props.dataUpdate.image ? `${process.env.REACT_APP_URL_BACKEND}/${props.dataUpdate.image}` : "";
            setPreviewImage(image);
            setImage(props.dataUpdate.image);
        } else {
            setTeamData(defaultTeamData);
            setImage("");
            setPreviewImage("");
            setErrors({});
        }
    }, [props.actionModalTeam, props.dataUpdate]);

    const handleSubmit = async () => {
        let check = validateForm();
        if(check) {
            setLoading(true);
            try {
                let res = props.actionModalTeam === "CREATE" ?
                    await createTeam(teamData.name, image)
                    :
                    await updateTeam(teamData.id, teamData.name, image);

                if(res && res.EC === 0) {
                    toast.success(res.EM);
                    props.handleCloseModalTeam();
                    setTeamData(defaultTeamData);
                    setImage("");
                    setPreviewImage("");
                    setErrors({});

                    if(props.actionModalTeam === "CREATE") {
                        props.setCurrentPage(1);
                        props.setSortConfig({ key: 'id', direction: 'DESC' });
                        await props.fetchAllTeam(1, props.numRows);
                    } else {
                        await props.fetchAllTeam(props.currentPage, props.numRows, props.searchKeyword, props.sortConfig);
                    }

                } else if (res && res.EC === 1){
                    handleBackendValidationErrors(res.DT, res.EM);
                } else {
                    toast.error(res.EM);
                }
            } catch (e) {
                console.log(e);
                toast.error(e);
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

    const handleClickCloseModal = () => {
        props.handleCloseModalTeam();
        setTeamData(defaultTeamData);
        setImage("");
        setPreviewImage("");
        setErrors({});
    }

    return (
        <Modal show={props.isShowModalTeam} onHide={() => handleClickCloseModal()} size={"lg"} className="modal-team" centered>
            <Spin spinning={loading}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <span>
                            {props.actionModalTeam === "CREATE" ? "Thêm đội bóng" : "Sửa đội bóng"}
                        </span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="content-body row">
                        <div className="col-12 col-sm-6 form-group">
                            <label>Tên đội bóng (<span style={{color: "red"}}>*</span>):</label>
                            <input
                                type="text"
                                placeholder={"Nhập tên đội bóng..."}
                                className={errors.name ? "form-control is-invalid" : "form-control"}
                                value={teamData.name || ""}
                                onChange={(e) => handleOnChangeInput(e.target.value, "name")}
                                onKeyPress={(e) => handlePressEnter(e)}
                            />
                            {renderError(errors.name)}
                        </div>

                        <div className="col-12 col-sm-6 form-group">
                            <label>Chọn ảnh (<span style={{color: "red"}}>*</span>):</label>
                            <input type="file"
                                   accept="image/*"
                                   className={errors.image ? "form-control is-invalid" : "form-control"}
                                   onChange={(e) => handleUpLoadImage(e)}
                            />
                            {renderError(errors.image)}
                        </div>
                        {previewImage === "" || previewImage === null ? ""
                            :
                            <div className="col-12 col-sm-12 form-group mt-3 text-center">
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

export default AdModalTeam;