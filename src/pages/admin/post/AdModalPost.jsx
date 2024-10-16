import React, {useEffect, useState} from 'react';
import _ from "lodash";
import {Spin} from "antd";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {createPost, updatePost} from "../../../services/admin/postService";
import {useSelector} from "react-redux";
import {toast} from "react-toastify";

const AdModalPost = (props) => {

    const user = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);

    const defaultPostData = {
        title: "",
        image: "",
        content: "",
    }

    const [postData, setPostData] = useState(defaultPostData);
    const [image, setImage] = useState("");
    const [previewImage, setPreviewImage] = useState("");

    const [errors, setErrors] = useState({});

    const handleOnChangeInput = (value, name) => {
        let _postData = _.cloneDeep(postData);
        _postData[name] = value;
        setPostData(_postData);

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: undefined
        }));
    }

    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const onEditorStateChange = (newEditorState) => {
        setEditorState(newEditorState);
        const htmlContent = draftToHtml(convertToRaw(newEditorState.getCurrentContent()));
        handleOnChangeInput(htmlContent, "content");
    };
    const handlePastedText = (text, html, editorState) => {
        // Tùy chỉnh cách xử lý văn bản dán vào
        // Trả về false để sử dụng xử lý mặc định, hoặc true nếu bạn xử lý nó tùy chỉnh
        return false;
    };

    const handleUpLoadImage = (e) => {
        let _postData = _.cloneDeep(postData);

        if (e.target && e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
            setPreviewImage(URL.createObjectURL(e.target.files[0]));
            _postData.image = e.target.files[0];
            setPostData(_postData);

            setErrors(prevErrors => ({
                ...prevErrors,
                image: undefined
            }));
        } else {
            setImage("");

            _postData.image = "";
            setPostData(_postData);

            setPreviewImage("");
        }
    }

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        if(!postData.title.trim()) {
            newErrors.title = "Vui lòng nhập tiêu đề bài viết!";
            isValid = false;
        }

        if(!image) {
            newErrors.image = "Vui lòng chọn hình ảnh!";
            isValid = false;
        }

        if(!postData.content) {
            newErrors.content = "Vui lòng nhập nội dung bài viết!";
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

    const handleClickCloseModal = () => {
        props.handleCloseModalPost();
        setPostData(defaultPostData);
        setImage("");
        setPreviewImage("");
        setErrors({});
    }

    useEffect(() => {
        if(props.actionModalPost === "EDIT" && props.dataUpdate && Object.keys(props.dataUpdate).length > 0) {
            const contentBlock = htmlToDraft(props.dataUpdate.content);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                setEditorState(editorState);
            }
            setPostData(props.dataUpdate);

            const image = props.dataUpdate.image? `${process.env.REACT_APP_URL_BACKEND}/${props.dataUpdate.image}` : "";
            setPreviewImage(image);
            setImage(props.dataUpdate.image);
        } else {
            setPostData(defaultPostData);
            setPreviewImage("");
            setImage("");
            setErrors({});
            setEditorState(EditorState.createEmpty());
        }
    }, [props.actionModalPost, props.dataUpdate]);

    const handleSubmit = async () => {
        let check = validateForm();
        if(check) {
            setLoading(true);
            try {
                let res = props.actionModalPost === "CREATE" ?
                    await createPost(postData.title.trim(), image, postData.content, user?.id)
                    :
                    await updatePost(postData.id, postData.title.trim(), image, postData.content, user?.id);
                if(res && res.EC === 0) {
                    toast.success(res.EM);
                    handleClickCloseModal();

                    if(props.actionModalPost === "CREATE") {
                        props.setCurrentPage(1);
                        props.setSortConfig({ key: 'id', direction: 'DESC' });
                    } else {
                        await props.fetchAllPost(props.currentPage, props.numRows, props.searchKeyword, props.sortConfig);
                    }
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

    return (
        <Modal show={props.isShowModalPost} onHide={() => handleClickCloseModal()} size={"lg"} className="modal-post" centered>
            <Spin spinning={loading}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <span>
                            {props.actionModalPost === "CREATE" ? "Thêm bài viết" : "Sửa bài viết"}
                        </span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="content-post content-body row">
                        <div className="col-12 col-sm-6 form-group">
                            <label>Tiêu đề (<span style={{color: "red"}}>*</span>):</label>
                            <input
                                type="text"
                                placeholder={"Nhập tiêu đề..."}
                                className={errors.title ? "form-control is-invalid" : "form-control"}
                                value={postData.title || ""}
                                onChange={(e) => handleOnChangeInput(e.target.value, "title")}
                            />
                            {renderError(errors.title)}
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
                            <div className="col-12 form-group mt-3 text-center">
                                <img src={previewImage} width={150} height={150} className="img-thumbnail"/>
                            </div>
                        }

                        <div className="col-12 form-group">
                            <label>Nội dung:</label>
                            <div className={errors.content ? "form-control is-invalid" : "form-control"}>
                                <Editor
                                    editorState={editorState}
                                    toolbarClassName="toolbarClassName"
                                    wrapperClassName="wrapperClassName"
                                    editorClassName="editorClassName"
                                    onEditorStateChange={onEditorStateChange}
                                    handlePastedText={handlePastedText}
                                />
                                {renderError(errors.content)}
                            </div>
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

export default AdModalPost;