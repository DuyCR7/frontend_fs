import React from 'react';
import {Link} from "react-router-dom";
import Rating from "../../components/rating/Rating.jsx";
import {formatCurrency} from "../../../../utils/formatCurrency";

const ProductCards = ({GridList, products}) => {
    return (
        <div className={`shop-product-wrap row justify-content-center ${GridList ? "grid" : "list"}`}>
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
                                        <Link to={`/products/${item.slug}`} title='Xem nhanh'><i className="icofont-eye"></i></Link>
                                        <a href="#" title='Yêu thích'>
                                            <i className="icofont-heart"></i>
                                        </a>
                                        <Link to="/cart-page" title='Giỏ hàng'><i
                                            className="icofont-cart-alt"></i></Link>
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
                                    <span style={{
                                        fontWeight: "bold",
                                        fontSize: "18px"
                                    }}>{item.isSale ? formatCurrency(item.price_sale) : formatCurrency(item.price)}</span>
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
                                        <Link to={`/products/${item.slug}`}><i className="icofont-eye"></i></Link>
                                        <a href="#">
                                            <i className="icofont-heart"></i>
                                        </a>
                                        <Link to="/cart-page"><i className="icofont-cart-alt"></i></Link>
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
                                    <span style={{
                                        fontWeight: "bold",
                                        fontSize: "18px"
                                    }}>{item.isSale ? formatCurrency(item.price_sale) : formatCurrency(item.price)}</span>
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