import React, {useEffect, useState} from 'react';
import {Spin} from "antd";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {HexColorPicker} from 'react-colorful';
import _ from "lodash";
import {toast} from "react-toastify";
import {createColor, updateColor} from "../../../services/admin/colorService";

const AdModalColor = (props) => {

    const [loading, setLoading] = useState(false);

    const defaultColorData = {
        name: "",
        code: "",
        description: "",
    }

    const [colorData, setColorData] = useState(defaultColorData);

    const [errors, setErrors] = useState({});

    const handleOnChangeInput = (value, name) => {
        let _colorData = _.cloneDeep(colorData);
        _colorData[name] = value;
        setColorData(_colorData);

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: undefined
        }));
    }

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        if(!colorData.name.trim()) {
            newErrors.name = "Vui lòng nhập tên màu!";
            isValid = false;
        }
        if(!colorData.code.trim()) {
            newErrors.code = "Vui lòng nhập mã code!";
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
        if (props.actionModalColor === "EDIT" && props.dataUpdate && Object.keys(props.dataUpdate).length > 0) {
            setColorData(props.dataUpdate);
        } else {
            setColorData(defaultColorData);
            setErrors({});
        }
    }, [props.actionModalColor, props.dataUpdate]);

    const handleSubmit = async () => {
        let check = validateForm();
        if (check) {
            setLoading(true);
            try {
                let res = props.actionModalColor === "CREATE" ?
                    await createColor(colorData.name.trim(), colorData.code.trim(), colorData.description)
                    :
                    await updateColor(colorData.id, colorData.name.trim(), colorData.code.trim(), colorData.description);
                if (res && res.EC === 0) {
                    toast.success(res.EM);
                    props.handleCloseModalColor();
                    setColorData(defaultColorData);
                    setErrors({});

                    if (props.actionModalColor === "CREATE") {
                        props.setCurrentPage(1);
                        props.setSortConfig({key: 'id', direction: 'DESC'});
                        await props.fetchAllColor(1, props.numRows);
                    } else {
                        await props.fetchAllColor(props.currentPage, props.numRows, props.searchKeyword, props.sortConfig);
                    }

                } else if (res && res.EC === 1) {
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
        props.handleCloseModalColor();
        setErrors({});
        setColorData(defaultColorData);
    }

    return (
        <Modal show={props.isShowModalColor} onHide={() => handleClickCloseModal()} size={"lg"} className="modal-color"
               centered>
            <Spin spinning={loading}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <span>
                            {props.actionModalColor === "CREATE" ? "Thêm màu" : "Sửa màu"}
                        </span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="content-body row">
                        <div className="col-12 col-sm-6">
                            <div className="form-group">
                                <label>Tên màu (<span style={{color: "red"}}>*</span>):</label>
                                <input
                                    type="text"
                                    placeholder={"Nhập tên màu..."}
                                    className={errors.name ? "form-control is-invalid" : "form-control"}
                                    value={colorData.name || ""}
                                    onChange={(e) => handleOnChangeInput(e.target.value, "name")}
                                    onKeyPress={(e) => handlePressEnter(e)}
                                />
                                {renderError(errors.name)}
                            </div>

                            <div className="form-group">
                                <label>Mã màu (<span style={{color: "red"}}>*</span>):</label>
                                <input
                                    type="text"
                                    placeholder={"Nhập mã màu..."}
                                    className={errors.code ? "form-control is-invalid" : "form-control"}
                                    value={colorData.code || ""}
                                    onChange={(e) => handleOnChangeInput(e.target.value, "code")}
                                    onKeyPress={(e) => handlePressEnter(e)}
                                />
                                {renderError(errors.code)}
                            </div>

                            <div className="form-group">
                                <label>Mô tả:</label>
                                <input
                                    type="text"
                                    placeholder={"Nhập mô tả..."}
                                    className="form-control"
                                    value={colorData.description || ""}
                                    onChange={(e) => handleOnChangeInput(e.target.value, "description")}
                                    onKeyPress={(e) => handlePressEnter(e)}
                                />
                            </div>
                        </div>

                        <div className="d-flex gap-4 col-12 col-sm-6 mt-sm-4 mt-3 d-flex align-items-center justify-content-center">
                            <div style={{ backgroundColor: colorData.code, width: "50px", height: "50px", border: "1px solid", borderRadius: "5px" }}></div>
                            <HexColorPicker
                                color={colorData.code}
                                onChange={(color) => handleOnChangeInput(color, "code")}
                            />
                        </div>

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

export default AdModalColor;