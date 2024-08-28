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

    const confirmDeleteCartItems = async () => {
        setLoading(true);
        try {
            const itemsToDelete = Array.isArray(props.selectedItemForDelete)
                ? props.selectedItemForDelete
                : [props.selectedItemForDelete];

            for (const item of itemsToDelete) {
                const res = await deleteCartItem(item.id);
                if (res && res.EC === 0) {
                    dispatch(updateCartCount(res.DT.count));
                } else {
                    console.log('Error removing item:', res.EM);
                }
            }

            props.handleCloseModalConfirm();
            props.setSelectedIds([]);
            await props.fetchCartItems();
            await props.fetchRelatedProducts();
            toast.success("Đã xóa sản phẩm khỏi giỏ hàng thành công");
        } catch (e) {
            console.log('Error:', e);
            toast.error("Có lỗi xảy ra khi xóa sản phẩm");
        } finally {
            setLoading(false);
        }
    }

    const renderModalBody = () => {
        if (props.isMultipleDelete) {
            return (
                <span>
                    Bạn có chắc muốn xóa <strong>{props.selectedItemForDelete.length}</strong> sản phẩm đã chọn khỏi giỏ hàng?
                </span>
            );
        } else {
            const item = props.selectedItemForDelete;
            return (
                <span>
                    Bạn có chắc muốn xóa sản phẩm: <strong>{item?.Product_Detail?.Product?.name}</strong> (<strong>{item?.Product_Detail?.Color?.name}</strong> - <strong>{item?.Product_Detail?.Size?.code}</strong>) khỏi giỏ hàng?
                </span>
            );
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
                    <Modal.Body>{renderModalBody()}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="dark" disabled={loading} onClick={props.handleCloseModalConfirm}>
                            Đóng
                        </Button>
                        <Button variant="danger" disabled={loading} onClick={confirmDeleteCartItems}>
                            Xác nhận
                        </Button>
                    </Modal.Footer>
                </Spin>
            </Modal>
        </>
    );
};

export default ModalDeleteCartItem;