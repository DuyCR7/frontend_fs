import React, {useEffect, useState} from 'react';
import {Spin} from "antd";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import _ from "lodash";
import {toast} from "react-toastify";
import {createCategory, getParentCategory} from "../../../services/admin/categoryService";

const AdModalCategory = (props) => {

    const [loading, setLoading] = useState(false);

    const defaultCategoryData = {
        name: "",
        parent_id: "0",
        description: ""
    }

    const [listParentCategory, setListParentCategory] = useState([]);
    const [categoryData, setCategoryData] = useState(defaultCategoryData);
    const [image, setImage] = useState("");
    const [previewImage, setPreviewImage] = useState("");

    const defaultValidInputs = {
        name: true,
        image: true,
    }

    const [objCheckInputs, setObjCheckInputs] = useState(defaultValidInputs);

    const handleOnChangeInput = (value, name) => {
        let _categoryData = _.cloneDeep(categoryData);
        _categoryData[name] = value;
        setCategoryData(_categoryData);

        if(!objCheckInputs.name) {
            setObjCheckInputs({...objCheckInputs, name: true});
        }
    }

    const handleUpLoadImage = (e) => {
        let _categoryData = _.cloneDeep(categoryData);

        if (e.target && e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
            setPreviewImage(URL.createObjectURL(e.target.files[0]));
            _categoryData.image = e.target.files[0];
            setCategoryData(_categoryData);

            if(!objCheckInputs.image) {
                setObjCheckInputs({...objCheckInputs, image: true});
            }
        } else {
            toast.error("Vui lòng chọn hình ảnh!");
            setObjCheckInputs({...objCheckInputs, image: false});
            setImage("");

            _categoryData.image = "";
            setCategoryData(_categoryData);

            setPreviewImage("");
        }
    }

    const isValidInputs = () => {
        setObjCheckInputs(defaultValidInputs);
        if(!categoryData.name){
            setObjCheckInputs({...defaultValidInputs, name: false});
            toast.error("Vui lòng nhập tên danh mục!");
            return false;
        }

        if(!image){
            setObjCheckInputs({...defaultValidInputs, image: false});
            toast.error("Vui lòng chọn hình ảnh!");
            return false;
        }

        return true;
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
        fetchAllParentCategory();
    }, []);

    const fetchAllParentCategory = async () => {
        try {
            let res = await getParentCategory();
            if(res && res.EC === 0) {
                if(res.DT && res.DT.length > 0) {
                    setListParentCategory(res.DT);
                }
            }
        } catch (e) {
            console.log(e);
            toast.error(e);
        }
    }

    const handleClickCloseModal = () => {
        props.handleCloseModalCategory();
        setObjCheckInputs(defaultValidInputs);
        setCategoryData(defaultCategoryData);
        setPreviewImage("");
        setImage("");
    }

    const handleSubmit = async () => {
        let check = isValidInputs();
        if(check) {
            setLoading(true);
            try {
                let res = await createCategory(categoryData.name, categoryData.parent_id, categoryData.description, image);
                if(res && res.EC === 0) {
                    await fetchAllParentCategory();
                    toast.success(res.EM);
                    props.handleCloseModalCategory();
                    setCategoryData(defaultCategoryData);
                    setPreviewImage("");
                    setImage("");

                    await props.handelFetchAllCategory();
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

    return (
        <Modal show={props.isShowModalCategory} onHide={() => handleClickCloseModal()} className="modal-category
        " size={"lg"} centered>
            <Spin spinning={loading}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <span>
                            Thêm danh mục
                        </span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="content-body row">
                        <div className="col-12 col-sm-6 form-group">
                            <label>Tên danh mục (<span style={{color: "red"}}>*</span>):</label>
                            <input
                                type="text"
                                className={objCheckInputs.name ? "form-control" : "form-control is-invalid"}
                                value={categoryData.name || ""}
                                onChange={(e) => handleOnChangeInput(e.target.value, "name")}
                            />
                        </div>

                        <div className="col-12 col-sm-6 form-group">
                            <label>Loại danh mục (<span style={{color: "red"}}>*</span>):</label>
                            <select
                                className="form-select form-group"
                                value={categoryData.parent_id || ""}
                                onChange={(e) => handleOnChangeInput(e.target.value, "parent_id")}
                            >
                                <option value={0}>--- Danh mục cha ---</option>
                                {
                                    listParentCategory && listParentCategory.length > 0 &&
                                    listParentCategory.map((item, index) => {
                                        return (
                                            <option key={`parent-${index}`} value={item.id}>{item.name}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>

                        <div className="col-12 col-sm-6 form-group">
                        <label>Mô tả:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={categoryData.description || ""}
                                onChange={(e) => handleOnChangeInput(e.target.value, "description")}
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
                    Đóng
                </Button>
                <Button variant="primary" onClick={() => handleSubmit()}>
                    Lưu
                </Button>
            </Modal.Footer>
            </Spin>
        </Modal>
    );
};

export default AdModalCategory;