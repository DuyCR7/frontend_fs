import React, { useState, useEffect } from 'react';
import Slider from 'react-slider';
import "./shopPriceRange.scss";
import {formatCurrency} from "../../../../utils/formatCurrency";
import {Spin} from "antd";

const ShopPriceRange = ({ onPriceChange, minPrice, maxPrice, currentRange }) => {
    const [priceRange, setPriceRange] = useState(currentRange);

    useEffect(() => {
        if (minPrice !== null && maxPrice !== null) {
            setPriceRange([
                currentRange[0] === null ? minPrice : currentRange[0],
                currentRange[1] === null ? maxPrice : currentRange[1]
            ]);
        }
    }, [minPrice, maxPrice, currentRange]);

    const handleChange = (newValues) => {
        setPriceRange(newValues);
    };

    const handleAfterChange = (newValues) => {
        onPriceChange(newValues);
    };

    if (minPrice === null || maxPrice === null) {
        return (
            <div className="shop-price-range widget-header text-center">
                <Spin spinning={true}/>
            </div>
        );
    }

    return (
        <div className="shop-price-range widget-header">
            <span className="ms-2 fs-4 text-primary">GIÁ</span>
            <div className="mt-3">
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
    );
};

export default ShopPriceRange;