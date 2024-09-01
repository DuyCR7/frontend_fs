import React, {useState} from 'react';
import {Spin} from "antd";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import "./shopTeam.scss";

const ShopTeam = ({filterItem, menuItems, selectedItems, loading}) => {

    const [isExpanded, setIsExpanded] = useState(true);

    const handleSelection = (teamId) => {
        if (selectedItems.includes(teamId)) {
            filterItem(selectedItems.filter((item) => item !== teamId));
        } else {
            filterItem([...selectedItems, teamId]);
        }
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    if (menuItems.length === 0 && !loading) {
        return null;
    }

    return (
        <div className={`team-filter ${isExpanded ? 'expanded' : ''}`}>
            <div className="filter-header" onClick={toggleExpand}>
                <span className="filter-title">ĐỘI BÓNG</span>
                <span className="toggle-icon">{isExpanded ? <FaAngleUp/> : <FaAngleDown/>}</span>
            </div>
            <div className="filter-content">
                <div className="filter-options">
                    {loading ? (
                        <div className="d-flex justify-content-center align-items-center">
                            <Spin size="small"/>
                        </div>
                    ) : menuItems.length > 0 ? (
                        menuItems.map((team, index) => (
                            <button
                                className={`menu-item m-2 fs-5 ${selectedItems.includes(team.id) ? "bg-primary text-white" : ""}`}
                                key={index}
                                onClick={() => handleSelection(team.id)}
                            >
                                {team.name} ({team.productCount})
                            </button>
                        ))
                    ) : (
                        <div className="ms-2 text-danger fs-5">
                            Không có đội bóng nào khả dụng!
                        </div>
                    )}
                </div>
            </div>
            <hr/>
        </div>
    );
};

export default ShopTeam;