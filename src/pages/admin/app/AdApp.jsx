import AdSidebar from "./AdSidebar";
import AdLogoHeader from "./AdLogoHeader";
import AdNavbarHeader from "./AdNavbarHeader";
import {Outlet} from "react-router-dom";

const AdApp = (props) => {
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
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdApp;