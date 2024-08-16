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
                <span className="ms-2 fs-4 text-primary">BỘ SƯU TẬP</span>
            </div>
            <div>
                {
                    menuItems.length > 0 ? (
                        menuItems.map((category, index) => {
                            return (
                                <button className={`m-2 fs-5  ${selectedItems.includes(category.id) ? "bg-primary text-white" : ""}`}
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
        </>
    );
};

export default ShopCategory;