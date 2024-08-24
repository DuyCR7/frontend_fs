import React, {useState} from 'react';
import {toast} from "react-toastify";
import Modal from "react-bootstrap/Modal";
import {Spin} from "antd";
import Button from "react-bootstrap/Button";
import {deletePost} from "../../../services/admin/postService";

const AdModalDeletePost = (props) => {
    const [loading, setLoading] = useState(false);

    const confirmDeletePost = async () => {
        setLoading(true);
        try {
            let res = await deletePost(props.dataDelete);
            if(res && res.EC === 0) {
                toast.success(res.EM);
                props.handleCloseModalDelete();
                props.setCurrentPage(1);
                await props.fetchAllPost(1, props.numRows);
            } else {
                toast.error(res.EM);
            }
        } catch (e) {
            toast.error(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Modal show={props.isShowModalDelete} onHide={props.handleCloseModalDelete} centered>
                <Spin spinning={loading}>
                    <Modal.Header closeButton>
                        <Modal.Title>Xác nhận xóa</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Bạn có chắc muốn xóa bài viết: <b>{props.dataDelete.title}</b>?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="dark" disabled={loading} onClick={props.handleCloseModalDelete}>
                            Đóng
                        </Button>
                        <Button variant="danger" disabled={loading} onClick={confirmDeletePost}>
                            Xác nhận
                        </Button>
                    </Modal.Footer>
                </Spin>
            </Modal>
        </>
    );
};

export default AdModalDeletePost;