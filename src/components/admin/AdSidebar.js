import { Link } from "react-router-dom";

const AdSidebar = (props) => {
    return (
        <>
            {/*AdSidebar*/}
            <div className="sidebar" data-background-color="dark">
                <div className="sidebar-logo">
                    {/*Logo Header*/}
                    <div className="logo-header" data-background-color="dark">
                        <Link to={"/admin"} className="logo">
                            <img
                                src="/admin/assets/img/kaiadmin/logo.png"
                                alt="navbar brand"
                                className="navbar-brand"
                                height={60}
                                width={73}
                            />
                        </Link>
                        <div className="nav-toggle">
                            <button className="btn btn-toggle toggle-sidebar">
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
                            <li className="nav-item active">
                                <a
                                    data-bs-toggle="collapse"
                                    href="#dashboard"
                                    className="collapsed"
                                    aria-expanded="false"
                                >
                                    <i className="fas fa-home"></i>
                                    <p>Dashboard</p>
                                    <span className="caret"></span>
                                </a>
                                <div className="collapse" id="dashboard">
                                    <ul className="nav nav-collapse">
                                        <li>
                                            <a href="../demo1/index.html">
                                                <span className="sub-item">Dashboard 1</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className="nav-section">
                                <span className="sidebar-mini-icon">
                                  <i className="fa fa-ellipsis-h"></i>
                                </span>
                                <h4 className="text-section">Components</h4>
                            </li>
                            <li className="nav-item">
                                <a data-bs-toggle="collapse" href="#sidebarLayouts">
                                    <i className="fas fa-th-list"></i>
                                    <p>Sidebar Layouts</p>
                                    <span className="caret"></span>
                                </a>
                                <div className="collapse" id="sidebarLayouts">
                                    <ul className="nav nav-collapse">
                                        <li>
                                            <a href="sidebar-style-2.html">
                                                <span className="sub-item">Sidebar Style 2</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="icon-menu.html">
                                                <span className="sub-item">Icon Menu</span>
                                            </a>
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