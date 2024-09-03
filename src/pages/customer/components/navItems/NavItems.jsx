import React, {useEffect, useRef, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import "./navItems.scss";
import {useDispatch, useSelector} from "react-redux";
import {logoutCustomer} from "../../../../services/customer/authService";
import {resetCustomer, updateCartCount, updateWishListCount} from "../../../../redux/customer/slices/customerSlice";
import {toast} from "react-toastify";
import {IoCartOutline, IoCloseOutline, IoHeartOutline, IoSearchOutline} from "react-icons/io5";
import useDebounce from "../../../../utils/useDebounce";
import {getAllForSearch} from "../../../../services/customer/homeService";

const NavItems = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const customer = useSelector((state) => state.customer);

    const handleLogout = async () => {
        try {
            let data = await logoutCustomer(); // clear cookie
            if (data && data.EC === 0) {
                localStorage.removeItem("cus_jwt"); // clear local storage
                dispatch(resetCustomer());
                dispatch(updateCartCount(0));
                dispatch(updateWishListCount(0));

                toast.success(data.EM);
                // navigate('/');
            } else {
                toast.error(data.EM);
            }
        } catch (error) {
            console.log("Error: ", error);
            toast.error(error);
        }
    }

    const [menuToggle, setMenuToggle] = useState(false);
    const [headerFixed, setHeaderFixed] = useState(false);

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const searchInputRef = useRef(null);

    const toggleSearch = () => {
        setMenuToggle(false);
        setIsSearchOpen(!isSearchOpen);
        if (!isSearchOpen) {
            setTimeout(() => searchInputRef.current?.focus(), 100);
        } else {
            setSearchQuery('');
            setSearchResults([]);
        }
    };

    const debouncedSearchInput = useDebounce(searchQuery, 500);

    const fetchAllForSearch = async (search) => {
        try {
            let res = await getAllForSearch(search.trim());
            if (res && res.EC === 0) {
                setSearchResults(res.DT);
            } else {
                setSearchResults([]);
                console.log("Error: ", res.EM);
            }
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        if (debouncedSearchInput) {
            fetchAllForSearch(debouncedSearchInput);
        } else {
            setSearchResults([]);
        }
    }, [debouncedSearchInput]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault();
    };

    // addevent listeners
    window.addEventListener("scroll", () => {
        if (window.scrollY > 150) {
            setHeaderFixed(true);
        } else {
            setHeaderFixed(false);
        }
    })

    return (
        <>
            <header className={`header-section style-4 ${headerFixed ? "header-fixed fadeInUp" : ""}`}>
                {/* header bottom */}
                <div className="header-bottom">
                    <div className="container-fluid ps-5 pe-5">
                        <div className="header-wrapper">
                            {/* logo */}
                            <div className="logo-search-acte">
                                <div className="logo" title='Trang chủ'>
                                    <Link to={"/"} onClick={() => {
                                        setIsSearchOpen(false);
                                        setSearchQuery('');
                                        setSearchResults([]);
                                    }}>
                                        <img src="/admin/assets/img/kaiadmin/cus_logo_dark.png" alt="" width={70}/>
                                    </Link>
                                </div>
                            </div>

                            {/* menu area */}
                            <div className="menu-area">
                                <div className="menu">
                                    <ul className={`lab-ul ${menuToggle ? "active" : ""}`}>
                                        <li><Link to="/" onClick={() => {
                                            setMenuToggle(false);
                                            setIsSearchOpen(false);
                                            setSearchQuery('');
                                            setSearchResults([]);
                                        }}>Trang chủ</Link></li>
                                        <li><Link to="/shops" onClick={() => {
                                            setMenuToggle(false);
                                            setIsSearchOpen(false);
                                            setSearchQuery('');
                                            setSearchResults([]);
                                        }}>Cửa hàng</Link></li>
                                        <li><Link to="/contacts" onClick={() => {
                                            setMenuToggle(false);
                                            setIsSearchOpen(false);
                                            setSearchQuery('');
                                            setSearchResults([]);
                                        }}>Liên hệ</Link>
                                        </li>
                                        <li className="d-flex wish-cart flex-wrap ms-lg-3 ms-0" style={{}}>
                                            <Link title="Yêu thích" to="/wish-list" className={'count-icon'}
                                                  onClick={() => {
                                                      setMenuToggle(false);
                                                      setIsSearchOpen(false);
                                                      setSearchQuery('');
                                                      setSearchResults([]);
                                                  }} style={{padding: "15px 5px"}}>
                                                {/*<i className="icofont-heart" style={{fontSize: '1.5rem'}}></i>*/}
                                                <IoHeartOutline size={20}/>
                                                {
                                                    customer && customer.isAuthenticated ? (
                                                        <span>{customer.wishListCount}</span>
                                                    ) : (
                                                        <span>0</span>
                                                    )
                                                }
                                            </Link>
                                            <Link title="Giỏ hàng" to="/carts" className={'count-icon'}
                                                  onClick={() => {
                                                      setMenuToggle(false);
                                                      setIsSearchOpen(false);
                                                      setSearchQuery('');
                                                      setSearchResults([]);
                                                  }}
                                                  style={{padding: "15px 5px", marginLeft: "5px"}}>
                                                {/*<i className="icofont-cart" style={{fontSize: '1.5rem'}}></i>*/}
                                                <IoCartOutline size={20}/>
                                                {
                                                    customer && customer.isAuthenticated ? (
                                                        <span>{customer.cartCount}</span>
                                                    ) : (
                                                        <span>0</span>
                                                    )
                                                }
                                            </Link>
                                        </li>
                                    </ul>
                                </div>

                                <div className={'search-home-icon'} onClick={toggleSearch}>
                                    <IoSearchOutline size={20}/>
                                </div>

                                {
                                    customer && customer.isAuthenticated ?
                                        <>
                                            <div className="cus-dropdown dropdown ms-1 mb-0">
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
                                                    <li>
                                                        <button className="dropdown-item" style={{
                                                            fontSize: "13px",
                                                            fontWeight: "400",
                                                            fontFamily: "Public San, sans-serif"
                                                        }} onClick={() => handleLogout()}>Đăng xuất
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </>
                                        :
                                        <>
                                            <Link to={'/sign-in'}
                                                  style={{fontSize: "16px", color: "rgb(24, 119, 242)"}}>Sign
                                                In</Link>
                                        </>
                                }

                                {/*menu toggle*/}
                                <div onClick={() => {
                                    setMenuToggle(!menuToggle);
                                    setIsSearchOpen(false);
                                    setSearchQuery('');
                                    setSearchResults([]);
                                }}
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

            <div className={`search-overlay ${isSearchOpen ? 'open' : ''}`} onClick={toggleSearch}></div>
            <div className={`search-container ${isSearchOpen ? 'open' : ''}`}>
                <div className="search-bar">
                    <form onSubmit={handleSearchSubmit}>
                        <IoSearchOutline className="search-icon"/>
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="search-input"
                        />
                        <IoCloseOutline className="close-icon" onClick={toggleSearch}/>
                    </form>
                    {searchResults.length > 0 && (
                        <div className="search-results">
                            {searchResults.map((result) => (
                                <Link to={`/products/${result.slug}`} onClick={toggleSearch} key={result.id}
                                      className="search-result-item">
                                    <div className="result-name">

                                        <img
                                            src={`${process.env.REACT_APP_URL_BACKEND}/${result.Product_Images[0].image}`}
                                            alt={`${process.env.REACT_APP_URL_BACKEND}/${result.Product_Images[0].image}`}
                                            style={{width: "30px", height: "30px"}} className="me-3"/>
                                        <span>{result.name}</span>

                                    </div>
                                    <span className="result-type">{result.Category.name}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default NavItems;