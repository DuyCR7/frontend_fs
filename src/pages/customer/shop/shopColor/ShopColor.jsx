import React, {useState} from 'react';
import {Spin} from "antd";
import {FaAngleDown, FaAngleUp} from "react-icons/fa6";
import "./shopColor.scss";

const ShopColor = ({filterItem, menuItems, selectedItems, loading}) => {

    const [isExpanded, setIsExpanded] = useState(true);

    const handleSelection = (colorId) => {
        if (selectedItems.includes(colorId)) {
            filterItem(selectedItems.filter((item) => item !== colorId));
        } else {
            filterItem([...selectedItems, colorId]);
        }
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    if (menuItems.length === 0 && !loading) {
        return null;
    }

    return (
        <div className={`color-filter ${isExpanded ? 'expanded' : ''}`}>
            <div className="filter-header" onClick={toggleExpand}>
                <span className="filter-title">MÀU SẮC</span>
                <span className="toggle-icon">{isExpanded ? <FaAngleUp/> : <FaAngleDown/>}</span>
            </div>
            <div className="filter-content">
                <div className="filter-options">
                    {
                        loading ? (
                                <div className="d-flex justify-content-center align-items-center">
                                    <Spin size="small"/>
                                </div>
                            )
                            :
                            menuItems.length > 0 ? (
                                menuItems.map((color, index) => {
                                    return (
                                        <button
                                            className={`menu-item m-2 fs-5 ${selectedItems.includes(color.id) ? "bg-primary text-white" : ""}`}
                                            key={color.id}
                                            onClick={() => handleSelection(color.id)}>
                                            {color.name} ({color.productCount})
                                        </button>
                                    )
                                })
                            ) : (
                                <div className="ms-2 text-danger fs-5">
                                    Không có màu sắc nào khả dụng!
                                </div>
                            )
                    }
                </div>
            </div>
            <hr/>
        </div>
    );
};

export default ShopColor;