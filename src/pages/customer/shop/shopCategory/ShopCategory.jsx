import React, {useState} from 'react';
import {Spin} from "antd";
import {FaAngleDown, FaAngleUp} from "react-icons/fa6";
import "./shopCategory.scss";

const ShopCategory = ({filterItem, menuItems, selectedItems, loading}) => {

    const [isExpanded, setIsExpanded] = useState(true);

    const handleSelection = (categoryId) => {
        if (selectedItems.includes(categoryId)) {
            filterItem(selectedItems.filter((item) => item !== categoryId));
        } else {
            filterItem([...selectedItems, categoryId]);
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
                <span className="filter-title">BỘ SƯU TẬP</span>
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
                                menuItems.map((category, index) => {
                                    return (
                                        <button
                                            className={`menu-item m-2 fs-5  ${selectedItems.includes(category.id) ? "bg-primary text-white" : ""}`}
                                            key={index}
                                            onClick={() => handleSelection(category.id)}>
                                            {category.name} ({category.productCount})
                                        </button>
                                    )
                                })
                            ) : (
                                <div className="ms-2 text-danger fs-5">
                                    Không có bộ sưu tập nào khả dụng!
                                </div>
                            )
                    }
                </div>
            </div>
            <hr/>
        </div>
    );
};

export default ShopCategory;