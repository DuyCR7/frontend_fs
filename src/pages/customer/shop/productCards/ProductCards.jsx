import React from 'react';
import {Link} from "react-router-dom";
import Rating from "../../components/rating/Rating.jsx";
import {formatCurrency} from "../../../../utils/formatCurrency";
import "./productCards.scss";
import {IoCartOutline, IoEyeOutline, IoHeartOutline} from "react-icons/io5";

const ProductCards = ({GridList, products}) => {
    return (
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
                                            src={`${process.env.REACT_APP_URL_BACKEND}/${item.Product_Images[0].image}`}
                                            alt={`${process.env.REACT_APP_URL_BACKEND}/${item.Product_Images[0].image}`}/>
                                    </div>

                                    {/*product action links*/}
                                    <div className="product-action-link">
                                        <span title='Xem nhanh'>
                                            <IoEyeOutline size={16} style={{cursor: "pointer"}} />
                                        </span>
                                        <span title='Yêu thích'>
                                            <IoHeartOutline size={16} style={{cursor: "pointer"}} />
                                        </span>
                                        <span title='Giỏ hàng'>
                                            <IoCartOutline size={16} style={{cursor: "pointer"}} />
                                        </span>
                                    </div>
                                </div>

                                {/*product content*/}
                                <div className="product-content">
                                    <span style={{fontSize: "18px"}}>
                                        <Link to={`/products/${item.id}`}>{item.name}</Link>
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
                                            src={`${process.env.REACT_APP_URL_BACKEND}/${item.Product_Images[0].image}`}
                                            alt={`${process.env.REACT_APP_URL_BACKEND}/${item.Product_Images[0].image}`}/>
                                    </div>

                                    {/*product action links*/}
                                    <div className="product-action-link">
                                        <span title='Xem nhanh'>
                                            <IoEyeOutline size={16} style={{cursor: "pointer"}} />
                                        </span>
                                        <span title='Yêu thích'>
                                            <IoHeartOutline size={16} style={{cursor: "pointer"}} />
                                        </span>
                                        <span title='Giỏ hàng'>
                                            <IoCartOutline size={16} style={{cursor: "pointer"}} />
                                        </span>
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
    );
};

export default ProductCards;