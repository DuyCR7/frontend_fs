import React, {useEffect, useState} from 'react';
import {Navigate, useParams} from "react-router-dom";
import PageHeader from "../../components/pageHeader/PageHeader.jsx";
import ProductDisplay from "../productDisplay/ProductDisplay.jsx";
import Review from "../review/Review.jsx";
import PopularPost from "../popularPost/PopularPost.jsx";
import "./singleProduct.scss";
import {getSingleProduct} from "../../../../services/customer/shopService";
import {Spin} from "antd";
import NotFoundPageCus from "../../../../components/NotFoundPageCus/NotFoundPageCus";

const SingleProduct = () => {

    const {slug} = useParams();
    const [productData, setProductData] = useState({});
    const [activeImage, setActiveImage] = useState("");
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchSingleProduct();
    }, [slug]);

    const fetchSingleProduct = async () => {
        try {
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
                setError(res.DT);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75" style={{zIndex: 9999}}>
                <Spin size="large" />
            </div>
        );
    }

    if (Object.keys(productData).length === 0 && error === 'not-found') {
        return <NotFoundPageCus />
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
                                                            key={image.id}
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
                                    <Review productData={productData}/>
                                </div>
                            </article>
                        </div>

                        {/*right sight*/}
                        <div className="col-lg-4 col-12 mt-4 mt-lg-0">
                            <aside className="ps-lg-4">
                                <PopularPost/>
                            </aside>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleProduct;