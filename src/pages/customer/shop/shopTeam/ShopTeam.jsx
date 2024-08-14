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
                <h5 className="ms-2">ĐỘI BÓNG</h5>
            </div>
            <div>
                {/*<button onClick={() => filterItem("All")} className={`m-2 ${selectedCategory === "All" ? "bg-warning" : ""}`}>All</button>*/}
                {
                    menuItems.map((team, index) => {
                        return (
                            <button className={`m-2 ${selectedItems.includes(team.id) ? "bg-warning" : ""}`}
                            key={index}
                            onClick={() => handleSelection(team.id)}>
                                {team.name}
                            </button>
                        )
                    })
                }
            </div>
        </>
    );
};

export default ShopTeam;