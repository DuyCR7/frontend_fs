import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {getAllSellerClothing} from "../../../../services/customer/homeService";
import {Swiper, SwiperSlide} from "swiper/react";
import {FreeMode, Mousewheel, Navigation, Pagination} from "swiper/modules";
import {IoCartOutline, IoEyeOutline, IoHeartOutline} from "react-icons/io5";
import Rating from "../../components/rating/Rating";
import {formatCurrency} from "../../../../utils/formatCurrency";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import {FaArrowLeft, FaArrowRight} from "react-icons/fa";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import "./bestSellerClothing.scss";

const title = "Quần áo bán chạy nhất";

const BestSellerClothing = () => {

    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width <= 768);
        };

        handleResize(); // Call once to set initial values
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    useEffect(() => {
        fetchAllSellerClothing();
    }, []);
    const fetchAllSellerClothing = async () => {
        try {
            let res = await getAllSellerClothing();
            if (res && res.EC === 0) {
                setProducts(res.DT);
            } else {
                console.log('Error:', res.EM);
            }
        } catch (e) {
            console.error('Error fetching seller clothing', e);
        }
    }

    return (
        <div className="best-seller-clothing course-section style-3 padding-tb">
            {/*main section*/}
            <div className="container-fluid ps-5 pe-5">
                {/*section header*/}
                <div className="section-header">
                    <h2 className="title" style={{ color: "red" }}>{title}</h2>
                </div>

                <div className={`shop-page`}>
                    <div className={`shop-product-wrap row justify-content-center grid`}>
                        {/*<ResponsiveProductSlider products={products}/>*/}
                        <div className="best-seller-clothing-slider">
                            <Swiper
                                modules={[Navigation, Pagination, Mousewheel, FreeMode]}
                                spaceBetween={20}
                                slidesPerView={'auto'}
                                navigation={!isMobile ? {
                                    nextEl: '.best-seller-clothing-next',
                                    prevEl: '.best-seller-clothing-prev',
                                } : false}
                                pagination={isMobile ? {clickable: true} : false}
                                mousewheel={true}
                                freeMode={true}
                                speed={500}
                                breakpoints={{
                                    320: {
                                        slidesPerView: 1.4,
                                        slidesPerGroup: 1,
                                    },
                                    768: {
                                        slidesPerView: 3,
                                        slidesPerGroup: 2,
                                    },
                                    1024: {
                                        slidesPerView: 4,
                                        slidesPerGroup: 3,
                                    },
                                }}
                            >
                                {products.length > 0 && products.map((item, index) => (
                                    <SwiperSlide key={item.id}>
                                        <div className="product-item">
                                            <div className="product-thumb">
                                                <div className="pro-thumb">
                                                    <img
                                                        src={`${process.env.REACT_APP_URL_BACKEND}/${item.Product_Images[0].image}`}
                                                        alt={`${process.env.REACT_APP_URL_BACKEND}/${item.Product_Images[0].image}`}/>
                                                </div>
                                                <div className="product-action-link">
                                                    <span title="Xem nhanh"><IoEyeOutline size={16}/></span>
                                                    <span title="Yêu thích"><IoHeartOutline size={16}/></span>
                                                    <span title="Giỏ hàng"><IoCartOutline size={16}/></span>
                                                </div>
                                            </div>
                                            <div className="product-content">
                                <span style={{fontSize: "18px"}}>
                                    <Link to={`/products/${item.slug}`}>{item.name}</Link>
                                </span>
                                                <p className="productRating">
                                                    <Rating/>
                                                </p>
                                                <div className={`price-container ${item.isSale ? 'on-sale' : ''}`}>
                                                    {item.isSale && (
                                                        <span
                                                            className="original-price">{formatCurrency(item.price)}</span>
                                                    )}
                                                    <span className={item.isSale ? 'sale-price' : ''}>
                                                      {item.isSale ? formatCurrency(item.price_sale) : formatCurrency(item.price)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            {!isMobile && (
                                <>
                                    <div className="swiper-button-prev best-seller-clothing-prev custom-nav">
                                        <MdNavigateBefore/>
                                    </div>
                                    <div className="swiper-button-next best-seller-clothing-next custom-nav">
                                        <MdNavigateNext/>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="text-center">
                        <button onClick={() => navigate('/shop/seller')} className="btn btn-outline-primary">
                            Xem toàn bộ quần áo bán chạy
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BestSellerClothing;