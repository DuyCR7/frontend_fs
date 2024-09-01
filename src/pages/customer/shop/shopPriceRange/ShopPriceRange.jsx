import React, {useState, useEffect, useCallback} from 'react';
import Slider from 'react-slider';
import "./shopPriceRange.scss";
import {formatCurrency} from "../../../../utils/formatCurrency";
import {Spin} from "antd";
import {FaAngleDown, FaAngleUp} from "react-icons/fa6";

const ShopPriceRange = ({ onPriceChange, minPrice, maxPrice, currentRange }) => {

    const [isExpanded, setIsExpanded] = useState(true);
    const [priceRange, setPriceRange] = useState(currentRange);
// console.log(minPrice, maxPrice, currentRange);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        if (minPrice !== null && maxPrice !== null) {
            setPriceRange([
                currentRange[0] === null ? minPrice : currentRange[0],
                currentRange[1] === null ? maxPrice : currentRange[1]
            ]);
        }
    }, [minPrice, maxPrice, currentRange]);

    const handleChange = useCallback((newValues) => {
        setPriceRange(newValues);
    }, []);

    const handleAfterChange = useCallback((newValues) => {
        onPriceChange(newValues);
    }, [onPriceChange]);

    if (minPrice === null || maxPrice === null) {
        return (
            <div className="shop-price-range widget-header text-center">
                <Spin spinning={true}/>
            </div>
        );
    }

    return (
        <div className={`shop-price-range ${isExpanded ? 'expanded' : ''}`}>
            <div className="filter-header" onClick={toggleExpand}>
                <span className="filter-title">GIÁ</span>
                <span className="toggle-icon">{isExpanded ? <FaAngleUp/> : <FaAngleDown/>}</span>
            </div>
            <div className="filter-content">
                <div className="filter-options">
                    <Slider
                        className={"slider"}
                        onChange={handleChange}
                        onAfterChange={handleAfterChange}
                        value={priceRange}
                        min={minPrice}
                        max={maxPrice}
                    />
                    <div className="mt-4">
                        Giá: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopPriceRange;