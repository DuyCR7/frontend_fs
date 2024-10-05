import React, {useEffect, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {Form} from "react-bootstrap";
import StarRating from "../components/rating/StarRating";
import {toast} from "react-toastify";
import {submitReview, updateReview} from "../../../services/customer/orderService";
import "./modalReview.scss";

const ModalReview = (props) => {

    const {dataReview, actionModalReview} = props;
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        console.log(dataReview);
        if (actionModalReview === 'VIEW' && dataReview && Object.keys(dataReview).length > 0) {
            setRating(dataReview.Reviews[0].rating || 0);
            setComment(dataReview.Reviews[0].comment || '');
            setIsEditing(false);
        } else {
            setRating(0);
            setComment('');
            setIsEditing(true);
        }
    }, [actionModalReview, dataReview]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.warn('Vui lòng chọn số sao đánh giá');
            return;
        }

        if (!comment) {
            toast.warn('Vui lòng nhập nhận xét');
            return;
        }

        setLoading(true);
        try {
            let res;
            if (actionModalReview === 'CREATE') {
                res = await submitReview(dataReview?.id, rating, comment)
            } else if (actionModalReview === 'VIEW' && isEditing) {
                res = await updateReview(dataReview.Reviews[0].id, rating, comment);
            }
            if (res && res.EC === 0) {
                toast.success(res.EM);
                handleCloseModal();
                await props.fetchMyOrders(props.currentPage, props.numRows);
            } else if (res.EC === 2){
                toast.warn(res.EM);
            } else {
                toast.error(res.EM);
            }
        } catch (e) {
            toast.error(e);
        } finally {
            setLoading(false);
        }
    }

    const handleCloseModal = () => {
        props.handleCloseModalReview();
        setRating(0);
        setComment('');
        setIsEditing(false);
    }

    const handleEditReview = () => {
        setIsEditing(true);
    }

    return (
        <Modal show={props.isShowModalReview} onHide={() => handleCloseModal()} size={"lg"} className="modal-review"
               centered>
            <Modal.Header closeButton>
                <Modal.Title>
                        <span>
                        {actionModalReview === 'CREATE' ? 'Đánh Giá' : 'Xem Đánh Giá'} Sản Phẩm: <strong
                            style={{color: "green"}}>{props?.dataReview?.name}</strong>
                    </span>
                    <br/>
                    <div>
                        {actionModalReview === "VIEW" && (<p className="fs-5 fw-light">(Bạn chỉ có thể sửa đánh giá <strong style={{color: "red"}}>1</strong> lần)</p>)}
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                    <Form.Label>Đánh giá sao</Form.Label>
                        <StarRating rating={rating} onRatingChange={setRating} readOnly={!isEditing}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Nhận xét của bạn</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Hãy chia sẻ trải nghiệm của bạn về sản phẩm..."
                            readOnly={!isEditing}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark" onClick={() => handleCloseModal()}>
                    Đóng
                </Button>
                {actionModalReview === 'VIEW' && !isEditing && dataReview && !dataReview?.Reviews[0].isUpdated && (
                    <Button variant="warning" onClick={handleEditReview}>
                        Sửa Đánh Giá
                    </Button>
                )}
                {(actionModalReview === 'CREATE' || isEditing) && (
                    <Button variant="primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Đang gửi...' : 'Gửi Đánh Giá'}
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default ModalReview;