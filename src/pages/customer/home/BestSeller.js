import React, {useEffect, useRef, useState} from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import {Navigation} from "swiper/modules";
import {FaArrowLeft, FaArrowRight} from "react-icons/fa";
import Rating from "../components/Rating.js";
import {Link, useNavigate} from "react-router-dom";
import "./bestSeller.scss";

const title = "Bán chạy nhất";

const ProductData = [
    {
        imgUrl: '/admin/assets/img/examples/example1.jpeg',
        cate: 'Shoes',
        title: 'Nike Premier X',
        author: 'assets/images/course/author/01.jpg',
        brand: 'Nike',
        price: '$199.00',
        id: 1,
    },
    {
        imgUrl: '/admin/assets/img/examples/example1.jpeg',
        cate: 'Bags',
        title: 'Asthetic Bags',
        author: 'assets/images/course/author/02.jpg',
        brand: 'D&J Bags',
        price: '$199.00',
        id: 2,
    },
    {
        imgUrl: '/admin/assets/img/examples/example1.jpeg',
        cate: 'Phones',
        title: 'iPhone 12',
        author: 'customer/assets/images/categoryTab/brand/apple.png',
        brand: 'Apple',
        price: '$199.00',
        id: 3,
    },
    {
        imgUrl: '/admin/assets/img/examples/example1.jpeg',
        cate: 'Bags',
        title: 'Hiking Bag 15 Nh100',
        author: 'assets/images/course/author/04.jpg',
        brand: 'Gucci',
        price: '$199.00',
        id: 4,
    },
    {
        imgUrl: '/admin/assets/img/examples/example1.jpeg',
        cate: 'Shoes',
        title: 'Outdoor Sports Shoes',
        author: 'assets/images/course/author/05.jpg',
        brand: 'Nike',
        price: '$199.00',
        id: 5,
    },
    {
        imgUrl: '/admin/assets/img/examples/example1.jpeg',
        cate: 'Beauty',
        title: 'COSRX Snail Mucin',
        author: 'assets/images/course/author/06.jpg',
        brand: 'Zaara',
        price: '$199.00',
        id: 6,
    },
    {
        imgUrl: '/admin/assets/img/examples/example1.jpeg',
        cate: 'Bags',
        title: 'Look Less Chanel Bag ',
        author: 'assets/images/course/author/01.jpg',
        brand: 'Gucci',
        price: '$199.00',
        id: 7,
    },
    {
        imgUrl: '/admin/assets/img/examples/example1.jpeg',
        cate: 'Shoes',
        title: 'Casual Sneakers',
        author: 'assets/images/course/author/02.jpg',
        brand: 'Bata',
        price: '$199.00',
        id: 8,
    },
];

const BestSeller = () => {

    const navigate = useNavigate();
    const swiperRef = useRef(null);

    useEffect(() => {
        if (!swiperRef.current) return;

        const swiper = swiperRef.current.swiper;

        const handleSlideChange = () => {
            if (!swiper) return;

            const { isBeginning, isEnd } = swiper;

            // Hiển thị hoặc ẩn các nút điều hướng
            swiper.navigation.nextEl.classList.toggle('swiper-button-visible', !isEnd);
            swiper.navigation.prevEl.classList.toggle('swiper-button-visible', !isBeginning);
        };

        // Đăng ký sự kiện slideChange
        swiper.on('slideChange', handleSlideChange);

        // Kiểm tra trạng thái ngay khi khởi tạo
        handleSlideChange();

        // Dọn dẹp sự kiện khi component bị hủy
        return () => {
            swiper.off('slideChange', handleSlideChange);
        };
    }, [swiperRef]);

    return (
        <div className="course-section style-3 padding-tb">
            {/*main section*/}
            <div className="container-fluid ps-5 pe-5">
                {/*section header*/}
                <div className="section-header">
                    <h2 className="title">{title}</h2>
                </div>

                <div className={`shop-page`}>
                    <div className={`shop-product-wrap row justify-content-center grid ps-3 pe-3`}>
                        <Swiper
                            ref={swiperRef}
                            slidesPerView={1}
                            spaceBetween={10}
                            breakpoints={{
                                640: {
                                    slidesPerView: 1,
                                    spaceBetween: 10,
                                },
                                768: {
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                },
                                1024: {
                                    slidesPerView: 4,
                                    spaceBetween: 20,
                                },
                            }}
                            navigation={{
                                nextEl: '.swiper-button-next',
                                prevEl: '.swiper-button-prev',
                            }}
                            modules={[Navigation]}
                            className="mySwiper"
                        >
                            {
                                ProductData.map((item, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="product-item">
                                            {/*product images*/}
                                            <div className="product-thumb">
                                                <div className="pro-thumb">
                                                    <img src={item.imgUrl} alt={item.imgUrl}/>
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
                                                    <Link to={`/shop/${item.id}`}>{item.title}</Link>
                                                </h5>
                                                <p className="productRating">
                                                    <Rating/>
                                                </p>
                                                <h6>{item.price}</h6>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                        <div className="swiper-button-next">
                            <FaArrowRight style={{color: 'rgb(24, 119, 242)'}}/>
                        </div>
                        <div className="swiper-button-prev">
                            <FaArrowLeft style={{color: 'rgb(24, 119, 242)'}}/>
                        </div>
                    </div>

                    <div className="text-center">
                        <button onClick={() => navigate('/shop/seller')} className="btn btn-outline-primary">
                            Xem toàn bộ sản phẩm bán chạy
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BestSeller;