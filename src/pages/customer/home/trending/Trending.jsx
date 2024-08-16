import React, {useEffect, useState} from 'react';
import Rating from "../../components/rating/Rating.jsx";
import {Link} from "react-router-dom";
import {getAllTrending} from "../../../../services/customer/homeService";
import {formatCurrency} from "../../../../utils/formatCurrency";

const title = "Xu hướng";

const Trending = () => {

    const [listTrending, setListTrending] = useState([]);
    const [filteredTrending, setFilteredTrending] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');

    const fetchAllTrending = async () => {
        try {
            let res = await getAllTrending();
            if(res && res.EC === 0) {
                setListTrending(res.DT);
                setFilteredTrending(res.DT);

                const categoryList = res.DT.map(product => product.category.name);
                const uniqueCategories = Array.from(new Set(categoryList)); // Loại bỏ trùng lặp
                setCategories(uniqueCategories);
            } else {
                console.log('Error:', res.EM);
            }
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        fetchAllTrending();
    }, []);

    // category based filtering
    const filterItem = (cateItem) => {
        if (cateItem === "All") {
            setFilteredTrending(listTrending);
        } else {
            const updateItems = listTrending.filter((curElem) => {
                return curElem.category.name === cateItem;
            })

            setFilteredTrending(updateItems);
        }

        setActiveCategory(cateItem);
    }

    return (
        <div className="course-section style-3 padding-tb">
            {/*main section*/}
            <div className="container-fluid ps-5 pe-5">
                {/*section header*/}
                <div className="section-header">
                    <h2 className="title" style={{ color: "red" }}>{title}</h2>
                    <div className="course-filter-group">
                        <ul className="lab-ul" style={{fontSize: "20px"}}>
                            <li
                                className={activeCategory === 'All' ? 'active' : ''}
                                onClick={() => {
                                    filterItem('All')
                                }}
                            >
                                Tất cả
                            </li>
                            {
                                categories && categories.length > 0 &&
                                categories.map((cate, index) => {
                                    return (
                                        <li
                                            key={index}
                                            className={activeCategory === cate? 'active' : ''}
                                            onClick={() => filterItem(cate)}
                                        >
                                            {cate}
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>

                <div className={`shop-page`}>
                    <div className={`shop-product-wrap row justify-content-center grid`}>
                        {
                            filteredTrending && filteredTrending.length > 0 &&
                            filteredTrending.map((item, index) => {
                                return (
                                    <div key={index} className="col-lg-3 col-md-4 col-6">
                                        <div className="product-item">
                                            {/*product images*/}
                                            <div className="product-thumb">
                                                <div className="pro-thumb">
                                                    <img src={`${process.env.REACT_APP_URL_BACKEND}/${item.image}`} alt={`${process.env.REACT_APP_URL_BACKEND}/${item.image}`}/>
                                                </div>

                                                {/*product action links*/}
                                                <div className="product-action-link">
                                                    <Link to={`/products/${item.slug}`}><i className="icofont-eye"></i></Link>
                                                    <a href="#">
                                                        <i className="icofont-heart"></i>
                                                    </a>
                                                    <Link to="/cart-page"><i className="icofont-cart-alt"></i></Link>
                                                </div>
                                            </div>

                                            {/*product content*/}
                                            <div className="product-content">
                                                <h5>
                                                    <Link to={`/products/${item.slug}`}>{item.name}</Link>
                                                </h5>
                                                <p className="productRating">
                                                    <Rating/>
                                                </p>
                                                <h6>{item.isSale ? formatCurrency(item.price_sale) : formatCurrency(item.price)}</h6>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Trending;