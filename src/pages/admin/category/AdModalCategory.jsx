import React, {useEffect, useState} from 'react';
import {Spin} from "antd";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import _ from "lodash";
import {toast} from "react-toastify";
import {createCategory, updateCategory} from "../../../services/admin/categoryService";

const AdModalCategory = (props) => {

    const [loading, setLoading] = useState(false);

    const defaultCategoryData = {
        name: "",
        parent_id: "0",
        description: ""
    }

    const [categoryData, setCategoryData] = useState(defaultCategoryData);
    const [image, setImage] = useState("");
    const [previewImage, setPreviewImage] = useState("");

    const [errors, setErrors] = useState({});

    const handleOnChangeInput = (value, name) => {
        let _categoryData = _.cloneDeep(categoryData);
        _categoryData[name] = value;
        setCategoryData(_categoryData);

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: undefined
        }));
    }

    const handleUpLoadImage = (e) => {
        let _categoryData = _.cloneDeep(categoryData);

        if (e.target && e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
            setPreviewImage(URL.createObjectURL(e.target.files[0]));
            _categoryData.image = e.target.files[0];
            setCategoryData(_categoryData);

            setErrors(prevErrors => ({
               ...prevErrors,
                image: undefined
            }));
        } else {
            setImage("");

            _categoryData.image = "";
            setCategoryData(_categoryData);

            setPreviewImage("");
        }
    }

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        if(!categoryData.name.trim()) {
            newErrors.name = "Vui lòng nhập tên danh mục!";
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
        props.fetchAllParentCategory();
    }, []);

    useEffect(() => {
        if(props.actionModalCategory === "EDIT" && props.dataUpdate && Object.keys(props.dataUpdate).length > 0) {
            setCategoryData(props.dataUpdate);

            const image = props.dataUpdate.image? `${process.env.REACT_APP_URL_BACKEND}/${props.dataUpdate.image}` : "";
            setPreviewImage(image);
            setImage(props.dataUpdate.image);
        } else {
            setCategoryData(defaultCategoryData);
            setPreviewImage("");
            setImage("");
            setErrors({});
        }
    }, [props.actionModalCategory, props.dataUpdate])

    const handleClickCloseModal = () => {
        props.handleCloseModalCategory();
        setCategoryData(defaultCategoryData);
        setPreviewImage("");
        setImage("");
        setErrors({});
    }

    const handleSubmit = async () => {
        let check = validateForm();
        if(check) {
            setLoading(true);
            try {
                let res = props.actionModalCategory === "CREATE" ?
                    await createCategory(categoryData.name.trim(), categoryData.parent_id, categoryData.description, image)
                    :
                    await updateCategory(categoryData.id, categoryData.name.trim(), categoryData.parent_id, categoryData.description, image);
                if(res && res.EC === 0) {
                    await props.fetchAllParentCategory();
                    toast.success(res.EM);
                    handleClickCloseModal();

                    await props.handelFetchAllCategory();
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

    const renderCategoryOptions = (categories, level = 0) => {
        return categories.map(category => (
            <React.Fragment key={category.id}>
                <option value={category.id}>
                    {Array(level).fill().map((_, i) => (
                        '--'
                    ))}
                    {category.name}
                </option>
                {category.children && category.children.length > 0 && renderCategoryOptions(category.children, level + 1)}
            </React.Fragment>
        ));
    };

    return (
        <Modal show={props.isShowModalCategory} onHide={() => handleClickCloseModal()} className="modal-category
        " size={"lg"} centered>
            <Spin spinning={loading}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <span>
                            {props.actionModalCategory === "CREATE" ? "Thêm danh mục" : "Sửa danh mục"}
                        </span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="content-body row">
                        <div className="col-12 col-sm-6 form-group">
                            <label>Tên danh mục (<span style={{color: "red"}}>*</span>):</label>
                            <input
                                type="text"
                                placeholder={"Nhập tên danh mục..."}
                                className={errors.name ? "form-control is-invalid" : "form-control"}
                                value={categoryData.name || ""}
                                onChange={(e) => handleOnChangeInput(e.target.value, "name")}
                                onKeyPress={(e) => handlePressEnter(e)}
                            />
                            {renderError(errors.name)}
                        </div>

                        <div className="col-12 col-sm-6 form-group">
                            <label>Chọn danh mục cha (<span style={{color: "red"}}>*</span>):</label>
                            <select
                                className="form-select form-group"
                                value={categoryData.parent_id || ""}
                                onChange={(e) => handleOnChangeInput(e.target.value, "parent_id")}
                            >
                                <option value={0}>--- Là danh mục gốc ---</option>
                                {renderCategoryOptions(props.listParentCategory)}
                            </select>
                        </div>

                        <div className="col-12 col-sm-6 form-group">
                        <label>Mô tả:</label>
                            <input
                                type="text"
                                placeholder={"Nhập mô tả..."}
                                className="form-control"
                                value={categoryData.description || ""}
                                onChange={(e) => handleOnChangeInput(e.target.value, "description")}
                                onKeyPress={(e) => handlePressEnter(e)}
                            />
                        </div>

                        <div className="col-12 col-sm-6 form-group">
                            <label>Chọn ảnh (<span style={{color: "red"}}>*</span>):</label>
                            <input type="file"
                                   accept="image/*"
                                   className={errors.image ? "form-control is-invalid" : "form-control"}
                                   onChange={(e) => handleUpLoadImage(e)}/>
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

export default AdModalCategory;