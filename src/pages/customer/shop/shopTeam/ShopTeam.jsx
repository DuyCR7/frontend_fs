import React from 'react';

const ShopTeam = ({filterItem, menuItems, selectedItems}) => {

    const handleSelection = (teamId) => {
        if (selectedItems.includes(teamId)) {
            filterItem(selectedItems.filter((item) => item !== teamId));
        } else {
            filterItem([...selectedItems, teamId]);
        }
    };

    return (
        <>
            <div className="widget-header">
                <span className="ms-2 fs-4 text-primary">ĐỘI BÓNG</span>
            </div>
            <div>
                {
                    menuItems.length > 0 ? (
                        menuItems.map((team, index) => {
                            return (
                                <button className={`m-2 fs-5 ${selectedItems.includes(team.id) ? "bg-primary text-white" : ""}`}
                                        key={index}
                                        onClick={() => handleSelection(team.id)}>
                                    {team.name} ({team.productCount})
                                </button>
                            )
                        })
                    ) : (
                        <div className="ms-2 text-danger fs-5">
                            Không có đội bóng nào khả dụng!
                        </div>
                    )
                }
            </div>
        </>
    );
};

export default ShopTeam;