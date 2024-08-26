import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import Rating from "../../components/rating/Rating.jsx";
import {formatCurrency} from "../../../../utils/formatCurrency";
import "./productCards.scss";
import {IoCartOutline, IoEyeOutline, IoHeartOutline, IoHeartSharp} from "react-icons/io5";
import ModalQuickView from "../../components/modal/ModalQuickView";
import {useSelector} from "react-redux";
import {useWishlist} from "../../components/wishList/useWishlist";

const ProductCards = ({GridList, products}) => {

    const customer = useSelector((state) => state.customer);

    const { wishList, isInWishlist, handleWishlistAction } = useWishlist();

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
                            <div key={index} className="col-lg-3 col-md-4 col-sm-6 col-12">
                                <div className="product-item">
                                    {/*product images*/}
                                    <div className="product-thumb">
                                        <div className="pro-thumb">
                                            <img
                                                src={`${process.env.REACT_APP_URL_BACKEND}/${item.image}`}
                                                alt={`${process.env.REACT_APP_URL_BACKEND}/${item.image}`}/>
                                        </div>

                                        {/*product action links*/}
                                        <div className="product-action-link">
                                            <span title='Xem nhanh'
                                                  onClick={() => handleShowModalQuickView(item)}>
                                                <IoEyeOutline size={16} style={{cursor: "pointer"}}/>
                                            </span>
                                            <span title='Yêu thích' onClick={() => handleWishlistAction(item)}>
                                                {
                                                    customer.isAuthenticated && isInWishlist(item.id)
                                                        ? <IoHeartSharp size={16}/>
                                                        : <IoHeartOutline size={16}/>
                                                }
                                            </span>
                                        {/*    <span title='Giỏ hàng'>*/}
                                        {/*    <IoCartOutline size={16} style={{cursor: "pointer"}}/>*/}
                                        {/*</span>*/}
                                        </div>
                                    </div>

                                    {/*product content*/}
                                    <div className="product-content">
                                    <span style={{fontSize: "18px"}}>
                                        <Link to={`/products/${item.slug}`}>{item.name}</Link>
                                    </span>
                                        <p className="productRating">
                                            <Rating/>
                                        </p>
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
                                        <div className="pro-thumb">
                                            <img
                                                src={`${process.env.REACT_APP_URL_BACKEND}/${item.image}`}
                                                alt={`${process.env.REACT_APP_URL_BACKEND}/${item.image}`}/>
                                        </div>

                                        {/*product action links*/}
                                        <div className="product-action-link">
                                            <span title='Xem nhanh'
                                                  onClick={() => handleShowModalQuickView(item)}>
                                                <IoEyeOutline size={16} style={{cursor: "pointer"}}/>
                                            </span>
                                            <span title='Yêu thích' onClick={() => handleWishlistAction(item)}>
                                                {
                                                    customer.isAuthenticated && isInWishlist(item.id)
                                                        ? <IoHeartSharp size={16}/>
                                                        : <IoHeartOutline size={16}/>
                                                }
                                            </span>
                                            {/*<span title='Giỏ hàng'>*/}
                                            {/*    <IoCartOutline size={16} style={{cursor: "pointer"}}/>*/}
                                            {/*</span>*/}
                                        </div>
                                    </div>

                                    {/*product content*/}
                                    <div className="product-content">
                                    <span style={{fontSize: "18px"}}>
                                        <Link to={`/products/${item.slug}`}>{item.name}</Link>
                                    </span>
                                        <p className="productRating">
                                            <Rating/>
                                        </p>
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