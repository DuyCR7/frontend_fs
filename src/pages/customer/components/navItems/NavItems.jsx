import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import "./navItems.scss";
import {useDispatch, useSelector} from "react-redux";
import {logoutCustomer} from "../../../../services/customer/authService";
import {resetCustomer} from "../../../../redux/customer/slices/customerSlice";
import {toast} from "react-toastify";

const NavItems = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const customer = useSelector((state) => state.customer);

    const handleLogout = async () => {
        try {
            let data = await logoutCustomer(); // clear cookie
            // logoutContext(); // clear user in context
            if (data && data.EC === 0) {
                localStorage.removeItem("cus_jwt"); // clear local storage
                dispatch(resetCustomer());

                toast.success(data.EM);
                navigate('/sign-in');
            } else {
                toast.error(data.EM);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    const [menuToggle, setMenuToggle] = useState(false);
    const [headerFixed, setHeaderFixed] = useState(false);

    // addevent listeners
    window.addEventListener("scroll", () => {
        if (window.scrollY > 150) {
            setHeaderFixed(true);
        } else {
            setHeaderFixed(false);
        }
    })

    return (
        <header className={`header-section style-4 ${headerFixed ? "header-fixed fadeInUp" : ""}`}>
            {/* header bottom */}
            <div className="header-bottom">
                <div className="container-fluid ps-5 pe-5">
                    <div className="header-wrapper">
                        {/* logo */}
                        <div className="logo-search-acte">
                            <div className="logo" title='Trang chủ'>
                                <Link to={"/"}>
                                    <img src="/admin/assets/img/kaiadmin/cus_logo_dark.png" alt="" width={70}/>
                                </Link>
                            </div>
                        </div>

                        {/* menu area */}
                        <div className="menu-area">
                            <div className="menu">
                                <ul className={`lab-ul ${menuToggle ? "active" : ""}`}>
                                    <li><Link to="/" onClick={() => setMenuToggle(false)}>Trang chủ</Link></li>
                                    <li><Link to="/shop" onClick={() => setMenuToggle(false)}>Cửa hàng</Link></li>
                                    <li><Link to="/blog" onClick={() => setMenuToggle(false)}>Bài viết</Link></li>
                                    <li><Link to="/about" onClick={() => setMenuToggle(false)}>Về chúng tôi</Link></li>
                                    <li><Link to="/contact" onClick={() => setMenuToggle(false)}>Liên hệ</Link></li>
                                    <li className="d-flex wish-cart flex-wrap ms-lg-3 ms-0" style={{}}>
                                        <Link title="Yêu thích" to="/wish-list" className={'count-icon'}
                                              onClick={() => setMenuToggle(false)} style={{padding: "15px 5px"}}>
                                            <i className="icofont-heart" style={{fontSize: '1.5rem'}}></i>
                                            <span>2</span>
                                        </Link>
                                        <Link title="Giỏ hàng" to="/cart-page" className={'count-icon'}
                                              onClick={() => setMenuToggle(false)} style={{padding: "15px 5px"}}>
                                            <i className="icofont-cart" style={{fontSize: '1.5rem'}}></i>
                                            <span>5</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            {
                                customer && customer.isAuthenticated ?
                                    <>
                                        <div className="cus-dropdown dropdown ms-1 mb-0 mb-lg-2">
                                            <a className="btn dropdown-toggle" href="#" role="button"
                                               id="dropdownMenuLink"
                                               data-bs-toggle="dropdown" aria-expanded="false">
                                                <img src={customer.image} alt="Avatar"
                                                     className="rounded-circle"
                                                     style={{width: "40px", height: "40px", objectFit: "cover"}}/>
                                            </a>
                                            <ul className="dropdown-menu dropdown-menu-end"
                                                aria-labelledby="dropdownMenuLink">
                                                <li><Link className="dropdown-item" to="/">Đơn mua</Link></li>
                                                <li>
                                                    <div className="dropdown-divider"></div>
                                                </li>
                                                <li><Link className="dropdown-item" to="/">Thông tin</Link></li>
                                                <li>
                                                    <div className="dropdown-divider"></div>
                                                </li>
                                                <li><button className="dropdown-item" style={{fontSize: "13px", fontWeight: "400", fontFamily: "Public San, sans-serif"}} onClick={() => handleLogout()}>Đăng xuất</button></li>
                                            </ul>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <Link to={'/sign-in'} style={{fontSize: "16px", color: "rgb(24, 119, 242)"}}>Sign In</Link>
                                    </>
                            }

                            {/*menu toggle*/}
                            <div onClick={() => setMenuToggle(!menuToggle)}
                                 className={`header-bar ${menuToggle ? "active" : ""}`}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default NavItems;