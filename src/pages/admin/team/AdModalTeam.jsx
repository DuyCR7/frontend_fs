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

    const defaultValidInputs = {
        name: true,
        image: true,
    }

    const [objCheckInputs, setObjCheckInputs] = useState(defaultValidInputs);

    const handleOnChangeInput = (value, name) => {
        let _teamData = _.cloneDeep(teamData);
        _teamData[name] = value;
        setTeamData(_teamData);

        if(!objCheckInputs.name) {
            setObjCheckInputs({...objCheckInputs, name: true});
        }
    }

    const handleUpLoadImage = (e) => {
        let _teamData = _.cloneDeep(teamData);

        if (e.target && e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
            setPreviewImage(URL.createObjectURL(e.target.files[0]));
            _teamData.image = e.target.files[0];
            setTeamData(_teamData);

            if(!objCheckInputs.image) {
                setObjCheckInputs({...objCheckInputs, image: true});
            }
        } else {
            toast.error("Vui lòng chọn hình ảnh!");
            setObjCheckInputs({...objCheckInputs, image: false});
            setImage("");

            _teamData.image = "";
            setTeamData(_teamData);

            setPreviewImage("");
        }
    }

    const isValidInputs = () => {
        setObjCheckInputs(defaultValidInputs);

        let arr = ['name', 'image'];
        let check = true;

        for (let i = 0; i < arr.length; i++) {
            if(!teamData[arr[i]]) {
                let _objCheckInputs = _.cloneDeep(defaultValidInputs);
                _objCheckInputs[arr[i]] = false;
                setObjCheckInputs(_objCheckInputs);

                if(arr[i] === "name") {
                    toast.error(`Vui lòng nhập tên đội bóng!`);
                }
                if(arr[i] === "image") {
                    toast.error(`Vui lòng chọn hình ảnh!`);
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

        if (errorField === "name" || errorField === "image") {
            toast.error(message);
        }
    }

    useEffect(() => {
        if(props.actionModalTeam === "EDIT") {
            setTeamData(props.dataUpdate);

            const image = props.dataUpdate.image ? `${process.env.REACT_APP_URL_BACKEND}/${props.dataUpdate.image}` : "";
            setPreviewImage(image);
        }
    }, [props.dataUpdate]);

    const handleSubmit = async () => {
        let check = isValidInputs();
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

                    if(props.actionModalTeam === "CREATE") {
                        props.setCurrentPage(1);
                        props.setSortConfig({ key: 'id', direction: 'DESC' });
                        await props.fetchAllTeam(1, props.numRows);
                    } else {
                        props.fetchAllTeam(props.currentPage, props.numRows, props.searchKeyword, props.sortConfig);
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

    const handleClickCloseModal = () => {
        props.handleCloseModalTeam();
        setObjCheckInputs(defaultValidInputs);
        setTeamData(defaultTeamData);
        setImage("");
        setPreviewImage("");
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
                                className={objCheckInputs.name ? "form-control" : "form-control is-invalid"}
                                value={teamData.name || ""}
                                onChange={(e) => handleOnChangeInput(e.target.value, "name")}
                            />
                        </div>

                        <div className="col-12 col-sm-6 form-group">
                            <label>Chọn ảnh (<span style={{color: "red"}}>*</span>):</label>
                            <input type="file"
                                   className={objCheckInputs.image ? "form-control" : "form-control is-invalid"}
                                   onChange={(e) => handleUpLoadImage(e)}/>
                        </div>
                        {previewImage === "" || previewImage === null ? ""
                            :
                            <div className="col-12 col-sm-12 form-group mt-3 text-center">
                                <img src={previewImage} width={150} height={150}/>
                            </div>
                        }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={() => handleClickCloseModal()}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleSubmit()}>
                        Save
                    </Button>
                </Modal.Footer>
            </Spin>
        </Modal>
    );
};

export default AdModalTeam;