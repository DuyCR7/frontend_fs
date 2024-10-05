import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Spin } from 'antd';
import {toast} from "react-toastify";
import {deleteTeam} from "../../../services/admin/teamService";

const AdModalDeleteTeam = (props) => {

    const [loading, setLoading] = useState(false);

    const confirmDeleteTeam = async () => {
        setLoading(true);
        try {
            let res = await deleteTeam(props.dataDelete);
            if(res && res.EC === 0) {
                toast.success(res.EM);
                props.handleCloseModalDelete();
                props.setCurrentPage(1);
                await props.fetchAllTeam(1, props.numRows);
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
                    <Modal.Body>Bạn có chắc muốn xóa đội bóng: <b>{props.dataDelete.name}</b>? (Bao gồm <b style={{color: "red"}}>tất cả</b> các sản phẩm liên quan)</Modal.Body>
                    <Modal.Footer>
                        <Button variant="dark" disabled={loading} onClick={props.handleCloseModalDelete}>
                            Đóng
                        </Button>
                        <Button variant="danger" disabled={loading} onClick={confirmDeleteTeam}>
                            Xác nhận
                        </Button>
                    </Modal.Footer>
                </Spin>
            </Modal>
        </>
    );
};

export default AdModalDeleteTeam;