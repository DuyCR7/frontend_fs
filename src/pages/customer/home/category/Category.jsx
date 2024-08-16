import React, {useEffect, useState} from 'react';
import "./category.scss"
import {getAllParentCategories} from "../../../../services/customer/homeService";
import {Link} from "react-router-dom";

const Category = () => {

    const [listParentCategory, setListParentCategory] = useState([]);

    const fetchAllParentCategory = async () => {
        try {
            let res = await getAllParentCategories();
            if(res && res.EC === 0) {
                setListParentCategory(res.DT);
            } else {
                console.log('Error:', res.EM);
            }
        } catch (e) {
            console.log("Error: ", e);
        }
    }

    useEffect(() => {
        fetchAllParentCategory();
    }, []);

    return (
        <div className="container-fluid category-container p-5" style={{background: "transparent"}}>
            <div className="row">
                <div className="col-12 mb-md-0 mb-3 col-md-8">
                    {
                        listParentCategory && listParentCategory[0] && (
                            <div className="category-box" style={{ backgroundImage: `url(${process.env.REACT_APP_URL_BACKEND}/${listParentCategory[0].image})`}}>
                                <Link to={`/shops/${listParentCategory[0].slug}`}>
                                    <button type="button" className="btn btn-outline-primary text-uppercase">{listParentCategory[0].name}</button>
                                </Link>
                            </div>
                        )
                    }
                </div>
                <div className="col-12 col-md-4">
                    <div className="d-flex flex-column header-left">
                        <div className="row">
                            <div className="col-12 mb-3 mb-md-0">
                                {
                                    listParentCategory && listParentCategory[1] && (
                                        <div className="category-box content-box-top" style={{ backgroundImage: `url(${process.env.REACT_APP_URL_BACKEND}/${listParentCategory[1].image})`}}>
                                            <Link to={`/shops/${listParentCategory[1].slug}`}>
                                                <button type="button"
                                                    className="btn btn-outline-primary text-uppercase">{listParentCategory[1].name}</button>
                                            </Link>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                {
                                    listParentCategory && listParentCategory[2] && (
                                        <div className="category-box content-box-bottom" style={{ backgroundImage: `url(${process.env.REACT_APP_URL_BACKEND}/${listParentCategory[2].image})`}}>
                                            <Link to={`/shops/${listParentCategory[2].slug}`}>
                                                <button type="button" className="btn btn-outline-primary text-uppercase">{listParentCategory[2].name}</button>
                                            </Link>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Category;