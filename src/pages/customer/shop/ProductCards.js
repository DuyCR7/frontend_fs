import React from 'react';
import {Link} from "react-router-dom";
import Rating from "../components/Rating.js";

const ProductCards = ({GridList, products}) => {

    return (
        <div className={`shop-product-wrap row justify-content-center ${GridList ? "grid" : "list"}`}>
            {
                products.map((item, index) => {
                    return (
                        <div key={index} className="col-lg-4 col-md-6 col-12">
                            <div className="product-item">
                                {/*product images*/}
                                <div className="product-thumb">
                                    <div className="pro-thumb">
                                        <img src={item.img} alt={item.img}/>
                                    </div>

                                    {/*product action links*/}
                                    <div className="product-action-link">
                                        <Link to={`/shop/${item.id}`} title='Xem nhanh'><i className="icofont-eye"></i></Link>
                                        <a href="#" title='Yêu thích'>
                                            <i className="icofont-heart"></i>
                                        </a>
                                        <Link to="/cart-page" title='Giỏ hàng'><i className="icofont-cart-alt"></i></Link>
                                    </div>
                                </div>

                                {/*product content*/}
                                <div className="product-content">
                                    <h5>
                                        <Link to={`/shop/${item.id}`}>{item.name}</Link>
                                    </h5>
                                    <p className="productRating">
                                        <Rating/>
                                    </p>
                                    <h6>${item.price}</h6>
                                </div>
                            </div>

                            {/*list style*/}
                            <div className="product-list-item">
                                {/*product images*/}
                                <div className="product-thumb">
                                    <div className="pro-thumb">
                                        <img src={item.img} alt={item.img}/>
                                    </div>

                                    {/*product action links*/}
                                    <div className="product-action-link">
                                        <Link to={`/shop/${item.id}`}><i className="icofont-eye"></i></Link>
                                        <a href="#">
                                            <i className="icofont-heart"></i>
                                        </a>
                                        <Link to="/cart-page"><i className="icofont-cart-alt"></i></Link>
                                    </div>
                                </div>

                                {/*product content*/}
                                <div className="product-content">
                                    <h5>
                                        <Link to={`/shop/${item.id}`}>{item.name}</Link>
                                    </h5>
                                    <p className="productRating">
                                        <Rating/>
                                    </p>
                                    <h6>${item.price}</h6>
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