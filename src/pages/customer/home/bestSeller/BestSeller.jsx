import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {getAllBestSeller} from "../../../../services/customer/homeService";
import {Swiper, SwiperSlide} from "swiper/react";
import {FreeMode, Mousewheel, Navigation, Pagination} from "swiper/modules";
import {IoCartOutline, IoEyeOutline, IoHeartOutline, IoHeartSharp} from "react-icons/io5";
import Rating from "../../components/rating/Rating";
import {formatCurrency} from "../../../../utils/formatCurrency";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import "./bestSeller.scss"
import {useSelector} from "react-redux";
import {useWishlist} from "../../components/wishList/useWishlist";
import RatingOnlyView from "../../components/rating/RatingOnlyView";

const title = "Sản Phẩm Bán Chạy";

const BestSeller = () => {

    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const customer = useSelector((state) => state.customer);

    const { wishList, isInWishlist, handleWishlistAction } = useWishlist();

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
            let res = await getAllBestSeller();
            if (res && res.EC === 0) {
                setProducts(res.DT);
            } else {
                console.log('Error:', res.EM);
            }
        } catch (e) {
            console.error('Error fetching seller clothing', e);
        }
    }
console.log(products);
    return (
        <div className="all-best-seller course-section style-3 padding-tb">
            {/*main section*/}
            <div className="container-fluid ps-5 pe-5">
                {/*section header*/}
                <div className="section-header">
                    <h2 className="title" style={{color: "red"}}>{title}</h2>
                </div>

                <div className={`shop-page`}>
                    <div className={`shop-product-wrap row justify-content-center grid`}>
                        {/*<ResponsiveProductSlider products={products} />*/}
                        <div className="all-best-seller-slider">
                            <Swiper
                                modules={[Navigation, Pagination, Mousewheel, FreeMode]}
                                spaceBetween={20}
                                slidesPerView={'auto'}
                                navigation={!isMobile ? {
                                    nextEl: '.all-best-seller-next',
                                    prevEl: '.all-best-seller-prev',
                                } : false}
                                pagination={isMobile ? {clickable: true} : false}
                                // mousewheel={true}
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
                                                <Link to={`/products/${item.slug}`}>
                                                    <div className="pro-thumb">
                                                        <img
                                                            src={`${process.env.REACT_APP_URL_BACKEND}/${item['Product_Images.image']}`}
                                                            alt={`${process.env.REACT_APP_URL_BACKEND}/${item['Product_Images.image']}`}/>
                                                    </div>
                                                </Link>
                                                <div className="product-action-link">
                                                    <button title="Xem nhanh"><IoEyeOutline size={16}/></button>
                                                    <button title="Yêu thích" onClick={() => handleWishlistAction(item)}>
                                                        {
                                                            customer.isAuthenticated && isInWishlist(item.id)
                                                                ? <IoHeartSharp size={16}/>
                                                                : <IoHeartOutline size={16}/>
                                                        }
                                                    </button>
                                                    {/*<span title="Giỏ hàng"><IoCartOutline size={16}/></span>*/}
                                                </div>
                                            </div>
                                            <div className="product-content d-flex flex-column gap-2">
                                <span style={{fontSize: "18px"}}>
                                    <Link to={`/products/${item.slug}`}>{item.name}</Link>
                                </span>
                                                <div className="productRating">
                                                    {/*<Rating/>*/}
                                                    {item.averageRating > 0 && (
                                                        <RatingOnlyView value={item.averageRating} />
                                                    )}
                                                </div>
                                                <div className={`price-container ${item.isSale ? 'on-sale' : ''}`}>
                                                    {item.isSale === 1 && (
                                                        <span
                                                            className="original-price">{formatCurrency(item.price)}</span>
                                                    )}
                                                    <span className={item.isSale === 1 ? 'sale-price' : ''}>
                                                      {item.isSale === 1 ? formatCurrency(item.price_sale) : formatCurrency(item.price)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            {!isMobile && (
                                <>
                                    <div className="swiper-button-prev all-best-seller-prev custom-nav">
                                        <MdNavigateBefore/>
                                    </div>
                                    <div className="swiper-button-next all-best-seller-next custom-nav">
                                        <MdNavigateNext/>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="text-center">
                        <button onClick={() => navigate('/shop/seller')} className="btn btn-outline-primary">
                            Xem toàn bộ quà tặng bán chạy
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BestSeller;