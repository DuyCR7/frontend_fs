import React from 'react';
import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import {Autoplay} from "swiper/modules";
import { GrDeliver, GrSecure } from "react-icons/gr";
import { MdOutlinePayment } from "react-icons/md";
import { RiArrowGoBackLine } from "react-icons/ri";

const Sponsor = () => {
    return (
        <div className="sponsor-section section-bg">
            <div className="container-fluid ps-5 pe-5">
                <div className="section-wrapper">
                    <div className="sponsor-slider">
                        <Swiper
                            slidesPerView={1}
                            spaceBetween={20}
                            autoplay={
                                {
                                    delay: 2000,
                                    disableOnInteraction: false,
                                }
                            }
                            breakpoints={{
                                576: {
                                    slidesPerView: 2,
                                    spaceBetween: 10,
                                },
                                768: {
                                    slidesPerView: 3,
                                    spaceBetween: 40,
                                },
                                1024: {
                                    slidesPerView: 4,
                                    spaceBetween: 50,
                                },
                            }}
                            modules={[Autoplay]}
                            className="mySwiper"
                        >
                            <SwiperSlide>
                                <div
                                    className="d-flex flex-column align-items-center justify-content-center h-100 text-center">
                                    <GrDeliver size={24} className="mb-3"/>
                                    <p style={{fontFamily: "inherit"}}>GIAO HÀNG NHANH CHÓNG & MIỄN PHÍ</p>
                                    <p>Trên tất cả các đơn hàng - Giảm giá vận chuyển trên toàn quốc</p>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center">
                                    <MdOutlinePayment size={24} className="mb-3"/>
                                    <p style={{fontFamily: "inherit"}}>PHƯƠNG THỨC THANH TOÁN</p>
                                    <p>Thẻ tín dụng: Visa, MasterCard, Maestro, American Express, PayPal</p>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center">
                                    <GrSecure size={24} className="mb-3"/>
                                    <p style={{fontFamily: "inherit"}}>THANH TOÁN AN TOÀN</p>
                                    <p>Các khoản thanh toán của bạn được Shopify Payments bảo vệ</p>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center">
                                    <RiArrowGoBackLine size={24} className="mb-3"/>
                                    <p style={{fontFamily: "inherit"}}>HOÀN TIỀN & TRẢ LẠI</p>
                                    <p>Bạn có thể trả lại bất kỳ hàng hóa chưa sử dụng nào đã mua trong vòng 30 ngày kể từ ngày nhận.</p>
                                </div>
                            </SwiperSlide>
                        </Swiper>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sponsor;