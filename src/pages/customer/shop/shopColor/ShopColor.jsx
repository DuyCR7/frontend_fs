import React from 'react';

const ShopColor = ({filterItem, menuItems, selectedItems}) => {

    const handleSelection = (colorId) => {
        if (selectedItems.includes(colorId)) {
            filterItem(selectedItems.filter((item) => item !== colorId));
        } else {
            filterItem([...selectedItems, colorId]);
        }
    };

    return (
        <>
            <div className="widget-header mt-4">
                <h5 className="ms-2">COLOR</h5>
            </div>
            <div>
                {/*<button onClick={() => filterItem("All")} className={`m-2 ${selectedCategory === "All" ? "bg-warning" : ""}`}>All</button>*/}
                {
                    menuItems.map((color, index) => {
                        return (
                            <button className={`m-2 ${selectedItems.includes(color.id) ? "bg-warning" : ""}`}
                                    key={index}
                                    onClick={() => handleSelection(color.id)}>
                                {color.name}
                            </button>
                        )
                    })
                }
            </div>
        </>
    );
};

export default ShopColor;