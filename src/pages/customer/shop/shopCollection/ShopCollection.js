import React from 'react';
import Data from "../../../../products.json";

const ShopCollection = ({filterItem, setItem, menuItems, setProducts, selectedCategory}) => {
    return (
        <>
            <div className="widget-header mt-4">
                <h5 className="ms-2">BỘ SƯU TẬP</h5>
            </div>
            <div>
                <button onClick={() => filterItem("All")} className={`m-2 ${selectedCategory === "All" ? "bg-warning" : ""}`}>All</button>
                {
                    menuItems.map((Val, index) => {
                        return (
                            <button className={`m-2 ${selectedCategory === Val ? "bg-warning" : ""}`}
                                    key={index}
                                    onClick={() => filterItem(Val)}>
                                {Val}
                            </button>
                        )
                    })
                }
            </div>
        </>
    );
};

export default ShopCollection;