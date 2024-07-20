import React, {useEffect, useState} from 'react';
import NavItems from "../components/NavItems";
import {Outlet} from "react-router-dom";
import Footer from "../components/Footer";

import "../../../assets/css/icofont.min.css";
import "../../../assets/css/animate.css";
import "../../../assets/css/style.min.css";

const CusApp = () => {

    const [showScrollTopButton, setShowScrollTopButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollTopButton(true);
            } else {
                setShowScrollTopButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <>
            <NavItems />
            <div className='min-vh-100'>
                <Outlet />
            </div>
            <Footer />

            {showScrollTopButton && (
                <button
                    onClick={scrollToTop}
                    className="btn btn-primary scroll-to-top position-fixed"
                    style={{ right: '15px', bottom: '15px', borderRadius: '50%', padding: '10px 12px', zIndex: 1000 }}
                >
                    <i className="icofont-simple-up" style={{ fontSize: '20px' }}></i>
                </button>
            )}
        </>
    );
};

export default CusApp;