import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {getAllSalesProducts} from "../../../../services/customer/homeService";
import {Swiper, SwiperSlide} from "swiper/react";
import {FreeMode, Mousewheel, Navigation, Pagination} from "swiper/modules";
import {IoEyeOutline, IoHeartOutline, IoHeartSharp} from "react-icons/io5";
import {formatCurrency} from "../../../../utils/formatCurrency";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import "./allSalesProducts.scss";
import {useSelector} from "react-redux";
import {useWishlist} from "../../components/wishList/useWishlist";
import RatingOnlyView from "../../components/rating/RatingOnlyView";
import ModalQuickView from "../../components/modal/ModalQuickView";

const title = "Sản Phẩm Khuyến Mãi";

const AllSalesProducts = () => {

    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const { loading, wishList, isInWishlist, handleWishlistAction } = useWishlist();

    const customer = useSelector((state) => state.customer);

    const [isShowModalQuickView, setIsShowModalQuickView] = useState(false);
    const [dataQuickView, setDataQuickView] = useState({});

    const handleCloseModalQuickView = () => {
        setIsShowModalQuickView(false);
        setDataQuickView({});
    }

    const handleShowModalQuickView = (product) => {
        setIsShowModalQuickView(true);
        setDataQuickView(product);
    }

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
        fetchAllSalesProducts();
    }, []);

    const fetchAllSalesProducts = async () => {
        try {
            let res = await getAllSalesProducts();
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
        <>
            <div className="all-sales-products course-section style-3 padding-tb">
                {/*main section*/}
                <div className="container-fluid ps-5 pe-5">
                    {/*section header*/}
                    <div className="section-header">
                        <h2 className="title" style={{color: "red"}}>{title}</h2>
                    </div>

                    <div className={`shop-page`}>
                        <div className={`shop-product-wrap row justify-content-center grid`}>
                            {/*<ResponsiveProductSlider products={products}/>*/}
                            <div className="all-sales-products-slider">
                                <Swiper
                                    modules={[Navigation, Pagination, Mousewheel, FreeMode]}
                                    spaceBetween={20}
                                    slidesPerView={'auto'}
                                    navigation={!isMobile ? {
                                        nextEl: '.all-sales-products-next',
                                        prevEl: '.all-sales-products-prev',
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
                                            <div className="product-item h-100 d-flex flex-column justify-content-center">
                                                <div className="product-thumb">
                                                    <Link to={`/products/${item.slug}`}>
                                                        <div className="pro-thumb">
                                                            <img
                                                                src={`${process.env.REACT_APP_URL_BACKEND}/${item.image}`}
                                                                alt={`${process.env.REACT_APP_URL_BACKEND}/${item.image}`}/>
                                                        </div>
                                                    </Link>
                                                    <div className="product-action-link">
                                                        <button title="Xem nhanh"
                                                                onClick={() => handleShowModalQuickView(item)}
                                                        ><IoEyeOutline size={16}/></button>
                                                        <button title="Yêu thích" disabled={loading}
                                                                onClick={() => handleWishlistAction(item)}>
                                                            {
                                                                customer.isAuthenticated && isInWishlist(item.id)
                                                                    ? <IoHeartSharp size={16}/>
                                                                    : <IoHeartOutline size={16}/>
                                                            }
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="product-content d-flex flex-column gap-2">
                                                <span style={{fontSize: "18px"}}>
                                                    <Link to={`/products/${item.slug}`}>{item.name}</Link>
                                                </span>
                                                    <div className="productRating">
                                                        {item.averageRating > 0 && (
                                                            <RatingOnlyView value={item.averageRating}/>
                                                        )}
                                                    </div>
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
                                        <div className="swiper-button-prev all-sales-products-prev custom-nav">
                                            <MdNavigateBefore/>
                                        </div>
                                        <div className="swiper-button-next all-sales-products-next custom-nav">
                                            <MdNavigateNext/>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ModalQuickView
                isShowModalQuickView={isShowModalQuickView}
                handleCloseModalQuickView={handleCloseModalQuickView}
                dataQuickView={dataQuickView}
            />
        </>
    );
};

export default AllSalesProducts;