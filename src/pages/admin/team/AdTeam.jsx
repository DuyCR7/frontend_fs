import React, {useState} from 'react';
import AdModalTeam from "./AdModalTeam";

const AdTeam = () => {

    const [isShowModalTeam, setIsShowModalTeam] = useState(false);

    const handleCloseModalTeam = () => {
        setIsShowModalTeam(false);
    }

    return (
        <>
            <div className="page-inner">
                <button
                    className="btn btn-primary"
                    onClick={() => setIsShowModalTeam(true)}
                >
                    Thêm đội bóng
                </button>
            </div>

            <AdModalTeam
                isShowModalTeam={isShowModalTeam}
                handleCloseModalTeam={handleCloseModalTeam}
            />
        </>
    );
};

export default AdTeam;