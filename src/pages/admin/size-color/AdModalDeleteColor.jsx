import React, {useState} from 'react';
import {toast} from "react-toastify";
import {Spin} from "antd";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {deleteColor} from "../../../services/admin/colorService";

const AdModalDeleteColor = (props) => {

    const [loading, setLoading] = useState(false);

    const confirmDeleteColor = async () => {
        setLoading(true);
        try {
            let res = await deleteColor(props.dataDelete);
            if(res && res.EC === 0) {
                toast.success(res.EM);
                props.handleCloseModalDelete();
                props.setCurrentPage(1);
                await props.fetchAllColor(1, props.numRows);
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
                    <Modal.Body>Bạn có chắc muốn xóa màu: <b>{props.dataDelete.name} ({props.dataDelete.code})</b>?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="dark" onClick={props.handleCloseModalDelete}>
                            Đóng
                        </Button>
                        <Button variant="danger" onClick={confirmDeleteColor}>
                            Xác nhận
                        </Button>
                    </Modal.Footer>
                </Spin>
            </Modal>
        </>
    );
};

export default AdModalDeleteColor;