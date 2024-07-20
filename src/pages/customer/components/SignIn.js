import React, {useState} from 'react';
import {Link} from "react-router-dom";

const title = "Sign In";
const socialTitle = "Login with CR7 Shop"
const btnText = "Sign In"

const socialList = [{iconName: 'icofont-facebook', siteLink: '#', className: 'facebook',}, {
    iconName: 'icofont-twitter',
    siteLink: '#',
    className: 'twitter',
}, {iconName: 'icofont-linkedin', siteLink: '#', className: 'linkedin',}, {
    iconName: 'icofont-instagram',
    siteLink: '#',
    className: 'instagram',
}, {iconName: 'icofont-pinterest', siteLink: '#', className: 'pinterest',},]

const SignIn = () => {

    const [errorMsg, setErrorMsg] = useState("");
    const handleLogin = (e) => {
        e.preventDefault();
    }

    return (
        <div>
            <div className="login-section padding-tb section-bg">
                <div className="container">
                    <div className="account-wrapper">
                        <h3 className="title">{title}</h3>
                        <form className="account-form" onSubmit={handleLogin}>
                            <div className="form-group">
                                <input type="email" id="email" placeholder="Email Address *" required/>
                            </div>
                            <div className="form-group">
                                <input type="password" id="password" placeholder="Password *" required/>
                            </div>

                            {/*message*/}
                            <div>
                                {
                                    errorMsg && (
                                        <div className="error-message text-danger mb-1">
                                            {errorMsg}
                                        </div>
                                    )
                                }
                            </div>

                            <div className="form-group">
                                <div className="d-flex justify-content-between flex-wrap pt-sm-2">
                                    <div className="checkgroup">
                                        <input type="checkbox" name="remember" id="remember"/>
                                        <label htmlFor="remember">Remember Me</label>
                                    </div>
                                    <Link to="/forgot-password">Forgot Password?</Link>
                                </div>
                            </div>
                            <div className="form-group">
                                <button type="submit" className="d-block lab-btn">
                                    <span>{btnText}</span>
                                </button>
                            </div>
                        </form>

                        {/*account bottom*/}
                        <div className="account-bottom">
                            <span className="d-block cate pt-10">
                                Don't have an account? <Link to="/sign-up">Sign Up</Link>
                            </span>
                            <span className="or">
                                <span>OR</span>
                            </span>

                            {/*social login*/}
                            <h5 className="subtitle">{socialTitle}</h5>
                            <ul className="lab-ul social-icons justify-content-center">
                                <li>
                                    <button className="github"><i className="icofont-github"></i></button>
                                </li>
                                <li>
                                    <a href="#" className="facebook"><i className="icofont-facebook"></i></a>
                                </li>
                                <li>
                                    <a href="#" className="twitter"><i className="icofont-twitter"></i></a>
                                </li>
                                <li>
                                    <a href="#" className="linkedin"><i className="icofont-linkedin"></i></a>
                                </li>
                                <li>
                                    <a href="#" className="instagram"><i className="icofont-instagram"></i></a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;