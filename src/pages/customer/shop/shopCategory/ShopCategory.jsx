import React from 'react';

const ShopCategory = ({filterItem, menuItems, selectedItems}) => {

    const handleSelection = (categoryId) => {
        if (selectedItems.includes(categoryId)) {
            filterItem(selectedItems.filter((item) => item !== categoryId));
        } else {
            filterItem([...selectedItems, categoryId]);
        }
    };

    return (
        <>
            <div className="widget-header mt-4">
                <h5 className="ms-2">BỘ SƯU TẬP</h5>
            </div>
            <div>
                {
                    menuItems.map((category, index) => {
                        return (
                            <button className={`m-2 ${selectedItems.includes(category.id) ? "bg-warning" : ""}`}
                                    key={index}
                                    onClick={() => handleSelection(category.id)}>
                                {category.name}
                            </button>
                        )
                    })
                }
            </div>
        </>
    );
};

export default ShopCategory;