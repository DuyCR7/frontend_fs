import React, {useEffect, useState} from 'react';
import {Spin} from "antd";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import _ from "lodash";
import {toast} from "react-toastify";
import {createSize, updateSize} from "../../../services/admin/sizeService";

const AdModalSize = (props) => {

    const [loading, setLoading] = useState(false);

    const defaultSizeData = {
        name: "",
        code: "",
        description: "",
    }

    const [sizeData, setSizeData] = useState(defaultSizeData);

    const defaultValidInputs = {
        name: true,
        code: true,
    }

    const [objCheckInputs, setObjCheckInputs] = useState(defaultValidInputs);

    const handleOnChangeInput = (value, name) => {
        let _sizeData = _.cloneDeep(sizeData);
        _sizeData[name] = value;
        setSizeData(_sizeData);

        if(name === "name" && !objCheckInputs.name) {
            setObjCheckInputs({...objCheckInputs, name: true});
        }
        if(name === "code" && !objCheckInputs.code) {
            setObjCheckInputs({...objCheckInputs, code: true});
        }
    }

    const isValidInputs = () => {
        setObjCheckInputs(defaultValidInputs);

        let arr = ['name', 'code'];
        let check = true;

        for (let i = 0; i < arr.length; i++) {
            if(!sizeData[arr[i]]) {
                let _objCheckInputs = _.cloneDeep(defaultValidInputs);
                _objCheckInputs[arr[i]] = false;
                setObjCheckInputs(_objCheckInputs);

                if(arr[i] === "name") {
                    toast.error(`Vui lòng nhập tên size!`);
                }
                if(arr[i] === "code") {
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
        if(props.actionModalSize === "EDIT") {
            setSizeData(props.dataUpdate);
        }
    }, [props.dataUpdate]);

    const handleSubmit = async () => {
        let check = isValidInputs();
        if(check) {
            setLoading(true);
            try {
                let res = props.actionModalSize === "CREATE" ?
                    await createSize(sizeData.name, sizeData.code, sizeData.description)
                    :
                    await updateSize(sizeData.id, sizeData.name, sizeData.code, sizeData.description);
                if(res && res.EC === 0) {
                    toast.success(res.EM);
                    props.handleCloseModalSize();
                    setSizeData(defaultSizeData);

                    if(props.actionModalSize === "CREATE") {
                        props.setCurrentPage(1);
                        props.setSortConfig({key: 'id', direction: 'DESC'});
                        await props.fetchAllSize(1, props.numRows);
                    } else {
                        await props.fetchAllSize(props.currentPage, props.numRows, props.searchKeyword, props.sortConfig);
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
        props.handleCloseModalSize();
        setObjCheckInputs(defaultValidInputs);
        setSizeData(defaultSizeData);
    }

    return (
        <Modal show={props.isShowModalSize} onHide={() => handleClickCloseModal()} size={"lg"} className="modal-size" centered>
            <Spin spinning={loading}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <span>
                            {props.actionModalSize === "CREATE" ? "Thêm size" : "Sửa size"}
                        </span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="content-body row">
                        <div className="col-12 col-sm-6 form-group">
                            <label>Tên size (<span style={{color: "red"}}>*</span>):</label>
                            <input
                                type="text"
                                placeholder={"Nhập tên size..."}
                                className={objCheckInputs.name ? "form-control" : "form-control is-invalid"}
                                value={sizeData.name || ""}
                                onChange={(e) => handleOnChangeInput(e.target.value, "name")}
                            />
                        </div>

                        <div className="col-12 col-sm-6 form-group">
                            <label>Mã size (<span style={{color: "red"}}>*</span>):</label>
                            <input
                                type="text"
                                placeholder={"Nhập mã size..."}
                                className={objCheckInputs.code ? "form-control" : "form-control is-invalid"}
                                value={sizeData.code || ""}
                                onChange={(e) => handleOnChangeInput(e.target.value, "code")}
                            />
                        </div>

                        <div className="col-12 form-group">
                            <label>Mô tả:</label>
                            <input
                                type="text"
                                placeholder={"Nhập mô tả..."}
                                className="form-control"
                                value={sizeData.description || ""}
                                onChange={(e) => handleOnChangeInput(e.target.value, "description")}
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

export default AdModalSize;