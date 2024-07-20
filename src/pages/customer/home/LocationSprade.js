import React from 'react';
import {Link} from "react-router-dom";

const title = "More Then 60,000 Customers";

const desc = "Buy products on your any device with our app & enjoy your time what you want. Just download & install & start to shopping";

const clientsList = [
    {
        imgUrl: '/admin/assets/img/examples/example1.jpeg',
        imgAlt: 'education thumb rajibraj91 rajibraj',
        text: 'Join with Us',
    },
    {
        imgUrl: '/admin/assets/img/examples/example1.jpeg',
        imgAlt: 'education thumb rajibraj91 rajibraj',
        text: 'Join with Us',
    },
    {
        imgUrl: '/admin/assets/img/examples/example1.jpeg',
        imgAlt: 'education thumb rajibraj91 rajibraj',
        text: 'Join with Us',
    },
    {
        imgUrl: '/admin/assets/img/examples/example1.jpeg',
        imgAlt: 'education thumb rajibraj91 rajibraj',
        text: 'Join with Us',
    },
    {
        imgUrl: '/admin/assets/img/examples/example1.jpeg',
        imgAlt: 'education thumb rajibraj91 rajibraj',
        text: 'Join with Us',
    },
    {
        imgUrl: '/admin/assets/img/examples/example1.jpeg',
        imgAlt: 'education thumb rajibraj91 rajibraj',
        text: 'Join with Us',
    },
    {
        imgUrl: '/admin/assets/img/examples/example1.jpeg',
        imgAlt: 'education thumb rajibraj91 rajibraj',
        text: 'From Viet Nam',
    },
]

const LocationSprade = () => {
    return (
        <div className="clients-section style-2 padding-tb">
            <div className="container-fluid ps-5 pe-5">
                <div className="section-header text-center">
                    <h2 className="title">{title}</h2>
                    <p>{desc}</p>
                </div>

                {/*main content*/}
                <div className="section-wrapper">
                    <div className="clients">
                        {
                            clientsList.map((item, index) => (
                                <div key={index} className="client-list">
                                    <Link to="/sign-up" className="client-content">
                                        <span>{item.text}</span>
                                    </Link>
                                    <div className="client-thumb">
                                        <img src={item.imgUrl} alt=""/>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationSprade;