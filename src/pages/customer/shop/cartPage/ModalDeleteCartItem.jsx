import React, {useState} from 'react';
import {toast} from "react-toastify";
import {deleteCartItem} from "../../../../services/customer/cartService";
import {updateCartCount} from "../../../../redux/customer/slices/customerSlice";
import Modal from "react-bootstrap/Modal";
import {Spin} from "antd";
import Button from "react-bootstrap/Button";
import {useDispatch} from "react-redux";

const ModalDeleteCartItem = (props) => {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const confirmDeleteCartItem = async () => {
        setLoading(true);
        try {
            const res = await deleteCartItem(props.selectedItemForDelete.id);
            if (res && res.EC === 0) {
                props.handleCloseModalConfirm();
                await props.fetchCartItems();
                dispatch(updateCartCount(res.DT.count));
                toast.success(res.EM);
            } else {
                console.log('Error removing item:', res.EM);
            }
        } catch (e) {
            console.log('Error:', e);
        } finally {
            setLoading(false);
        }
    }
    console.log(props.selectedItemForDelete);

    return (
        <>
            <Modal show={props.isShowModalConfirm} onHide={props.handleCloseModalConfirm} centered>
                <Spin spinning={loading}>
                    <Modal.Header closeButton>
                        <Modal.Title>Xác nhận xóa</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Bạn có chắc muốn xóa sản phẩm: <b>{props.selectedItemForDelete?.Product_Detail?.Product?.name} ({props.selectedItemForDelete?.Product_Detail?.Color?.name} - {props.selectedItemForDelete?.Product_Detail?.Size?.code})</b> khỏi giỏ hàng?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="dark" disabled={loading} onClick={props.handleCloseModalConfirm}>
                            Đóng
                        </Button>
                        <Button variant="danger" disabled={loading} onClick={confirmDeleteCartItem}>
                            Xác nhận
                        </Button>
                    </Modal.Footer>
                </Spin>
            </Modal>
        </>
    );
};

export default ModalDeleteCartItem;