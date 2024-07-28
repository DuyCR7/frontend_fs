import {Link} from "react-router-dom";

const AdLogoHeader = (props) => {
    return (
        <>
            <div className="main-header-logo">
                {/*Logo Header*/}
                <div className="logo-header" data-background-color="dark">
                    <Link to="/admin" className="logo">
                        <img
                            src="/admin/assets/img/kaiadmin/cus_logo_light.png"
                            alt="navbar brand"
                            className="navbar-brand"
                            height="60"
                            width="73"
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
        </>
    )
}

export default AdLogoHeader;