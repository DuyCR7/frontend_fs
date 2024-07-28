import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import {FaArrowLeft, FaArrowRight} from "react-icons/fa";

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


const slideImages = [
    {
        url: '/admin/assets/img/banner1.png',
    },
    {
        url: '/admin/assets/img/banner2.png',
    },
    {
        url: '/admin/assets/img/banner3.png',
    },
];

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
    return (
        <div className="slide-container" style={{paddingTop: "100px"}}>
            <Slide duration={2000}
                   transitionDuration={700}
                   pauseOnHover={true}
                   autoplay={true}
                   infinite={true}
                   defaultIndex={0}
                   {...properties}
            >
                {slideImages.map((slideImage, index)=> (
                    <div key={index} style={divStyle}>
                        <img src={slideImage.url} alt={`Slide ${index}`} style={imageStyle}/>
                    </div>
                ))}
            </Slide>
        </div>
    )
}

export default Slider;