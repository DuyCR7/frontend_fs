import React, {useEffect, useRef, useState} from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import {FaArrowLeft, FaArrowRight} from "react-icons/fa";
import Rating from "../../components/rating/Rating.js";
import {Link, useNavigate} from "react-router-dom";

const title = "Quần áo bán chạy nhất";

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

const divStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
};

const buttonStyle = {
    width: "40px",
    height: "40px",
    background: 'rgba(255, 255, 255, 0.7)',
    cursor: 'pointer',
    position: 'absolute',
    top: '40%',
    transform: 'translateY(-50%)',
    zIndex: 2,
};

const properties = {
    prevArrow: (
        <button style={{ ...buttonStyle, borderRadius: "50%", left: '20px' }}>
            <FaArrowLeft color="rgb(24, 119, 242)" size={24} style={{position: "relative", left: "8px", bottom: "5px"}} />
        </button>
    ),
    nextArrow: (
        <button style={{ ...buttonStyle, borderRadius: "50%", right: '20px' }}>
            <FaArrowRight color="rgb(24, 119, 242)" size={24} style={{position: "relative", left: "8px", bottom: "5px"}}/>
        </button>
    ),
};

const BestSellerClothing = () => {

    const navigate = useNavigate();

    const [slidesToShow, setSlidesToShow] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 576) {
                setSlidesToShow(1);
            } else if (window.innerWidth <= 768) {
                setSlidesToShow(2);
            } else if (window.innerWidth <= 1024) {
                setSlidesToShow(3);
            }
            else {
                setSlidesToShow(4);
            }
        };

        // Initial check
        handleResize();

        // Add resize event listener
        window.addEventListener('resize', handleResize);

        // Clean up event listener
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="course-section style-3 padding-tb">
            {/*main section*/}
            <div className="container-fluid ps-5 pe-5">
                {/*section header*/}
                <div className="section-header">
                    <h2 className="title" style={{ color: "red" }}>{title}</h2>
                </div>

                <div className={`shop-page`}>
                    <div className={`shop-product-wrap row justify-content-center grid ps-3 pe-3`}>
                        <Slide duration={5000}
                               transitionDuration={700}
                               pauseOnHover={true}
                               autoplay={true}
                               infinite={true}
                               defaultIndex={0}
                               slidesToShow={slidesToShow}
                               slidesToScroll={slidesToShow}
                               {...properties}
                        >
                            {
                                ProductData.map((item, index) => (
                                    // <SwiperSlide key={index}>
                                        <div className="product-item mx-2" key={index}>
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
                                    // </SwiperSlide>
                                ))
                            }
                        </Slide>
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