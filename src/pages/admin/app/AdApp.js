import AdSidebar from "./AdSidebar";
import AdLogoHeader from "./AdLogoHeader";
import AdNavbarHeader from "./AdNavbarHeader";
import AdDashboard from "../dashboard/AdDashboard";
import {useSelector} from "react-redux";
import {Outlet, useNavigate} from "react-router-dom";
import {useEffect} from "react";

const AdApp = (props) => {

    const navigate = useNavigate();
    const user = useSelector((state) => state.user);

    useEffect(() => {
        if (!user.isAuthenticated){
            navigate('/admin/sign-in');
        }
    }, []);

    return (
        <>
            <div className="wrapper">
                <AdSidebar/>

                <div className="main-panel">
                    <div className="main-header">

                        <AdLogoHeader/>

                        <AdNavbarHeader/>

                    </div>

                    <div className="container">
                        {/*<AdDashboard/>*/}
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdApp;