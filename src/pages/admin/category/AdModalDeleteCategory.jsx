import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import {Spin} from "antd";
import Button from "react-bootstrap/Button";
import {toast} from "react-toastify";
import {deleteCategory} from "../../../services/admin/categoryService";

const AdModalDeleteCategory = (props) => {

    const [loading, setLoading] = useState(false);

    const confirmDeleteCategory = async () => {
        setLoading(true);
        try {
            let res = await deleteCategory(props.dataDelete);
            if(res && res.EC === 0) {
                toast.success(res.EM);
                props.handleCloseModalDelete();
                await props.handelFetchAllCategory();
                await props.fetchAllParentCategory();

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
                    <Modal.Body>
                        Bạn có chắc muốn xóa danh mục: <b>{props.dataDelete.name}</b> và <b style={{color: "red"}}>tất
                        cả</b> các danh mục con của nó?
                        (Bao gồm <b style={{color: "red"}}>tất cả</b> các sản phẩm liên quan)
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="dark" onClick={props.handleCloseModalDelete}>
                            Đóng
                        </Button>
                        <Button variant="danger" onClick={confirmDeleteCategory}>
                            Xác nhận
                        </Button>
                    </Modal.Footer>
                </Spin>
            </Modal>
        </>
    );
};

export default AdModalDeleteCategory;