import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import {FaArrowLeft, FaArrowRight} from "react-icons/fa";

const divStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%',
    height: '100%',
    aspectRatio: '16 / 9'
}
const slideImages = [
    {
        url: 'https://images.unsplash.com/photo-1509721434272-b79147e0e708?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80',
    },
    {
        url: 'https://images.unsplash.com/photo-1506710507565-203b9f24669b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1536&q=80',
    },
    {
        url: 'https://images.unsplash.com/photo-1536987333706-fc9adfb10d91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80',
    },
];

const buttonStyle = {
    width: "40px",
    height: "40px",
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 2,
};

const properties = {
    prevArrow: (
        <button style={{ ...buttonStyle, left: '10px' }}>
            <FaArrowLeft color="#fff" size={24} />
        </button>
    ),
    nextArrow: (
        <button style={{ ...buttonStyle, right: '0px' }}>
            <FaArrowRight color="#fff" size={24} />
        </button>
    ),
};

const Slider = () => {
    return (
        <div className="slide-container">
            <Slide duration={2000}
                   transitionDuration={700}
                   pauseOnHover={true}
                   autoplay={true}
                   infinite={true}
                   defaultIndex={0}
                   {...properties}
            >
                {slideImages.map((slideImage, index)=> (
                    <div key={index}>
                        <div style={{ ...divStyle, 'backgroundImage': `url(${slideImage.url})` }}></div>
                    </div>
                ))}
            </Slide>
        </div>
    )
}

export default Slider;