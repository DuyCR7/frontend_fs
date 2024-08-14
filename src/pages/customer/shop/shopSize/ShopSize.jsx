import React from 'react';

const ShopSize = ({filterItem, menuItems, selectedItems}) => {

    const handleSelection = (sizeId) => {
        if (selectedItems.includes(sizeId)) {
            filterItem(selectedItems.filter((item) => item !== sizeId));
        } else {
            filterItem([...selectedItems, sizeId]);
        }
    };

    return (
        <>
            <div className="widget-header mt-4">
                <h5 className="ms-2">SIZE</h5>
            </div>
            <div>
                {/*<button onClick={() => filterItem("All")} className={`m-2 ${selectedCategory === "All" ? "bg-warning" : ""}`}>All</button>*/}
                {
                    menuItems.map((size, index) => {
                        return (
                            <button className={`m-2 ${selectedItems.includes(size.id) ? "bg-warning" : ""}`}
                                    key={index}
                                    onClick={() => handleSelection(size.id)}>
                                {size.code}
                            </button>
                        )
                    })
                }
            </div>
        </>
    );
};

export default ShopSize;