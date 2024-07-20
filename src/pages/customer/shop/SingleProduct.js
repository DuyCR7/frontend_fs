import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import PageHeader from "../components/PageHeader.js";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import {Autoplay} from "swiper/modules"
import ProductDisplay from "./ProductDisplay.js";
import Review from "./Review.js";
import PopularPost from "./PopularPost.js";
import Tags from "./Tags.js";
import Data from "../../../products.json";

const SingleProduct = () => {

    const [product, setProduct] = useState([]);
    const {id} = useParams();

    useEffect(() => {
        // fetch("/products.json").then(res => res.json())
        //     .then(data => setProduct(data));
        setProduct(Data);
    }, []);

    console.log(product);
    const result = product.filter((p) => p.id === id);

    return (
        <div>
            <PageHeader title={"OUR SHOP SINGLE"} curPage={"Shop / AdSingle Product"}/>

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
                                                <div className="swiper-container pro-single-top">
                                                    <Swiper className="mySwiper"
                                                            spaceBetween={30}
                                                            slidesPerView={1}
                                                            loop={"true"}
                                                            autoplay={{
                                                                delay: 2000,
                                                                disableOnInteraction: false
                                                            }}
                                                            modules={[Autoplay]}
                                                            navigation={
                                                                {
                                                                    prevEl: ".pro-single-prev",
                                                                    nextEl: ".pro-single-next",
                                                                }
                                                            }>
                                                        {
                                                            result.map((item, index) => {
                                                                return (
                                                                    <SwiperSlide key={index}>
                                                                        <div className="single-thumb">
                                                                            <img src={item.img} alt=""/>
                                                                        </div>
                                                                    </SwiperSlide>
                                                                )
                                                            })
                                                        }
                                                    </Swiper>
                                                    <div className="pro-single-next">
                                                        <i className="icofont-rounded-left"></i>
                                                    </div>
                                                    <div className="pro-single-prev">
                                                        <i className="icofont-rounded-right"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-6 col-12">
                                            <div className="post-content">
                                                <div>
                                                    {
                                                        result.map((item) => <ProductDisplay key={item.id} item={item} />)
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