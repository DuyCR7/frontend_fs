import {Link, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";

const AdSidebar = (props) => {

    const location = useLocation();
    const [activeItem, setActiveItem] = useState(null);
    const [activeGroup, setActiveGroup] = useState(null);

    useEffect(() => {
        console.log(location.pathname);
        const path = location.pathname;
        if (path.includes("/admin/categories")) {
            setActiveItem("categories");
            setActiveGroup("manageProducts");
        } else if (path.includes("/admin/teams")) {
            setActiveItem("teams");
            setActiveGroup("manageProducts");
        } else if (path.includes("/admin/sizes-colors")) {
            setActiveItem("sizes-colors");
            setActiveGroup("manageProducts");
        } else if (path.includes("/admin/products")) {
            setActiveItem("products");
            setActiveGroup("manageProducts");
        } else if (path.includes('/admin/banners')) {
            setActiveItem("banners");
            setActiveGroup(null);
        } else if (path.includes('/admin/events')) {
            setActiveItem("events");
            setActiveGroup(null);
        } else if (path.includes("/admin")) {
            setActiveItem("dashboard");
            setActiveGroup(null);
        } else {
            setActiveItem(null);
            setActiveGroup(null);
        }
    }, [location]);

    return (
        <>
            {/*AdSidebar*/}
            <div className="sidebar" data-background-color="dark">
                <div className="sidebar-logo">
                    {/*Logo Header*/}
                    <div className="logo-header" data-background-color="dark">
                        <Link to={"/admin"} className="logo">
                            <img
                                src="/admin/assets/img/kaiadmin/cus_logo_light.png"
                                alt="navbar brand"
                                className="navbar-brand"
                                height={60}
                                width={73}
                            />
                        </Link>
                        <div className="nav-toggle">
                            <button className="btn btn-toggle toggle-sidebar"
                                    style={{height: "40px", border: "none"}}>
                                <i className="gg-menu-right"></i>
                            </button>
                            <button className="btn btn-toggle sidenav-toggler">
                                <i className="gg-menu-left"></i>
                            </button>
                        </div>
                        <button className="topbar-toggler more">
                            <i className="gg-more-vertical-alt"></i>
                        </button>
                    </div>
                    {/*End Logo Header*/}
                </div>
                <div className="sidebar-wrapper scrollbar scrollbar-inner">
                    <div className="sidebar-content">
                        <ul className="nav nav-secondary">
                            <li className={`nav-item ${activeItem === "dashboard" ? "active" : ""}`}>
                                <Link
                                    to="/admin"
                                >
                                    <i className="fas fa-home"></i>
                                    <p>Trang chủ</p>
                                </Link>
                            </li>
                            <li className={`nav-item ${activeItem === "banners" ? "active" : ""}`}>
                                <Link to='/admin/banners'>
                                    <i className="fas fa-layer-group"></i>
                                    <p>Quản lý banner</p>
                                </Link>
                            </li>
                            <li className={`nav-item ${activeItem === "events" ? "active" : ""}`}>
                                <Link to='/admin/events'>
                                    <i className="fas fa-calendar"></i>
                                    <p>Quản lý sự kiện</p>
                                </Link>
                            </li>
                            {/*<li className="nav-section">*/}
                            {/*    <span className="sidebar-mini-icon">*/}
                            {/*      <i className="fa fa-ellipsis-h"></i>*/}
                            {/*    </span>*/}
                            {/*    <h4 className="text-section">Components</h4>*/}
                            {/*</li>*/}
                            <li className={`nav-item ${activeGroup === "manageProducts" ? "active" : ""}`}>
                                <a data-bs-toggle="collapse" href="#manageProducts">
                                    <i className="fas fa-th-large"></i>
                                    <p>Quản lý sản phẩm</p>
                                    <span className="caret"></span>
                                </a>
                                <div className={`collapse ${activeGroup === "manageProducts" ? "show" : ""}`}
                                     id="manageProducts">
                                    <ul className="nav nav-collapse">
                                        <li className={`${activeItem === "categories" ? "active" : ""}`}>
                                            <Link to="/admin/categories">
                                                <span className="sub-item">Danh mục</span>
                                            </Link>
                                        </li>
                                        <li className={`${activeItem === "teams" ? "active" : ""}`}>
                                            <Link to="/admin/teams">
                                                <span className="sub-item">Đội bóng</span>
                                            </Link>
                                        </li>
                                        <li className={`${activeItem === "sizes-colors" ? "active" : ""}`}>
                                            <Link to="/admin/sizes-colors">
                                                <span className="sub-item">Màu sắc - Size</span>
                                            </Link>
                                        </li>
                                        <li className={`${activeItem === "products" ? "active" : ""}`}>
                                            <Link to="/admin/products">
                                                <span className="sub-item">Sản phẩm</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className="nav-item">
                                <a data-bs-toggle="collapse" href="#submenu">
                                    <i className="fas fa-bars"></i>
                                    <p>Menu Levels</p>
                                    <span className="caret"></span>
                                </a>
                                <div className="collapse" id="submenu">
                                    <ul className="nav nav-collapse">
                                        <li>
                                            <a data-bs-toggle="collapse" href="#subnav1">
                                                <span className="sub-item">Level 1</span>
                                                <span className="caret"></span>
                                            </a>
                                            <div className="collapse" id="subnav1">
                                                <ul className="nav nav-collapse subnav">
                                                    <li>
                                                        <a href="#">
                                                            <span className="sub-item">Level 2</span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">
                                                            <span className="sub-item">Level 2</span>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </li>
                                        <li>
                                            <a data-bs-toggle="collapse" href="#subnav2">
                                                <span className="sub-item">Level 1</span>
                                                <span className="caret"></span>
                                            </a>
                                            <div className="collapse" id="subnav2">
                                                <ul className="nav nav-collapse subnav">
                                                    <li>
                                                        <a href="#">
                                                            <span className="sub-item">Level 2</span>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <span className="sub-item">Level 1</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            {/*End AdSidebar*/}
        </>
    )
}

export default AdSidebar;