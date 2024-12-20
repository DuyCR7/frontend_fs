import React, {useEffect, useState} from 'react';
import {Spin} from "antd";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import _ from "lodash";
import {createBanner, updateBanner} from "../../../services/admin/bannerService";
import {toast} from "react-toastify";

const AdModalBanner = (props) => {

    const [loading, setLoading] = useState(false);

    const defaultBannerData = {
        name: "",
        image: "",
        url: "",
    }

    const [bannerData, setBannerData] = useState(defaultBannerData);
    const [imageDesktop, setImageDesktop] = useState("");
    const [imageMobile, setImageMobile] = useState("");
    const [previewImageDesktop, setPreviewImageDesktop] = useState("");
    const [previewImageMobile, setPreviewImageMobile] = useState("");

    const [errors, setErrors] = useState({});

    const handleOnChangeInput = (value, name) => {
        let _bannerData = _.cloneDeep(bannerData);
        _bannerData[name] = value;
        setBannerData(_bannerData);

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: undefined
        }));
    }

    const handleUploadImage = (e, name) => {
        let _bannerData = _.cloneDeep(bannerData);

        if (e.target && e.target.files && e.target.files[0]) {
            if (name === "imageDesktop") {
                setImageDesktop(e.target.files[0]);
                setPreviewImageDesktop(URL.createObjectURL(e.target.files[0]));
                _bannerData.imageDesktop = e.target.files[0];

                setErrors(prevErrors => ({
                    ...prevErrors,
                    imageDesktop: undefined,
                }));
            } else {
                setImageMobile(e.target.files[0]);
                setPreviewImageMobile(URL.createObjectURL(e.target.files[0]));
                _bannerData.imageMobile = e.target.files[0];

                setErrors(prevErrors => ({
                    ...prevErrors,
                    imageMobile: undefined,
                }));
            }

            setBannerData(_bannerData);
        } else {
            if (name === "imageDesktop") {
                setImageDesktop("");
                setPreviewImageDesktop("");
                _bannerData.imageDesktop = "";
            } else {
                setImageMobile("");
                setPreviewImageMobile("");
                _bannerData.imageMobile = "";
            }

            setBannerData(_bannerData);
        }
    }

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        if(!bannerData.name.trim()) {
            newErrors.name = "Vui lòng nhập tên banner!";
            isValid = false;
        }

        if(!bannerData.url.trim()) {
            newErrors.url = "Vui lòng nhập đường dẫn!";
            isValid = false;
        }

        if (!imageDesktop) {
            newErrors.imageDesktop = "Vui lòng chọn hình ảnh desktop!";
            isValid = false;
        }

        if (!imageMobile) {
            newErrors.imageMobile = "Vui lòng chọn hình ảnh mobile!";
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
        if(props.actionModalBanner === "EDIT" && props.dataUpdate && Object.keys(props.dataUpdate).length > 0) {
            setBannerData(props.dataUpdate);

            const imageDesktop = props.dataUpdate.imageDesktop ? `${process.env.REACT_APP_URL_BACKEND}/${props.dataUpdate.imageDesktop}` : "";
            const imageMobile = props.dataUpdate.imageMobile? `${process.env.REACT_APP_URL_BACKEND}/${props.dataUpdate.imageMobile}` : "";
            setPreviewImageDesktop(imageDesktop);
            setPreviewImageMobile(imageMobile);
            setImageDesktop(props.dataUpdate.imageDesktop);
            setImageMobile(props.dataUpdate.imageMobile);
        } else {
            setBannerData(defaultBannerData);
            setImageDesktop("");
            setImageMobile("");
            setPreviewImageDesktop("");
            setPreviewImageMobile("");
            setErrors({});
        }
    }, [props.actionModalBanner, props.dataUpdate]);

    const handleClickCloseModal = () => {
        props.handleCloseModalBanner();
        setBannerData(defaultBannerData);
        setImageDesktop("");
        setImageMobile("");
        setPreviewImageDesktop("");
        setPreviewImageMobile("");
        setErrors({});
    }

    const handleSubmit = async () => {
        let check = validateForm();
        if(check) {
            setLoading(true);
            try {
                let res = props.actionModalBanner === "CREATE" ?
                    await createBanner(bannerData.name.trim(), imageDesktop, imageMobile, bannerData.url)
                    :
                    await updateBanner(bannerData.id, bannerData.name.trim(), imageDesktop, imageMobile, bannerData.url);
                if(res && res.EC === 0) {
                    toast.success(res.EM);
                    handleClickCloseModal();

                    if(props.actionModalBanner === "CREATE") {
                        props.setCurrentPage(1);
                        props.setSortConfig({key: 'id', direction: 'DESC'});
                    } else {
                        await props.fetchAllBanner(props.currentPage, props.numRows, props.searchKeyword, props.sortConfig);
                    }
                } else if (res && res.EC === 1) {
                    toast.warn(res.EM);
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

    return (
        <Modal show={props.isShowModalBanner} onHide={() => handleClickCloseModal()} size={"lg"} className="modal-banner" centered>
            <Spin spinning={loading}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <span>
                            {props.actionModalBanner === "CREATE" ? "Thêm banner" : "Sửa banner"}
                        </span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="content-body row">
                        <div className="col-12 col-sm-6 form-group">
                            <label>Tên banner (<span style={{color: "red"}}>*</span>):</label>
                            <input
                                type="text"
                                placeholder={"Nhập tên banner..."}
                                className={errors.name ? "form-control is-invalid" : "form-control"}
                                value={bannerData.name || ""}
                                onChange={(e) => handleOnChangeInput(e.target.value, "name")}
                                onKeyPress={(e) => handlePressEnter(e)}
                            />
                            {renderError(errors.name)}
                        </div>

                        <div className="col-12 col-sm-6 form-group">
                            <label>Đường dẫn (<span style={{color: "red"}}>*</span>):</label>
                            <input
                                type="text"
                                placeholder={"Nhập đường dẫn..."}
                                className={errors.url ? "form-control is-invalid" : "form-control"}
                                value={bannerData.url || ""}
                                onChange={(e) => handleOnChangeInput(e.target.value, "url")}
                                onKeyPress={(e) => handlePressEnter(e)}
                            />
                            {renderError(errors.url)}
                        </div>

                        <div className="col-12 col-sm-6 form-group">
                            <label>Chọn ảnh desktop (<span style={{color: "red"}}>*</span>):</label>
                            <input type="file"
                                   accept="image/*"
                                   className={errors.imageDesktop ? "form-control is-invalid" : "form-control"}
                                   onChange={(e) => handleUploadImage(e, "imageDesktop")}/>
                            {renderError(errors.imageDesktop)}
                        </div>

                        <div className="col-12 col-sm-6 form-group">
                            <label>Chọn ảnh mobile (<span style={{color: "red"}}>*</span>):</label>
                            <input type="file"
                                   accept="image/*"
                                   className={errors.imageMobile ? "form-control is-invalid" : "form-control"}
                                   onChange={(e) => handleUploadImage(e, "imageMobile")}/>
                            {renderError(errors.imageMobile)}
                        </div>

                        <div className="col-12 col-sm-6 form-group mt-3 text-center">
                            {previewImageDesktop === "" || previewImageDesktop === null ? ""
                                :
                                <img src={previewImageDesktop} width={150} height={150} className="img-thumbnail"/>
                            }
                        </div>


                        <div className="col-12 col-sm-6 form-group mt-3 text-center">
                            {previewImageMobile === "" || previewImageMobile === null ? ""
                                :
                                <img src={previewImageMobile} width={150} height={150} className="img-thumbnail"/>
                            }
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

export default AdModalBanner;