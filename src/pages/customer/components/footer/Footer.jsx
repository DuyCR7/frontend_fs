import React from 'react';
import {Link} from "react-router-dom";
import Sponsor from "../../home/sponsor/Sponsor";

const title = "Liên hệ chúng tôi";
const desc = "CR7 Shop";
const ItemTitle = "Mua sắm với chúng tôi";
const quickTitle = "Liên kết nhanh";
const tweetTitle = "Recent Tweets";

const addressList = [
    {
        iconName: 'icofont-google-map',
        text: 'Ngõ 389 phố Vọng, Hai Bà Trưng',
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
        link: '#',
    },
    {
        text: 'Chính sách bảo mật',
        link: '#',
    },
    {
        text: 'Chính sách hoàn tiền',
        link: '#',
    },
    {
        text: 'Vận chuyển',
        link: '#',
    }
]

const quickList = [
    {
        text: 'Về',
        link: '#',
    },
    {
        text: 'Bài viết',
        link: '#',
    },
    {
        text: 'Liên hệ',
        link: '#',
    },
    {
        text: "FAQ's",
        link: '#',
    },
]

const tweetList = [
    {
        iconName: 'icofont-twitter',
        desc: <p>Aminur islam <a href="#">@ShopCart Greetings!  #HTML_Template</a> Grab your item, 50% Big Sale Offer !!</p>,
    },
    {
        iconName: 'icofont-twitter',
        desc: <p>Somrat islam <a href="#">@ShopCart Hey! #HTML_Template</a> Grab your item, 50% Big Sale Offer !!</p>,
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
                                                                <a href="#">{item.text}</a>
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
                                                                <a href="#">{item.text}</a>
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