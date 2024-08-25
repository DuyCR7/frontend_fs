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
                <span className="ms-2 fs-4 text-primary">COLOR</span>
            </div>
            <div className="mb-4">
                {
                    menuItems.length > 0 ? (
                        menuItems.map((color, index) => {
                            return (
                                <button className={`m-2 fs-5 ${selectedItems.includes(color.id) ? "bg-primary text-white" : ""}`}
                                        key={index}
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
        </>
    );
};

export default ShopColor;