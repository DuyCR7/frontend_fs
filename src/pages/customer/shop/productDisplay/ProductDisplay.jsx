import React, {useEffect, useState} from 'react';
import "./productDisplay.scss";
import {formatCurrency} from "../../../../utils/formatCurrency";
import {FaMinus, FaPlus} from "react-icons/fa6";
import {IoCartOutline, IoHeartOutline, IoHeartSharp} from "react-icons/io5";
import { PiMoney } from "react-icons/pi";
import {addToCart} from "../../../../services/customer/cartService";
import {toast} from "react-toastify";
import {updateCartCount} from "../../../../redux/customer/slices/customerSlice";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {IoIosChatboxes} from "react-icons/io";
import {openChatBox} from "../../../../redux/customer/slices/chatSlice";
import RatingOnlyView from "../../components/rating/RatingOnlyView";
import {useWishlist} from "../../components/wishList/useWishlist";

const ProductDisplay = ({productData, setActiveImage}) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const customer = useSelector((state) => state.customer);

    const {name, averageRating, price, price_sale, isSale, team, category, description, details = []} = productData;

    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [availableQuantity, setAvailableQuantity] = useState(0);

    const [error, setError] = useState("");
    const [cartItem, setCartItem] = useState(null);

    const [loadingDisplay, setLoadingDisplay] = useState(false);

    const { loading, wishList, isInWishlist, handleWishlistAction } = useWishlist();

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
        } else {
            setSelectedColor(colorId);
            setActiveImage(productData.details.find(
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

                setLoadingDisplay(true);
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
                } finally {
                    setLoadingDisplay(false);
                }
            } else {
                setError("Vui lòng chọn phân loại hàng!");
            }
        }
    }

    const handleChatNow = () => {
        dispatch(openChatBox(productData));
    };
console.log(productData);
    return (
        <div className="product-display d-flex flex-column gap-3">
            <div>
                <div className="d-flex align-items-center justify-content-between">
                    <h3 className="">{name}</h3>
                    <button type="button" className="btn-wishlist"title='Yêu thích'
                            disabled={loading}
                            onClick={() => handleWishlistAction(productData)}>
                        <i className="heart-icon">
                            {
                                customer.isAuthenticated && isInWishlist(productData.id)
                                    ? <IoHeartSharp size={28}/>
                                    : <IoHeartOutline size={28}/>
                            }
                        </i>
                    </button>
                </div>
                <div className="mt-2 rating d-flex justify-content-start">
                    {averageRating > 0 && (
                        <RatingOnlyView value={averageRating} />
                    )}
                </div>
                <div className={`mt-2 price-container ${isSale ? 'on-sale' : ''}`}>
                    {isSale && (
                        <span className="original-price">{formatCurrency(price)}</span>
                    )}
                    <span className={isSale ? 'sale-price' : ''}>
                        {isSale ? formatCurrency(price_sale) : formatCurrency(price)}
                    </span>
                </div>
                <div className="mt-2 d-flex align-items-center gap-1">
                    <label className="fs-6 fw-extrabold">Đội bóng:</label>
                    <span className="fs-6">{team}</span>
                </div>
                <div className="mt-2 d-flex align-items-center gap-1">
                    <label className="fs-6 fw-extrabold">Danh mục:</label>
                    <span className="fs-6">{category}</span>
                </div>

            </div>

            <hr className="m-0"/>

            {/*cart components*/}
            <div className="">
                <label className="fs-6 fw-extrabold">Chọn size (<span style={{color: "red"}}>*</span>):</label>
                <div className="sizes mt-2">
                    {getUniqueSizes(details).map(size => (
                        <span
                            key={size.id}
                            className={`${selectedSize === size.id ? 'active' : ''}
                                            ${isSizeAvailable(size.id) ? '' : 'disabled'}`}
                            onClick={() => isSizeAvailable(size.id) && handleSizeChange(size.id)}
                        >
                                {size.code}
                            </span>
                    ))}
                </div>
            </div>
            <div className="">
                <label className="fs-6 fw-extrabold">Chọn màu (<span style={{color: "red"}}>*</span>):</label>
                <div className="colors mt-2">
                    {getUniqueColors(details).map(color => (
                        <div
                            key={color.id}
                            className={`color-option
                                            ${selectedColor === color.id ? 'active' : ''}
                                            ${isColorAvailable(color.id) ? '' : 'disabled'}`}
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
                <span className="fs-6 fw-mediumbold">{availableQuantity} sản phẩm có sẵn</span>
            )
            :
                <span className="fs-6 fw-mediumbold text-danger">Hết hàng</span>
            }

            <div className="d-flex">
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
                <div className="text-danger">{error}</div>
            )}
            <div className="d-flex flex-wrap gap-3">
                <button className="btn btn-outline-dark d-flex align-items-center gap-1"
                        onClick={() => handleChatNow()}>
                    <IoIosChatboxes size={22}/>
                    <span>Chat ngay</span>
                </button>
                <button className="btn btn-outline-primary d-flex align-items-center gap-1"
                        disabled={loadingDisplay}
                        onClick={() => handleAddToCart()}>
                    <IoCartOutline size={22}/>
                    <span>Giỏ hàng</span>
                </button>
            </div>
        </div>
    );
};

export default ProductDisplay;