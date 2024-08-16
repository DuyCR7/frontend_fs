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
                <span className="ms-2 fs-4 text-primary">SIZE</span>
            </div>
            <div>
                {
                    menuItems.length > 0 ? (
                        menuItems.map((size, index) => {
                            return (
                                <button className={`m-2 fs-5  ${selectedItems.includes(size.id) ? "bg-primary text-white" : ""}`}
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
        </>
    );
};

export default ShopSize;