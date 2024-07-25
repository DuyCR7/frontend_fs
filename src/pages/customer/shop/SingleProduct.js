import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import PageHeader from "../components/PageHeader.js";

import ProductDisplay from "./ProductDisplay.js";
import Review from "./Review.js";
import PopularPost from "./PopularPost.js";
import Tags from "./Tags.js";
import Data from "../../../products.json";
import "./singleProduct.scss";

const SingleProduct = () => {

    const [product, setProduct] = useState([]);
    const {id} = useParams();

    useEffect(() => {
        setProduct(Data);
    }, []);

    // console.log(product);
    const result = product.filter((p) => p.id === id);

    const [images, setImages] = useState([
        "https://fastly.picsum.photos/id/7/4728/3168.jpg?hmac=c5B5tfYFM9blHHMhuu4UKmhnbZoJqrzNOP9xjkV4w3o",
        "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
        "https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4",
        "https://fastly.picsum.photos/id/4/5000/3333.jpg?hmac=ghf06FdmgiD0-G4c9DdNM8RnBIN7BO0-ZGEw47khHP4",
        "https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68",
        "https://picsum.photos/200/300?grayscale",
    ])

    const [activeImage, setActiveImage] = useState(images[0]);

    return (
        <div>
            <PageHeader title={"CHI TIẾT SẢN PHẨM"} curPage={"Của hàng / Chi tiết"}/>

            <div className="shop-single padding-tb aside-bg">
                <div className="container-fluid ps-5 pe-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-12">
                            {/*left sight*/}
                            <article>
                                <div className="product-details">
                                    <div className="row align-items-center">
                                        <div className="col-md-6 col-12">
                                            <div className="product-thumb">
                                                <img src={activeImage} alt="" className="mb-3 main-image"/>

                                                <div className="scroll-container">
                                                    {images.map((image, index) => (
                                                        <div
                                                            key={index}
                                                            className={`scroll-item ${activeImage === image ? 'active' : ''}`}
                                                            onClick={() => setActiveImage(image)}
                                                        >
                                                            <img src={image} alt=""/>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-6 col-12">
                                            <div className="post-content">
                                                <div>
                                                    {
                                                        result.map((item) => <ProductDisplay key={item.id}
                                                                                             item={item}
                                                                                              setActiveImage={setActiveImage}/>)
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/*review*/}
                                <div className="review">
                                    <Review />
                                </div>
                            </article>
                        </div>

                        {/*right sight*/}
                        <div className="col-lg-4 col-12">
                            <aside className="ps-lg-4">
                                <PopularPost />
                                <Tags />
                            </aside>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleProduct;