import React from 'react';
import {Spin} from "antd";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const AdModalConfirmStatus = (props) => {
    return (
        <Modal show={props.isShowModalConfirmStatus} onHide={props.handleCloseModalConfirmStatus} centered>
            <Spin spinning={props.loading}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận cập nhật trạng thái</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        props.dataConfirmStatus.isActive ? (
                            <div>
                                Bạn có chắc muốn cập nhật trạng thái admin: <b>{props.dataConfirmStatus.email}</b> thành <b style={{color: "red"}}> không hoạt động?</b>
                            </div>
                        ) : (
                            <div>
                                Bạn có chắc muốn cập nhật trạng thái admin: <b>{props.dataConfirmStatus.email}</b> thành <b style={{color: "green"}}> hoạt động?</b>
                            </div>
                        )
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" disabled={props.loading} onClick={props.handleCloseModalConfirmStatus}>
                        Đóng
                    </Button>
                    <Button variant="danger" disabled={props.loading} onClick={props.handleConfirmToggleUserStatus}>
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Spin>
        </Modal>
    );
};

export default AdModalConfirmStatus;