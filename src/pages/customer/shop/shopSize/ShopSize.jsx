import React, {useState} from 'react';
import {Spin} from "antd";
import {FaAngleDown, FaAngleUp} from "react-icons/fa6";
import "./shopSize.scss";

const ShopSize = ({filterItem, menuItems, selectedItems, loading}) => {

    const [isExpanded, setIsExpanded] = useState(true);

    const handleSelection = (sizeId) => {
        if (selectedItems.includes(sizeId)) {
            filterItem(selectedItems.filter((item) => item !== sizeId));
        } else {
            filterItem([...selectedItems, sizeId]);
        }
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    if (menuItems.length === 0 && !loading) {
        return null;
    }

    return (
        <div className={`size-filter ${isExpanded ? 'expanded' : ''}`}>
            <div className="filter-header" onClick={toggleExpand}>
                <span className="filter-title">SIZE</span>
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
                                menuItems.map((size, index) => {
                                    return (
                                        <button
                                            className={`menu-item m-2 fs-5  ${selectedItems.includes(size.id) ? "bg-primary text-white" : ""}`}
                                            key={index}
                                            onClick={() => handleSelection(size.id)}>
                                            {size.code} ({size.productCount})
                                        </button>
                                    )
                                })
                            ) : (
                                <div className="ms-2 text-danger fs-5">
                                    Không có kích cỡ nào khả dụng!
                                </div>
                            )
                    }
                </div>
            </div>
            <hr/>
        </div>
    );
};

export default ShopSize;