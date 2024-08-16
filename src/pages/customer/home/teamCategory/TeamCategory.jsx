import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import "./teamCategory.scss";
import {getAllTeams} from "../../../../services/customer/homeService";

const subTitle = "ĐẶC SẮC";
const title = "ĐỘI BÓNG";
const btnText = "Mua ngay";

const TeamCategory = () => {

    const [listTeam, setListTeam] = useState([]);

    useEffect(() => {
        fetchAllTeams();
    }, []);

    const fetchAllTeams = async () => {
        try {
            let res = await getAllTeams();
            if (res && res.EC === 0) {
                setListTeam(res.DT);
            } else {
                console.log("Error: ", res.EM);
            }
        } catch (e) {
            console.error(e);
        }
    }

    const navigate = useNavigate();

    return (
        <div className="team-category category-section style-4 padding-tb" style={{background: "transparent"}}>
            <div className="container-fluid ps-5 pe-5">
                {/*section header*/}
                <div className="section-header text-center">
                    <h3 style={{color: "#1178f2"}}>{subTitle}</h3>
                    <h2 className="title">{title}</h2>
                </div>

                {/*section card*/}
                <div className="section-wrapper">
                    <div className="row g-4 justify-content-center row-cols-lg-6 row-cols-md-5 row-cols-sm-3 row-cols-2">
                        {
                            listTeam.length > 0 && (
                                listTeam.map((item, index) => {
                                    return (
                                        <div key={index} className="col">
                                            <Link to={`/shops/${item.slug}`}
                                                  className="image-team d-flex justify-content-center align-items-center">
                                                {/*image thumbnail*/}
                                                <div className="">
                                                    <img src={`${process.env.REACT_APP_URL_BACKEND}/${item.image}`}
                                                         alt={item.image}/>
                                                </div>
                                            </Link>
                                        </div>
                                    )
                                })
                            )
                        }
                    </div>

                    <div className="text-center mt-5">
                        <button onClick={() => navigate('/shop')} className="btn btn-outline-primary">
                            {btnText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamCategory;