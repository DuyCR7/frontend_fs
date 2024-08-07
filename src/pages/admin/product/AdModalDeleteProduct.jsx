import React, {useState} from 'react';
import {Spin} from "antd";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {deleteProduct} from "../../../services/admin/productService";
import {toast} from "react-toastify";

const AdModalDeleteProduct = (props) => {

    const [loading, setLoading] = useState(false);

    const confirmDeleteProduct = async () => {
        setLoading(true);
        try {
            let res = await deleteProduct(props.dataDelete);
            if(res && res.EC === 0) {
                props.handleCloseModalDelete();
                props.setCurrentPage(1);
                await props.fetchAllProduct(1, props.numRows);
                toast.success(res.EM);
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
                    <Modal.Body>Bạn có chắc muốn xóa sản phẩm: <b>{props.dataDelete.name}</b>?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="dark" onClick={props.handleCloseModalDelete}>
                            Đóng
                        </Button>
                        <Button variant="danger" onClick={confirmDeleteProduct}>
                            Xác nhận
                        </Button>
                    </Modal.Footer>
                </Spin>
            </Modal>
        </>
    );
};

export default AdModalDeleteProduct;