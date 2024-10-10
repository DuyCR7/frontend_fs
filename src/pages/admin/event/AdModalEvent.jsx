import React, {useEffect, useState} from 'react';
import {Spin} from "antd";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import _ from "lodash";
import {toast} from "react-toastify";
import {createEvent, updateEvent} from "../../../services/admin/eventService";

const AdModalEvent = (props) => {

    const [loading, setLoading] = useState(false);

    const defaultEventData = {
        name: "",
        description: "",
        url: "",
        eventDate: ""
    }

    const [eventData, setEventData] = useState(defaultEventData);
    const [imageDesktop, setImageDesktop] = useState("");
    const [imageMobile, setImageMobile] = useState("");
    const [previewImageDesktop, setPreviewImageDesktop] = useState("");
    const [previewImageMobile, setPreviewImageMobile] = useState("");

    const [errors, setErrors] = useState({});

    const handleOnChangeInput = (value, name) => {
        let _eventData = _.cloneDeep(eventData);
        _eventData[name] = value;
        setEventData(_eventData);

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: undefined
        }));
    }

    const handleUploadImage = (e, name) => {
        let _eventData = _.cloneDeep(eventData);

        if (e.target && e.target.files && e.target.files[0]) {
            if (name === "imageDesktop") {
                setImageDesktop(e.target.files[0]);
                setPreviewImageDesktop(URL.createObjectURL(e.target.files[0]));
                _eventData.imageDesktop = e.target.files[0];

                setErrors(prevErrors => ({
                    ...prevErrors,
                    imageDesktop: undefined,
                }));
            } else {
                setImageMobile(e.target.files[0]);
                setPreviewImageMobile(URL.createObjectURL(e.target.files[0]));
                _eventData.imageMobile = e.target.files[0];

                setErrors(prevErrors => ({
                    ...prevErrors,
                    imageMobile: undefined,
                }));
            }

            setEventData(_eventData);
        } else {
            if (name === "imageDesktop") {
                setImageDesktop("");
                setPreviewImageDesktop("");
                _eventData.imageDesktop = "";
            } else {
                setImageMobile("");
                setPreviewImageMobile("");
                _eventData.imageMobile = "";
            }

            setEventData(_eventData);
        }
    }

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        if (!eventData.name.trim()) {
            newErrors.name = "Vui lòng nhập tên sự kiện!";
            isValid = false;
        }

        if (!eventData.description.trim()) {
            newErrors.description = "Vui lòng nhập mô tả sự kiện!";
            isValid = false;
        }

        if (!eventData.url.trim()) {
            newErrors.url = "Vui lòng nhập đường dẫn sự kiện!";
            isValid = false;
        }

        if (!eventData.eventDate.trim()) {
            newErrors.eventDate = "Vui lòng chọn đúng ngày và giờ của sự kiện!";
            isValid = false;
        }  else {
            const eventDate = new Date(eventData.eventDate);
            const currentDate = new Date();

            if (eventDate < currentDate) {
                newErrors.eventDate = "Ngày giờ sự kiện phải sau thời điểm hiện tại!";
                isValid = false;
            }
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

    const handleSubmit = async () => {
        let check = validateForm();
        if(check) {
            setLoading(true);
            try {
                let res = props.actionModalEvent === "CREATE" ?
                    await createEvent(eventData.name.trim(), eventData.description, eventData.url, eventData.eventDate, imageDesktop, imageMobile)
                    :
                    await updateEvent(eventData.id, eventData.name.trim(), eventData.description, eventData.url, eventData.eventDate, imageDesktop, imageMobile);
                if(res && res.EC === 0) {
                    await props.fetchAllEvents();
                    toast.success(res.EM);
                    handleClickCloseModal();
                } else if (res && res.EC === 1) {
                    toast.warn(res.EM);
                    handleBackendValidationErrors(res.DT, res.EM);
                } else {
                    toast.error(res.EM);
                }
            } catch (e) {
                console.error(e);
                toast.error(e);
            } finally {
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        if(props.actionModalEvent === "EDIT" && props.dataUpdate && Object.keys(props.dataUpdate).length > 0) {
            let updatedEventData = {...props.dataUpdate};

            // Chuyển đổi eventDate thành định dạng 'YYYY-MM-DDTHH:MM' với giờ GMT+7
            if (updatedEventData.eventDate) {
                const date = new Date(updatedEventData.eventDate);

                // Tính giờ với GMT+7
                const offsetInMinutes = 7 * 60;
                const localDate = new Date(date.getTime() + offsetInMinutes * 60000);

                updatedEventData.eventDate = localDate.toISOString().slice(0, 16);
            }

            setEventData(updatedEventData);

            const imageDesktop = props.dataUpdate.imageDesktop ? `${process.env.REACT_APP_URL_BACKEND}/${props.dataUpdate.imageDesktop}` : "";
            const imageMobile = props.dataUpdate.imageMobile? `${process.env.REACT_APP_URL_BACKEND}/${props.dataUpdate.imageMobile}` : "";
            setPreviewImageDesktop(imageDesktop);
            setPreviewImageMobile(imageMobile);
            setImageDesktop(props.dataUpdate.imageDesktop);
            setImageMobile(props.dataUpdate.imageMobile);
        } else {
            setEventData(defaultEventData);
            setImageDesktop("");
            setImageMobile("");
            setPreviewImageDesktop("");
            setPreviewImageMobile("");
            setErrors({});
        }
    }, [props.actionModalEvent, props.dataUpdate]);

    const handleClickCloseModal = () => {
        props.handleCloseModalEvent();
        setEventData(defaultEventData);
        setErrors({});
        setImageDesktop("");
        setImageMobile("");
        setPreviewImageDesktop("");
        setPreviewImageMobile("");
    }

    const handlePressEnter = (e) => {
        if (e.key === "Enter") {
            if (!loading){
                handleSubmit();
            }
        }
    }

    return (
        <Modal show={props.isShowModalEvent} onHide={() => handleClickCloseModal()} className="modal-event
        " size={"lg"} centered>
            <Spin spinning={loading}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <span>
                            {props.actionModalEvent === "CREATE" ? "Thêm sự kiện" : "Sửa sự kiện"}
                        </span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="content-body row">
                        <div className="col-12 col-sm-6 form-group">
                            <label>Tên sự kiện (<span style={{color: "red"}}>*</span>):</label>
                            <input
                                type="text"
                                placeholder={"Nhập tên sự kiện..."}
                                className={errors.name ? "form-control is-invalid" : "form-control"}
                                value={eventData.name || ""}
                                onChange={(e) => handleOnChangeInput(e.target.value, "name")}
                                onKeyPress={(e) => handlePressEnter(e)}
                            />
                            {renderError(errors.name)}
                        </div>

                        <div className="col-12 col-sm-6 form-group">
                            <label>Mô tả (<span style={{color: "red"}}>*</span>):</label>
                            <input
                                type="text"
                                placeholder={"Nhập mô tả sự kiện..."}
                                className={errors.description ? "form-control is-invalid" : "form-control"}
                                value={eventData.description || ""}
                                onChange={(e) => handleOnChangeInput(e.target.value, "description")}
                                onKeyPress={(e) => handlePressEnter(e)}
                            />
                            {renderError(errors.description)}
                        </div>

                        <div className="col-12 col-sm-6 form-group">
                            <label>Đường dẫn (<span style={{color: "red"}}>*</span>):</label>
                            <input
                                type="text"
                                placeholder={"Nhập đường dẫn sự kiện..."}
                                className={errors.url ? "form-control is-invalid" : "form-control"}
                                value={eventData.url || ""}
                                onChange={(e) => handleOnChangeInput(e.target.value, "url")}
                                onKeyPress={(e) => handlePressEnter(e)}
                            />
                            {renderError(errors.url)}
                        </div>

                        <div className="col-12 col-sm-6 form-group">
                            <label>Ngày giờ diễn ra (<span style={{color: "red"}}>*</span>):</label>
                            <input
                                type="datetime-local"
                                className={errors.eventDate ? "form-control is-invalid" : "form-control"}
                                value={eventData.eventDate || ""}
                                onChange={(e) => handleOnChangeInput(e.target.value, "eventDate")}
                            />
                            {renderError(errors.eventDate)}
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

export default AdModalEvent;