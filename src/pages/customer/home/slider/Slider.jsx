import React, {useEffect, useState} from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import {FaArrowLeft, FaArrowRight} from "react-icons/fa";
import {getAllBanners} from "../../../../services/customer/homeService";
import {Link} from "react-router-dom";

const divStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
};

const imageStyle = {
    width: 'auto',
    height: 'auto',
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain'
};

const buttonStyle = {
    width: "40px",
    height: "40px",
    background: 'rgba(255, 255, 255, 0.7)',
    cursor: 'pointer',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 2,
};

const properties = {
    prevArrow: (
        <button style={{ ...buttonStyle, borderRadius: "50%", left: '10px' }}>
            <FaArrowLeft color="rgb(24, 119, 242)" size={24} style={{position: "relative", left: "8px", bottom: "5px"}} />
        </button>
    ),
    nextArrow: (
        <button style={{ ...buttonStyle, borderRadius: "50%", right: '10px' }}>
            <FaArrowRight color="rgb(24, 119, 242)" size={24} style={{position: "relative", left: "8px", bottom: "5px"}}/>
        </button>
    ),
};

const Slider = () => {

    const [listBanner, setListBanner] = useState([]);

    useEffect(() => {
        fetchAllBanners();
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
                            <Link to={item.url} key={index} style={divStyle}>
                                <img src={`${process.env.REACT_APP_URL_BACKEND}/${item.image}`} alt={`Slide ${index}`} style={imageStyle}/>
                            </Link>
                        ))}
                    </Slide>
                )
            }
        </div>
    )
}

export default Slider;