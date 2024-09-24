import React, {useEffect, useState} from 'react';
import Rating from "../../components/rating/Rating.jsx";
import {Link, useNavigate} from "react-router-dom";
import {getAllTrending} from "../../../../services/customer/homeService";
import {formatCurrency} from "../../../../utils/formatCurrency";
import {IoEyeOutline, IoHeartOutline, IoHeartSharp, IoCartOutline} from "react-icons/io5";
import "./trending.scss";
import ModalQuickView from "../../components/modal/ModalQuickView";
import {useDispatch, useSelector} from "react-redux";
import {useWishlist} from "../../components/wishList/useWishlist";
import RatingOnlyView from "../../components/rating/RatingOnlyView";

const title = "Xu hướng";

const Trending = () => {

    const { loading, wishList, isInWishlist, handleWishlistAction } = useWishlist();

    const customer = useSelector((state) => state.customer);

    const [listTrending, setListTrending] = useState([]);
    const [filteredTrending, setFilteredTrending] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');

    const [isShowModalQuickView, setIsShowModalQuickView] = useState(false);
    const [dataQuickView, setDataQuickView] = useState({});

    const handleCloseModalQuickView = () => {
        setIsShowModalQuickView(false);
        setDataQuickView({});
    }

    const handleShowModalQuickView = (product) => {
        setIsShowModalQuickView(true);
        setDataQuickView(product);
    }

    const fetchAllTrending = async () => {
        try {
            let res = await getAllTrending();
            if (res && res.EC === 0) {
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
        <>
            <div className="trending course-section style-3 padding-tb">
                {/*main section*/}
                <div className="container-fluid ps-5 pe-5">
                    {/*section header*/}
                    <div className="section-header">
                        <h2 className="title" style={{color: "red"}}>{title}</h2>
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
                                                className={activeCategory === cate ? 'active' : ''}
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
                                        <div key={`${index}-${item.id}`} className="col-lg-3 col-md-4 col-sm-6 col-12">
                                            <div className="product-item">
                                                {/*product images*/}
                                                <div className="product-thumb">
                                                    <Link to={`/products/${item.slug}`}>
                                                    <div className="pro-thumb">
                                                        <img src={`${process.env.REACT_APP_URL_BACKEND}/${item.image}`}
                                                             alt={`${process.env.REACT_APP_URL_BACKEND}/${item.image}`}/>
                                                    </div>
                                                    </Link>

                                                    {/*product action links*/}
                                                    <div className="product-action-link">
                                                        <button title='Xem nhanh'
                                                              onClick={() => handleShowModalQuickView(item)}>
                                                            <IoEyeOutline size={24}/>
                                                        </button>
                                                        <button title='Yêu thích'
                                                                disabled={loading}
                                                              onClick={() => handleWishlistAction(item)}>
                                                            {
                                                                customer.isAuthenticated && isInWishlist(item.id)
                                                                    ? <IoHeartSharp size={24}/>
                                                                    : <IoHeartOutline size={24}/>
                                                            }
                                                        </button>
                                                    </div>
                                                </div>

                                                {/*product content*/}
                                                <div className="product-content d-flex flex-column gap-2">
                                                <span style={{fontSize: "18px"}}>
                                                    <Link to={`/products/${item.slug}`}>{item.name}</Link>
                                                </span>
                                                    <div className="productRating">
                                                        {/*<Rating/>*/}
                                                        {item.averageRating > 0 && (
                                                            <RatingOnlyView value={item.averageRating} />
                                                        )}
                                                    </div>
                                                    <div className={`price-container ${item.isSale ? 'on-sale' : ''}`}>
                                                        {item.isSale && (
                                                            <span
                                                                className="original-price">{formatCurrency(item.price)}</span>
                                                        )}
                                                        <span className={item.isSale ? 'sale-price' : ''}>
                                                      {item.isSale ? formatCurrency(item.price_sale) : formatCurrency(item.price)}
                                                    </span>
                                                    </div>
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

            <ModalQuickView
                isShowModalQuickView={isShowModalQuickView}
                handleCloseModalQuickView={handleCloseModalQuickView}
                dataQuickView={dataQuickView}
            />
        </>
    );
};

export default Trending;