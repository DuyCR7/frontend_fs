import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import PageHeader from "../../components/pageHeader/PageHeader.jsx";

import ProductDisplay from "../productDisplay/ProductDisplay.jsx";
import Review from "../review/Review.jsx";
import PopularPost from "../popularPost/PopularPost.jsx";
import Tags from "../tags/Tags.jsx";
import Data from "../../../../products.json";
import "./singleProduct.scss";
import {getSingleProduct} from "../../../../services/customer/shopService";

const SingleProduct = () => {

    const {slug} = useParams();
    const [productData, setProductData] = useState({});
    const [activeImage, setActiveImage] = useState("");
    const [images, setImages] = useState([]);

    useEffect(() => {
        fetchSingleProduct();
    }, []);

    const fetchSingleProduct = async () => {
        let res = await getSingleProduct(slug);
        if (res && res.EC === 0) {
            setProductData(res.DT);

            let mainImage = res.DT.images.filter((image) => image.isMainImage === true);
            if (mainImage) {
                setActiveImage(mainImage[0].image);
            }
            setImages(res.DT.images);
        } else {
            console.log("Error: ", res.EM);
        }
    }

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
                                                <img src={`${process.env.REACT_APP_URL_BACKEND}/${activeImage}`} alt=""
                                                     className="mb-3 main-image"/>

                                                <div className="scroll-container">
                                                    {images.length > 0 && images.map((image, index) => (
                                                        <div
                                                            key={index}
                                                            className={`scroll-item ${activeImage === image.image ? 'active' : ''}`}
                                                            onClick={() => setActiveImage(image.image)}
                                                        >
                                                            <img
                                                                src={`${process.env.REACT_APP_URL_BACKEND}/${image.image}`}
                                                                alt=""/>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-6 col-12">
                                            <div className="post-content">
                                                <div>
                                                    <ProductDisplay
                                                        productData={productData}
                                                        setActiveImage={setActiveImage}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/*review*/}
                                <div className="review">
                                    <Review/>
                                </div>
                            </article>
                        </div>

                        {/*right sight*/}
                        <div className="col-lg-4 col-12">
                            <aside className="ps-lg-4">
                                <PopularPost/>
                                <Tags/>
                            </aside>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleProduct;