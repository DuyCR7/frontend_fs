import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import {Spin} from "antd";
import Button from "react-bootstrap/Button";
import {toast} from "react-toastify";
import {deleteBanner} from "../../../services/admin/bannerService";

const AdModalDeleteBanner = (props) => {

    const [loading, setLoading] = useState(false);

    const confirmDeleteBanner = async () => {
        setLoading(true);
        try {
            let res = await deleteBanner(props.dataDelete);
            if(res && res.EC === 0) {
                toast.success(res.EM);
                props.handleCloseModalDelete();
                props.setCurrentPage(1);
                await props.fetchAllBanner(1, props.numRows);
            } else {
                toast.error(res.EM);
            }
        } catch (e) {
            toast.error(e);
        } finally {
            setLoading(false);
        }
    }
    console.log(props.dataDelete);

    return (
        <>
            <Modal show={props.isShowModalDelete} onHide={props.handleCloseModalDelete} centered>
                <Spin spinning={loading}>
                    <Modal.Header closeButton>
                        <Modal.Title>Xác nhận xóa</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Bạn có chắc muốn xóa banner: <b>{props.dataDelete.name}</b>?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="dark" disabled={loading} onClick={props.handleCloseModalDelete}>
                            Đóng
                        </Button>
                        <Button variant="danger" disabled={loading} onClick={confirmDeleteBanner}>
                            Xác nhận
                        </Button>
                    </Modal.Footer>
                </Spin>
            </Modal>
        </>
    );
};

export default AdModalDeleteBanner;