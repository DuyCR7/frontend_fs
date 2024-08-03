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

    const defaultValidInputs = {
        name: true,
        code: true,
    }

    const [objCheckInputs, setObjCheckInputs] = useState(defaultValidInputs);

    const handleOnChangeInput = (value, name) => {
        let _colorData = _.cloneDeep(colorData);
        _colorData[name] = value;
        setColorData(_colorData);

        if (name === "name" && !objCheckInputs.name) {
            setObjCheckInputs({...objCheckInputs, name: true});
        }
        if (name === "code" && !objCheckInputs.code) {
            setObjCheckInputs({...objCheckInputs, code: true});
        }
    }

    const isValidInputs = () => {
        setObjCheckInputs(defaultValidInputs);

        let arr = ['name', 'code'];
        let check = true;

        for (let i = 0; i < arr.length; i++) {
            if (!colorData[arr[i]]) {
                let _objCheckInputs = _.cloneDeep(defaultValidInputs);
                _objCheckInputs[arr[i]] = false;
                setObjCheckInputs(_objCheckInputs);

                if (arr[i] === "name") {
                    toast.error(`Vui lòng nhập tên màu!`);
                }
                if (arr[i] === "code") {
                    toast.error(`Vui lòng nhập mã code!`);
                }

                check = false;
                break;
            }
        }
        return check;
    }

    const handleBackendValidationErrors = (errorField, message) => {
        let _objCheckInputs = _.cloneDeep(defaultValidInputs);
        _objCheckInputs[errorField] = false;
        setObjCheckInputs(_objCheckInputs);

        if (errorField === "name" || errorField === "code") {
            toast.error(message);
        }
    }

    useEffect(() => {
        if (props.actionModalColor === "EDIT") {
            setColorData(props.dataUpdate);
        }
    }, [props.dataUpdate]);

    const handleSubmit = async () => {
        let check = isValidInputs();
        if (check) {
            setLoading(true);
            try {
                let res = props.actionModalColor === "CREATE" ?
                    await createColor(colorData.name, colorData.code, colorData.description)
                    :
                    await updateColor(colorData.id, colorData.name, colorData.code, colorData.description);
                if (res && res.EC === 0) {
                    toast.success(res.EM);
                    props.handleCloseModalColor();
                    setColorData(defaultColorData);

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

    const handleClickCloseModal = () => {
        props.handleCloseModalColor();
        setObjCheckInputs(defaultValidInputs);
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
                                    className={objCheckInputs.name ? "form-control" : "form-control is-invalid"}
                                    value={colorData.name || ""}
                                    onChange={(e) => handleOnChangeInput(e.target.value, "name")}
                                />
                            </div>

                            <div className="form-group">
                                <label>Mã màu (<span style={{color: "red"}}>*</span>):</label>
                                <input
                                    type="text"
                                    placeholder={"Nhập mã màu..."}
                                    className={objCheckInputs.code ? "form-control" : "form-control is-invalid"}
                                    value={colorData.code || ""}
                                    onChange={(e) => handleOnChangeInput(e.target.value, "code")}
                                />
                            </div>

                            <div className="form-group">
                                <label>Mô tả:</label>
                                <input
                                    type="text"
                                    placeholder={"Nhập mô tả..."}
                                    className="form-control"
                                    value={colorData.description || ""}
                                    onChange={(e) => handleOnChangeInput(e.target.value, "description")}
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