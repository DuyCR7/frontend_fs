import React, {useEffect, useState} from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import {FaArrowLeft, FaArrowRight} from "react-icons/fa";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import {getAllBanners} from "../../../../services/customer/homeService";
import {Link} from "react-router-dom";
import "./slider.scss";

const properties = {
    prevArrow: (
        <button className="btn-left">
            <MdNavigateBefore />
        </button>
    ),
    nextArrow: (
        <button className="btn-right">
            <MdNavigateNext />
        </button>
    ),
};

const Slider = () => {

    const [listBanner, setListBanner] = useState([]);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        fetchAllBanners();
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchAllBanners = async () => {
        try {
            let res = await getAllBanners();
            if(res && res.EC === 0) {
                setListBanner(res.DT);
            } else {
                console.log('Error:', res.EM);
            }
        } catch (e) {
            console.error('Error fetching banners:', e);
        }
    }

    const handleResize = () => {
        setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };

    return (
        <div className="slide-container" style={{paddingTop: "100px"}}>
            {
                listBanner.length > 0 && (
                    <Slide duration={2000}
                           transitionDuration={700}
                           pauseOnHover={true}
                           autoplay={true}
                           infinite={true}
                           defaultIndex={0}
                           {...properties}
                    >
                        {listBanner.map((item, index)=> (
                            <Link className="slide-link" to={item.url} key={index}>
                                <img src={`${process.env.REACT_APP_URL_BACKEND}/${isMobile ? item.imageMobile : item.imageDesktop}`} alt={`Slide ${index}`}/>
                            </Link>
                        ))}
                    </Slide>
                )
            }
        </div>
    )
}

export default Slider;