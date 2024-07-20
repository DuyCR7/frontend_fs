import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import {Autoplay} from "swiper/modules";

const sponsorList = [
    {
        imgUrl: "/admin/assets/img/examples/example1.jpeg",
    },
    {
        imgUrl: "/admin/assets/img/examples/example1.jpeg",
    },
    {
        imgUrl: "/admin/assets/img/examples/example1.jpeg",
    },
    {
        imgUrl: "/admin/assets/img/examples/example1.jpeg",
    },
    {
        imgUrl: "/admin/assets/img/examples/example1.jpeg",
    },
    {
        imgUrl: "/admin/assets/img/examples/example1.jpeg",
    },
];

const Sponsor = () => {
    return (
        <div className="sponsor-section section-bg">
            <div className="container-fluid ps-5 pe-5">
                <div className="section-wrapper">
                    <div className="sponsor-slider">
                        <Swiper
                            slidesPerView={2}
                            spaceBetween={20}
                            autoplay={
                                {
                                    delay: 2000,
                                    disableOnInteraction: false,
                                }
                            }
                            breakpoints={{
                                640: {
                                    slidesPerView: 1,
                                    spaceBetween: 20,
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
                            {
                                sponsorList.map((item, index) => (
                                    <SwiperSlide key={index}>
                                        <div className="sponsor-item">
                                            <div className="sponsor-thumb">
                                                <img src={item.imgUrl} alt="" />
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sponsor;