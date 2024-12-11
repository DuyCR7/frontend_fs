import React, {useEffect, useState} from 'react';
import PageHeader from "../../components/pageHeader/PageHeader";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {deleteWishListItem, getWishList} from "../../../../services/customer/wishListService";
import {IoEyeOutline, IoHeartOutline, IoHeartSharp} from "react-icons/io5";
import {formatCurrency} from "../../../../utils/formatCurrency";
import {toast} from "react-toastify";
import {setWishList, updateWishListCount} from "../../../../redux/customer/slices/customerSlice";
import "./wishList.scss";
import RatingOnlyView from "../../components/rating/RatingOnlyView";
import ModalQuickView from "../../components/modal/ModalQuickView";

const WishList = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const customer = useSelector((state) => state.customer);
    const wishList = useSelector((state) => state.customer.wishList);

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

    useEffect(() => {
        if (customer.isAuthenticated) {
            fetchWishlist();
        } else {
            navigate('/sign-in', {replace: true});
        }
    }, [customer.isAuthenticated, navigate]);

    const fetchWishlist = async () => {
        try {
            let res = await getWishList();
            if (res && res.EC === 0) {
                dispatch(setWishList(res.DT));
            }
        } catch (e) {
            console.error(e);
        }
    }

    const handleDeleteWishListItem = async (productId) => {
        if (customer && !customer.isAuthenticated) {
            navigate('/sign-in', {replace: true});
        } else {
            try {
                let res = await deleteWishListItem(productId);
                if (res && res.EC === 0) {
                    toast.success(res.EM);
                    dispatch(updateWishListCount(res.DT));

                    await fetchWishlist();
                } else {
                    toast.error(res.EM);
                }
            } catch (e) {
                console.error(e);
            }
        }
    }
    console.log(wishList);
    return (
        <>
        <div>
            <PageHeader title={"Danh sách yêu thích"} curPage={"Danh sách yêu thích"}/>

            <div className="wish-list container-fluid ps-5 pe-5">
                <div className={`shop-page mt-5`}>
                    <div className={`shop-product-wrap row justify-content-center grid`}>
                        {
                            wishList && wishList.length > 0 ? (
                                wishList.map((item, index) => {
                                    return (
                                        <div key={`${index}-${item.id}`} className="col-lg-3 col-md-4 col-sm-6 col-6 p-3">
                                            <div className="product-item h-100 d-flex flex-column justify-content-center">
                                                {/*product images*/}
                                                <div className="product-thumb">
                                                    <Link to={`/products/${item.slug}`}>
                                                        <div className="pro-thumb">
                                                            <img
                                                                src={`${process.env.REACT_APP_URL_BACKEND}/${item.image}`}
                                                                alt={`${process.env.REACT_APP_URL_BACKEND}/${item.image}`}/>
                                                        </div>
                                                    </Link>

                                                    <div className="product-action-link">
                                                        <button title='Xem nhanh'
                                                                onClick={() => handleShowModalQuickView(item)}>
                                                            <IoEyeOutline size={24}/>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/*product content*/}
                                                <div className="product-content d-flex flex-column gap-2">
                                                <span style={{fontSize: "18px"}}>
                                                    <Link
                                                        to={`/products/${item.slug}`}>{item.name}</Link>
                                                </span>
                                                    <div className="productRating">
                                                        {parseFloat(item.averageRating) > 0 && (
                                                            <RatingOnlyView
                                                                value={parseFloat(item.averageRating)}/>
                                                        )}
                                                    </div>
                                                    <div
                                                        className={`price-container ${item.isSale ? 'on-sale' : ''}`}>
                                                        {item.isSale && (
                                                            <span
                                                                className="original-price">{formatCurrency(item.price)}</span>
                                                        )}
                                                        <span className={item.isSale ? 'sale-price' : ''}>
                                                      {item.isSale ? formatCurrency(item.price_sale) : formatCurrency(item.price)}
                                                    </span>
                                                    </div>
                                                    <div>
                                                    <span title='Yêu thích'
                                                          style={{cursor: "pointer", color: "#1178f2"}}
                                                          onClick={() => handleDeleteWishListItem(item.id)}>
                                                           <IoHeartSharp size={25}/>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="col-12 text-center">
                                    <p>Chưa có sản phẩm nào trong danh sách yêu thích.</p>
                                </div>

                            )
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

export default WishList;