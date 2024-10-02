import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {formatCurrency} from "../../../../utils/formatCurrency";
import RatingOnlyView from "../../components/rating/RatingOnlyView";
import {IoEyeOutline, IoHeartOutline, IoHeartSharp} from "react-icons/io5";
import ModalQuickView from "../../components/modal/ModalQuickView";
import {useSelector} from "react-redux";

const RelatedProductCard = ({product, loading, isInWishlist, handleWishlistAction}) => {
    const customer = useSelector((state) => state.customer);

    const [isShowModalQuickView, setIsShowModalQuickView] = useState(false);
    const [dataQuickView, setDataQuickView] = useState({});

    const handleCloseModalQuickView = () => {
        setIsShowModalQuickView(false);
        setDataQuickView({});
    }

    const handleShowModalQuickView = (product) => {
        setIsShowModalQuickView(true);
        setDataQuickView(product);
    }

    return (
        <>
            <div className="product-item">
                {/*product images*/}
                <div className="product-thumb">
                    <Link to={`/products/${product.slug}`}>
                        <div className="pro-thumb">
                            <div style={{padding: "20px"}}>
                                <img src={`${process.env.REACT_APP_URL_BACKEND}/${product.image}`}
                                     alt={`${process.env.REACT_APP_URL_BACKEND}/${product.image}`}/>
                            </div>
                        </div>
                    </Link>
                    <div className="product-action-link">
                        <button title="Xem nhanh"
                                onClick={() => handleShowModalQuickView(product)}>
                            <IoEyeOutline size={16}/></button>
                        <button title="Yêu thích" disabled={loading}
                                onClick={() => handleWishlistAction(product)}>
                            {
                                customer.isAuthenticated && isInWishlist(product.id)
                                    ? <IoHeartSharp size={16}/>
                                    : <IoHeartOutline size={16}/>
                            }
                        </button>
                        {/*<span title="Giỏ hàng"><IoCartOutline size={16}/></span>*/}
                    </div>
                </div>

                {/*product content*/}
                <div className="product-content d-flex flex-column gap-2">
                    <span style={{fontSize: "18px"}}>
                        <Link
                            to={`/products/${product.slug}`}>{product.name}</Link>
                    </span>
                    <div className="productRating">
                        {product.averageRating > 0 && (
                            <RatingOnlyView value={product.averageRating}/>
                        )}
                    </div>
                    <div className={`price-container ${product.isSale ? 'on-sale' : ''}`}>
                        {product.isSale && (
                            <span className="original-price">{formatCurrency(product.price)}</span>
                        )}
                        <span className={product.isSale ? 'sale-price' : ''}>
                            {product.isSale ? formatCurrency(product.price_sale) : formatCurrency(product.price)}
                        </span>
                    </div>
                    <div>

                    </div>
                </div>
            </div>

            <ModalQuickView
                isShowModalQuickView={isShowModalQuickView}
                handleCloseModalQuickView={handleCloseModalQuickView}
                dataQuickView={dataQuickView}
            />
        </>
    );
};

export default RelatedProductCard;