import React from 'react';
import {Link} from "react-router-dom";
import Sponsor from "../../home/sponsor/Sponsor";

const title = "Liên hệ chúng tôi";
const desc = "Seven Shop";
const ItemTitle = "Mua sắm với chúng tôi";
const quickTitle = "Liên kết nhanh";

const addressList = [
    {
        iconName: 'icofont-google-map',
        text: 'Ngõ 389 phố Vọng, Hai Bà Trưng, Hà Nội',
    },
    {
        iconName: 'icofont-phone',
        text: ' +84 868 839 613',
    },
    {
        iconName: 'icofont-envelope',
        text: ' anhduy0317@gmail.com',
    },
]

const socialList = [
    {
        iconName: 'icofont-facebook',
        siteLink: 'https://www.facebook.com/profile.php?id=100060908824578',
        className: 'facebook',
    },
    {
        iconName: 'icofont-instagram',
        siteLink: 'https://www.instagram.com/___dduy.03/',
        className: 'instagram',
    },
]

const ItemList = [
    {
        text: 'Điều khoản và điều kiện',
        link: 'policies/terms-of-service',
    },
    {
        text: 'Chính sách bảo mật',
        link: 'policies/privacy-policy',
    },
    {
        text: 'Chính sách hoàn tiền',
        link: 'policies/refund-policy',
    },
    {
        text: 'Vận chuyển',
        link: 'policies/shipping-policy',
    }
]

const quickList = [
    {
        text: 'Về chúng tôi',
        link: 'pages/about-us',
    },
    {
        text: 'Bài viết',
        link: 'blogs',
    },
    {
        text: 'Liên hệ',
        link: 'contacts',
    },
]

const Footer = () => {
    return (
        <>
        <Sponsor />

        <footer className="style-2">
            <div className="footer-top dark-view padding-tb">
                <div className="container-fluid ps-5 pe-5">
                    <div className="row g-4 row-cols-md-3 row-cols-1 justify-content-center">
                        <div className="col">
                            <div className="footer-item our-address">
                                <div className="footer-inner">
                                    <div className="footer-content">
                                        <div className="title">
                                            <h4>{title}</h4>
                                        </div>
                                        <div className="content">
                                            <p>{desc}</p>
                                            <ul className="lab-ul office-address">
                                                {
                                                    addressList.map((item, index) => {
                                                        return (
                                                            <li key={index}>
                                                                <i className={item.iconName}>{item.text}</i>
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                            <ul className="lab-ul social-icons">
                                                {
                                                    socialList.map((item, index) => {
                                                        return (
                                                            <li key={index}>
                                                                <a href={item.siteLink} className={item.className}><i
                                                                    className={item.iconName}>{item.text}</i></a>
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="footer-item our-address">
                                <div className="footer-inner">
                                    <div className="footer-content">
                                        <div className="title">
                                            <h4>{ItemTitle}</h4>
                                        </div>
                                        <div className="content">
                                            <ul className="lab-ul office-address">
                                                {
                                                    ItemList.map((item, index) => {
                                                        return (
                                                            <li key={index}>
                                                                <Link to={item.link}>{item.text}</Link>
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="footer-item our-address">
                                <div className="footer-inner">
                                    <div className="footer-content">
                                        <div className="title">
                                            <h4>{quickTitle}</h4>
                                        </div>
                                        <div className="content">
                                            <ul className="lab-ul office-address">
                                                {
                                                    quickList.map((item, index) => {
                                                        return (
                                                            <li key={index}>
                                                                <Link to={item.link}>{item.text}</Link>
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
        </>
    );
};

export default Footer;