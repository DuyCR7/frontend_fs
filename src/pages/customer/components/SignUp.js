import React, {useState} from 'react';
import {Link} from "react-router-dom";

const title = "Sign Up";
const socialTitle = "Sign Up with CR7 Shop"
const btnText = "Sign Up"

const SignUp = () => {

    const [errorMsg, setErrorMsg] = useState("");
    const handleSignUp = (e) => {
        e.preventDefault();
    }

    return (
        <div>
            <div className="login-section padding-tb section-bg">
                <div className="container">
                    <div className="account-wrapper">
                        <h3 className="title">{title}</h3>
                        <form className="account-form" onSubmit={handleSignUp}>
                            <div className="form-group">
                                <input type="email" id="email" placeholder="Email Address *" required/>
                            </div>
                            <div className="form-group">
                                <input type="password" id="password" placeholder="Password *" required/>
                            </div>
                            <div className="form-group">
                                <input type="password" id="cf-password" placeholder="Confirm Password *" required/>
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
                                <button type="submit" className="d-block lab-btn">
                                    <span>{btnText}</span>
                                </button>
                            </div>
                        </form>

                        {/*account bottom*/}
                        <div className="account-bottom">
                            <span className="d-block cate pt-10">
                                Have an account? <Link to="/sign-in">Sign In</Link>
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

export default SignUp;