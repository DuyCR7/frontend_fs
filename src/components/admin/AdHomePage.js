import AdSidebar from "./AdSidebar";
import AdLogoHeader from "./AdLogoHeader";
import AdNavbarHeader from "./AdNavbarHeader";
import AdContent from "./AdContent";

const AdHomePage = (props) => {
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
                        <AdContent/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdHomePage;