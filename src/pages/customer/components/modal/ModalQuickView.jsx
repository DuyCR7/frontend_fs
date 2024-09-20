import React, {useEffect, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import {formatCurrency} from "../../../../utils/formatCurrency";
import {FaMinus, FaPlus} from "react-icons/fa6";
import "./modalQuickView.scss";
import {IoCartOutline} from "react-icons/io5";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {addToCart} from "../../../../services/customer/cartService";
import {useDispatch, useSelector} from "react-redux";
import {updateCartCount} from "../../../../redux/customer/slices/customerSlice";

const ModalQuickView = (props) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const customer = useSelector((state) => state.customer);

    const [productData, setProductData] = useState({});

    const [selectedColorImage, setSelectedColorImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [availableQuantity, setAvailableQuantity] = useState(0);

    const [error, setError] = useState("");
    const [cartItem, setCartItem] = useState(null);

    useEffect(() => {
        if (props.dataQuickView && Object.keys(props.dataQuickView).length > 0) {
            setProductData(props.dataQuickView);
            setQuantity(1);
        } else {
            setProductData({});
            setSelectedColorImage('');
            setQuantity(1);
            setAvailableQuantity(0);
        }
    }, [props.dataQuickView]);

    useEffect(() => {
        // Chỉ gọi updateAvailableQuantity sau khi productData được cập nhật
        if (productData.details) {
            updateAvailableQuantity(null, null);
        }
    }, [productData]);

    const getUniqueSizes = (details) => {
        return details
            .map(detail => detail.size)
            .filter((value, index, self) =>
                index === self.findIndex(v => v.id === value.id)
            );
    };

    const getUniqueColors = (details) => {
        return details
            .map(detail => ({
                id: detail.color.id,
                name: detail.color.name,
                image: detail.image,
            }))
            .filter((value, index, self) =>
                index === self.findIndex(v => v.id === value.id)
            );
    };

    const handleSizeChange = (sizeId) => {
        if (selectedSize === sizeId) {
            setSelectedSize(null);
        } else {
            setSelectedSize(sizeId);
        }
        updateAvailableQuantity(sizeId, selectedColor);
        setQuantity(1);
        setError("");
    };

    const handleColorChange = (colorId) => {
        if (selectedColor === colorId) {
            setSelectedColor(null);
            setSelectedColorImage('');
        } else {
            setSelectedColor(colorId);
            setSelectedColorImage(productData.details.find(
                detail => detail.color.id === colorId
            ).image);
        }
        updateAvailableQuantity(selectedSize, colorId);
        setQuantity(1);
        setError("");
    };

    const updateAvailableQuantity = (sizeId, colorId) => {
        if (sizeId && colorId) {
            const selectedDetail = productData.details.find(
                detail => detail.size.id === sizeId && detail.color.id === colorId
            );
            setAvailableQuantity(selectedDetail ? selectedDetail.quantity : 0);
        } else if (Array.isArray(productData.details)) {
            const totalQuantity = productData.details.reduce((total, detail) => total + detail.quantity, 0);
            setAvailableQuantity(totalQuantity);
        } else {
            setAvailableQuantity(0);
        }
    };

    useEffect(() => {
        updateAvailableQuantity(selectedSize, selectedColor);
    }, [selectedSize, selectedColor]);

    const isSizeAvailable = (sizeId) => {
        return !selectedColor || productData.details.some(detail =>
            detail.size.id === sizeId && detail.color.id === selectedColor
        );
    };

    const isColorAvailable = (colorId) => {
        return !selectedSize || productData.details.some(detail =>
            detail.color.id === colorId && detail.size.id === selectedSize
        );
    };

    const handleQuantityChange = (newQuantity) => {
        if (!newQuantity) {
            setQuantity('');
        } else if (newQuantity > availableQuantity) {
            setQuantity(availableQuantity);
        } else if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };

    const handleBlur = () => {
        if (quantity === '') {
            setQuantity(1);
        }
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            handleQuantityChange(quantity - 1);
        }
    };

    const handleIncrease = () => {
        if (quantity < availableQuantity) {
            handleQuantityChange(quantity + 1);
        }
    };

    const handleClickCloseModal = () => {
        props.handleCloseModalQuickView();
        setSelectedColorImage('');
        setSelectedSize(null);
        setSelectedColor(null);
        setError('');
    }

    const {name, price, price_sale, isSale, slug, image, details = []} = productData;

    const handleAddToCart = async () => {
        if (customer && !customer.isAuthenticated) {
            navigate('/sign-in');
        } else {
            if (selectedSize && selectedColor) {
                const productDetail = productData.details.find(detail =>
                    detail.size.id === selectedSize && detail.color.id === selectedColor
                );
                const item = {
                    productId: productData.id,
                    quantity: quantity,
                };

                try {
                    let res = await addToCart(item.productId, productDetail.id, item.quantity);
                    if (res && res.EC === 0) {
                        toast.success(res.EM);
                        dispatch(updateCartCount(res.DT));
                        setError("");
                    } else {
                        setError(res.EM);
                    }
                } catch (e) {
                    toast.error(e);
                }
            } else {
                setError("Vui lòng chọn phân loại hàng!");
            }
        }
    }

    return (
        <Modal show={props.isShowModalQuickView} onHide={() => handleClickCloseModal()} size={"lg"}
               className="modal-quick-view" centered>
            <Modal.Header closeButton>
                <Modal.Title>
                        <span>
                            Xem nhanh sản phẩm
                        </span>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="content-body row">
                    <div className="col-md-6">
                        <img src={`${process.env.REACT_APP_URL_BACKEND}/${selectedColorImage || image}`}
                             className="img-fluid"/>
                    </div>

                    <div className="col-md-6">
                        <Link to={`/products/${slug}`}>
                            <h3 className="form-group">{name}</h3>
                        </Link>
                        <div className={`price-container form-group ${isSale ? 'on-sale' : ''}`}>
                            {isSale && (
                                <span className="original-price">{formatCurrency(price)}</span>
                            )}
                            <span className={isSale ? 'sale-price' : ''}>
                                {isSale ? formatCurrency(price_sale) : formatCurrency(price)}
                            </span>
                        </div>
                        <div className="form-group">
                            <label>Chọn size (<span style={{color: "red"}}>*</span>):</label>
                            <div className="sizes">
                                {getUniqueSizes(details).map(size => (
                                    <span
                                        key={size.id}
                                        className={`
                                            ${selectedSize === size.id ? 'active' : ''}
                                            ${isSizeAvailable(size.id) ? '' : 'disabled'}
                                        `}
                                        onClick={() => isSizeAvailable(size.id) && handleSizeChange(size.id)}
                                    >
                                        {size.code}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Chọn màu (<span style={{color: "red"}}>*</span>):</label>
                            <div className="colors">
                                {getUniqueColors(details).map(color => (
                                    <div
                                        key={color.id}
                                        className={`
                                            color-option
                                            ${selectedColor === color.id ? 'active' : ''}
                                            ${isColorAvailable(color.id) ? '' : 'disabled'}
                                        `}
                                        onClick={() => isColorAvailable(color.id) && handleColorChange(color.id)}
                                    >
                                        <img src={`${process.env.REACT_APP_URL_BACKEND}/${color.image}`}
                                             alt={color.name}/>
                                        <p>{color.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {availableQuantity > 0 ? (
                                <div className="form-group">
                                    <span>{availableQuantity} sản phẩm có sẵn</span>
                                </div>
                            )
                            :
                            <div className="form-group">
                                <span className="text-danger">Hết hàng</span>
                            </div>
                        }
                        <div className="form-group d-flex">
                            <div className="cart-plus-minus ms-0">
                                <div className="dec qtybutton" onClick={handleDecrease}><FaMinus/></div>
                                <input className="cart-plus-minus-box" type="text" name="qtybutton" id="qtybutton"
                                       value={quantity === '' ? '' : quantity}
                                       onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10) || '')}
                                       onBlur={handleBlur}
                                       min={1}
                                       max={availableQuantity}
                                />
                                <div className="inc qtybutton" onClick={handleIncrease}><FaPlus/></div>
                            </div>
                        </div>
                        {error && (
                            <div className="ms-3 text-danger">{error}</div>
                        )}
                        <div className="form-group">
                            <button className="btn btn-outline-primary d-flex align-items-center gap-1"
                                    onClick={() => handleAddToCart()}>
                                <IoCartOutline size={22}/>
                                <span>Thêm vào giỏ hàng</span>
                            </button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ModalQuickView;