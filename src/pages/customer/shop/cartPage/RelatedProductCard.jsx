import React from 'react';
import {Link} from "react-router-dom";
import Rating from "../../components/rating/Rating";
import {formatCurrency} from "../../../../utils/formatCurrency";
import RatingOnlyView from "../../components/rating/RatingOnlyView";

const RelatedProductCard = ({product}) => {
    console.log(product)
    return (
        <>
            <div className="product-item">
                {/*product images*/}
                <div className="product-thumb">
                    <Link to={`/products/${product.slug}`}>
                        <div style={{padding: "20px"}}>
                            <img src={`${process.env.REACT_APP_URL_BACKEND}/${product.image}`}
                                 alt={`${process.env.REACT_APP_URL_BACKEND}/${product.image}`}/>
                        </div>
                    </Link>
                </div>

                {/*product content*/}
                <div className="product-content d-flex flex-column gap-2">
                    <span style={{fontSize: "18px"}}>
                        <Link
                            to={`/products/${product.slug}`}>{product.name}</Link>
                    </span>
                    <div className="productRating">
                        {product.averageRating > 0 && (
                            <RatingOnlyView value={product.averageRating} />
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
        </>
    );
};

export default RelatedProductCard;