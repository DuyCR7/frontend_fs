import React, { useState} from 'react';
import {Link} from "react-router-dom";
import {formatCurrency} from "../../../../utils/formatCurrency";
import "./productCards.scss";
import {IoEyeOutline, IoHeartOutline, IoHeartSharp} from "react-icons/io5";
import ModalQuickView from "../../components/modal/ModalQuickView";
import {useSelector} from "react-redux";
import {useWishlist} from "../../components/wishList/useWishlist";
import RatingOnlyView from "../../components/rating/RatingOnlyView";

const ProductCards = ({GridList, products}) => {

    const customer = useSelector((state) => state.customer);

    const { loading, wishList, isInWishlist, handleWishlistAction } = useWishlist();

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
            <div className={`product-cards shop-product-wrap row justify-content-center ${GridList ? "grid" : "list"}`}>
                {
                    products.map((item, index) => {

                        return (
                            <div key={item.id} className={`product-wrapper ${GridList ? "col-6 col-sm-6 col-md-4 col-lg-3" : "col-12"}`}>
                                <div className="product-item h-100">
                                    {/*product images*/}
                                    <div className="product-thumb">
                                        <Link to={`/products/${item.slug}`}>
                                            <div className="pro-thumb">
                                                <img
                                                    src={`${process.env.REACT_APP_URL_BACKEND}/${item.image}`}
                                                    alt={`${process.env.REACT_APP_URL_BACKEND}/${item.image}`}/>
                                            </div>
                                        </Link>

                                        {/*product action links*/}
                                        <div className="product-action-link">
                                            <button title='Xem nhanh'
                                                  onClick={() => handleShowModalQuickView(item)}>
                                                <IoEyeOutline size={16} style={{cursor: "pointer"}}/>
                                            </button>
                                            <button title='Yêu thích' disabled={loading} onClick={() => handleWishlistAction(item)}>
                                                {
                                                    customer.isAuthenticated && isInWishlist(item.id)
                                                        ? <IoHeartSharp size={16}/>
                                                        : <IoHeartOutline size={16}/>
                                                }
                                            </button>
                                        {/*    <span title='Giỏ hàng'>*/}
                                        {/*    <IoCartOutline size={16} style={{cursor: "pointer"}}/>*/}
                                        {/*</span>*/}
                                        </div>
                                    </div>

                                    {/*product content*/}
                                    <div style={{ marginBottom: "-25px" }} className="product-content d-flex flex-column gap-2">
                                    <span style={{fontSize: "18px"}}>
                                        <Link to={`/products/${item.slug}`}>{item.name}</Link>
                                    </span>
                                        <div className="productRating">
                                            {/*<Rating/>*/}
                                            {item.averageRating > 0 && (
                                                <RatingOnlyView value={item.averageRating} />
                                            )}
                                        </div>
                                        <div className={`price-container ${item.isSale ? 'on-sale' : ''}`}>
                                            {item.isSale && (
                                                <span className="original-price">{formatCurrency(item.price)}</span>
                                            )}
                                            <span className={item.isSale ? 'sale-price' : ''}>
                                            {item.isSale ? formatCurrency(item.price_sale) : formatCurrency(item.price)}
                                        </span>
                                        </div>
                                    </div>
                                </div>

                                {/*list style*/}
                                <div className="product-list-item">
                                    {/*product images*/}
                                    <div className="product-thumb">
                                        <Link to={`/products/${item.slug}`}>
                                            <div className="pro-thumb">
                                                <img
                                                    src={`${process.env.REACT_APP_URL_BACKEND}/${item.image}`}
                                                    alt={`${process.env.REACT_APP_URL_BACKEND}/${item.image}`}/>
                                            </div>
                                        </Link>

                                        {/*product action links*/}
                                        <div className="product-action-link">
                                            <button title='Xem nhanh'
                                                  onClick={() => handleShowModalQuickView(item)}>
                                                <IoEyeOutline size={16} style={{cursor: "pointer"}}/>
                                            </button>
                                            <button title='Yêu thích' disabled={loading} onClick={() => handleWishlistAction(item)}>
                                                {
                                                    customer.isAuthenticated && isInWishlist(item.id)
                                                        ? <IoHeartSharp size={16}/>
                                                        : <IoHeartOutline size={16}/>
                                                }
                                            </button>
                                            {/*<span title='Giỏ hàng'>*/}
                                            {/*    <IoCartOutline size={16} style={{cursor: "pointer"}}/>*/}
                                            {/*</span>*/}
                                        </div>
                                    </div>

                                    {/*product content*/}
                                    <div className="product-content d-flex flex-column gap-2">
                                    <span style={{fontSize: "18px", display: "flex", alignItems: "center", justifyContent: 'center'}}>
                                        <Link to={`/products/${item.slug}`}>{item.name}</Link>
                                    </span>
                                        <div className="productRating" style={{display: "flex", alignItems: "center", justifyContent: 'center'}}>
                                            {/*<Rating/>*/}
                                            {item.averageRating > 0 && (
                                                <RatingOnlyView value={item.averageRating} />
                                            )}
                                        </div>
                                        <div className={`price-list-container ${item.isSale ? 'on-sale' : ''}`}>
                                            {item.isSale && (
                                                <span className="original-price">{formatCurrency(item.price)}</span>
                                            )}
                                            <span className={item.isSale ? 'sale-price' : ''}>
                                            {item.isSale ? formatCurrency(item.price_sale) : formatCurrency(item.price)}
                                        </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            <ModalQuickView
                isShowModalQuickView={isShowModalQuickView}
                handleCloseModalQuickView={handleCloseModalQuickView}
                dataQuickView={dataQuickView}
            />
        </>
    );
};

export default ProductCards;