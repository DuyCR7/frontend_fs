import React from 'react';
import {Link} from "react-router-dom";

const btnText = "Sign up for Free";
const title = "Shop Anytime, Anywhere";
const desc = "Take shop on your device with our app & learn all time what you want. Just download & install & start to learn"

const AppSection = () => {
    return (
        <div className="app-section padding-tb">
            <div className="container-fluid ps-5 pe-5">
                <div className="section-header text-center">
                    <Link to="/sign-up" className="lab-btn mb-4">{btnText}</Link>
                    <h2 className="title">{title}</h2>
                    <p>{desc}</p>
                </div>

                <div className="section-wrapper">
                    <ul className="lab-ul">
                        <li><a href="#"><img src="/admin/assets/img/examples/example1.jpeg" alt="" style={{width: "237px", height: "88px"}}/></a></li>
                        <li><a href="#"><img src="/admin/assets/img/examples/example1.jpeg" alt="" style={{width: "237px", height: "88px"}}/></a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AppSection;