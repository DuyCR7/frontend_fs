import React from 'react';

const ShopTeam = ({filterItem, menuItems, selectedItems}) => {

    const handleSelection = (teamId) => {
        if (selectedItems.includes(teamId)) {
            filterItem(selectedItems.filter((item) => item !== teamId));
        } else {
            filterItem([...selectedItems, teamId]);
        }
    };
    console.log(menuItems);

    return (
        <>
            <div className="widget-header">
                <h5 className="ms-2">ĐỘI BÓNG</h5>
            </div>
            <div>
                {/*<button onClick={() => filterItem("All")} className={`m-2 ${selectedCategory === "All" ? "bg-warning" : ""}`}>All</button>*/}
                {
                    menuItems.map((team, index) => {
                        return (
                            <button className={`m-2 fs-5 ${selectedItems.includes(team.id) ? "bg-primary text-white" : ""}`}
                            key={index}
                            onClick={() => handleSelection(team.id)}>
                                {team.name} ({team.productCount})
                            </button>
                        )
                    })
                }
            </div>
        </>
    );
};

export default ShopTeam;