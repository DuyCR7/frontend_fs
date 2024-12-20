import React, {useEffect, useState} from 'react';
import PageHeader from "../../components/pageHeader/PageHeader.jsx";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    getCart,
    getRelatedProducts,
    updateCartItemQuantity
} from "../../../../services/customer/cartService";
import {formatCurrency} from "../../../../utils/formatCurrency";
import {FaMinus, FaPlus} from "react-icons/fa6";
import {MdDelete} from "react-icons/md";
import {toast} from "react-toastify";
import {setSelectedItemsForPayment, updateCartCount} from "../../../../redux/customer/slices/customerSlice";
import ModalDeleteCartItem from "./ModalDeleteCartItem";
import "./cartPage.scss";
import RelatedProductCard from "./RelatedProductCard";
import {useWishlist} from "../../components/wishList/useWishlist";
import {Spin} from "antd";

const CartPage = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const customer = useSelector((state) => state.customer);
    const [cartItems, setCartItems] = useState([]);
    const [localQuantities, setLocalQuantities] = useState({});

    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const [relatedProducts, setRelatedProducts] = useState([]);

    const [isShowModalConfirm, setIsShowModalConfirm] = useState(false);
    const [selectedItemForDelete, setSelectedItemForDelete] = useState(null);

    const { loading, wishList, isInWishlist, handleWishlistAction } = useWishlist();

    const [isLoadingCart, setIsLoadingCart] = useState(false);
    const [isLoadingRelated, setIsLoadingRelated] = useState(false);
    const [isUpdating, setIsUpdating] = useState({});

    useEffect(() => {
        if(customer && customer.isAuthenticated) {
            fetchCartItems();
            fetchRelatedProducts();
        } else {
            navigate('/sign-in', {replace: true});
        }
    }, [customer.isAuthenticated, navigate]);

    const fetchCartItems = async () => {
        setIsLoadingCart(true);
        try {
            let res = await getCart();
            if (res && res.EC === 0) {
                setCartItems(res.DT.cartDetails);
                dispatch(updateCartCount(res.DT.totalItems));

                const initialQuantities = {};
                res.DT.cartDetails.forEach(item => {
                    initialQuantities[item.id] = item.quantity;
                });
                setLocalQuantities(initialQuantities);

                setSelectedIds([]);
                setSelectAll(false);
            } else {
                console.log('Error:', res.EM);
            }
        } catch (e) {
            console.log('Error:', e);
        } finally {
            setIsLoadingCart(false);
        }
    }
    console.log(cartItems);

    const fetchRelatedProducts = async () => {
        setIsLoadingRelated(true);
        try {
            const res = await getRelatedProducts();
            if (res && res.EC === 0) {
                setRelatedProducts(res.DT);
            } else {
                console.log('Error fetching related products:', res.EM);
            }
        } catch (e) {
            console.log('Error:', e);
        } finally {
            setIsLoadingRelated(false);
        }
    }

    const handleQuantityChange = async (cartDetailId, newQuantity) => {
        setIsUpdating(prev => ({ ...prev, [cartDetailId]: true }));
        try {
            if(newQuantity === 0) {
                const itemToDelete = cartItems.find(item => item.id === cartDetailId);
                if (itemToDelete) {
                    setSelectedItemForDelete({...itemToDelete});
                    setIsShowModalConfirm(true);
                } else {
                    console.error("Item not found in cart");
                }
            } else {
                const res = await updateCartItemQuantity(cartDetailId, newQuantity);
                if (res) {
                    const { EC, EM } = res;

                    if (EC === 0 || EC === 2 || EC === 3) {
                        await fetchCartItems();
                        await fetchRelatedProducts();
                        if (EC === 2 || EC === 3) {
                            toast.warn(EM);
                            // dispatch(updateCartCount(0))
                        }
                        // if (EC === 3) {
                        //     toast.warn(EM);
                        // }
                    } else if (EC === 1) {
                        toast.warn(EM);
                    } else {
                        console.log('Error updating quantity:', EM);
                    }
                } else {
                    console.log('No response from server');
                }
            }
        } catch (e) {
            console.log('Error:', e);
        } finally {
            setIsUpdating(prev => ({ ...prev, [cartDetailId]: false }));
        }
    };

    const handleInputChange = (e, cartDetailId) => {
        const newQuantity = parseInt(e.target.value, 10) || '';
        setLocalQuantities(prev => ({ ...prev, [cartDetailId]: newQuantity }));
    };

    const handleBlur = (cartDetailId) => {
        const newQuantity = localQuantities[cartDetailId];
        if (newQuantity !== '' && newQuantity !== cartItems.find(item => item.id === cartDetailId).quantity) {
            handleQuantityChange(cartDetailId, newQuantity);
        }
    };
    // console.log(localQuantities);

    const toggleCheckbox = (id) => {
        const currentIndex = selectedIds.indexOf(id);
        const newSelectedIds = [...selectedIds];
        if (currentIndex === -1) {
            newSelectedIds.push(id);
        } else {
            newSelectedIds.splice(currentIndex, 1);
        }
        setSelectedIds(newSelectedIds);
        setSelectAll(newSelectedIds.length === cartItems.length);
    };

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedIds([]);
        } else {
            const ids = cartItems.map(item => item.id);
            setSelectedIds(ids);
        }
        setSelectAll(!selectAll);
    };

    const handleRemoveItem = async (cartDetail) => {
        setIsShowModalConfirm(true);
        setSelectedItemForDelete(cartDetail);
    };

    const handleCloseModalConfirm = () => {
        setIsShowModalConfirm(false);
        setSelectedItemForDelete(null);
    }

    const handleRemoveManyItems = async () => {
        if(selectedIds.length === 0) {
            toast.warn("Vui lòng chọn sản phẩm để xóa!");
            return;
        }

        const selectedItems = cartItems.filter(item => selectedIds.includes(item.id));
        setSelectedItemForDelete(selectedItems);
        setIsShowModalConfirm(true);
    }

    const calculateTotal = () => {
        return selectedIds.reduce((total, id) => {
            const item = cartItems.find(item => item.id === id);
            if (item) {
                const price = item.Product_Detail.Product.isSale
                    ? item.Product_Detail.Product.price_sale
                    : item.Product_Detail.Product.price;
                return total + (price * item.quantity);
            }
            return total;
        }, 0);
    };

    const handlePurchase = () => {
        if(selectedIds.length === 0) {
            toast.warn("Vui lòng chọn sản phẩm để mua!");
            return;
        }

        const selectedItemsForPayment = cartItems.filter(item => selectedIds.includes(item.id));
        dispatch(setSelectedItemsForPayment(selectedItemsForPayment));
        navigate('/carts/payment');
    }

    return (
        <>
            <div>
                <PageHeader title={"Giỏ Hàng"} curPage={"Giỏ hàng"}/>

                <div className="shop-cart mt-5">
                    <div className="container-fluid ps-5 pe-5">
                        <div className="section-wrapper">
                            {/*cart top*/}
                            <Spin spinning={isLoadingCart}>
                                <div className="show-table table-responsive mb-5">
                                    <table className="table table-hover table-cart">
                                        <thead className="on-top">
                                        <tr className="text-center table-active">
                                            <th scope="col">
                                                <input
                                                    type="checkbox"
                                                    checked={selectAll}
                                                    onChange={toggleSelectAll}
                                                />
                                            </th>
                                            <th scope="col">Tên sản phẩm</th>
                                            <th scope="col">Phân loại</th>
                                            <th scope="col">Ảnh</th>
                                            <th scope="col">Giá</th>
                                            <th scope="col">Số lượng</th>
                                            <th scope="col">Thành tiền</th>
                                            <th scope="col">Hành động</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            cartItems && cartItems.length > 0 ?
                                                <>
                                                    {
                                                        cartItems.map((item, index) => {
                                                            return (
                                                                <tr className="text-center" key={item.id}>
                                                                    <td>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selectedIds.includes(item.id)}
                                                                            onChange={() => toggleCheckbox(item.id)}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <Link className="detail-name"
                                                                              to={`/products/${item.Product_Detail.Product.slug}`}>{item.Product_Detail.Product.name}</Link>
                                                                    </td>
                                                                    <td>
                                                                        {item.Product_Detail.Color.name} - {item.Product_Detail.Size.code}
                                                                    </td>
                                                                    <td>
                                                                        <Link
                                                                            to={`/products/${item.Product_Detail.Product.slug}`}>
                                                                            <img
                                                                                src={`${process.env.REACT_APP_URL_BACKEND}/${item.Product_Detail.image}`}
                                                                                width={50} height={50} alt=""/>
                                                                        </Link>
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            item.Product_Detail.Product.isSale ?
                                                                                formatCurrency(item.Product_Detail.Product.price_sale)
                                                                                :
                                                                                formatCurrency(item.Product_Detail.Product.price)
                                                                        }
                                                                    </td>
                                                                    <td className="cat-quantity">
                                                                        <div className="cart-plus-minus">
                                                                            <div
                                                                                className={`dec qtybutton ${isUpdating[item.id] ? 'disabled' : ''}`}
                                                                                onClick={() => !isUpdating[item.id] && handleQuantityChange(item.id, item.quantity - 1)}>
                                                                                <FaMinus/>
                                                                            </div>
                                                                            <input className="cart-plus-minus-box"
                                                                                   type="text"
                                                                                   name="qtybutton"
                                                                                   value={localQuantities[item.id] !== undefined ? localQuantities[item.id] : item.quantity}
                                                                                   onChange={(e) => handleInputChange(e, item.id)}
                                                                                   onBlur={() => handleBlur(item.id, item.Product_Detail.quantity)}
                                                                                   min={1}
                                                                                   max={item.Product_Detail.quantity}
                                                                                   disabled={isUpdating[item.id]}
                                                                            />
                                                                            <div
                                                                                className={`inc qtybutton ${isUpdating[item.id] ? 'disabled' : ''}`}
                                                                                onClick={() => !isUpdating[item.id] && handleQuantityChange(item.id, item.quantity + 1)}>
                                                                                <FaPlus/>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            item.Product_Detail.Product.isSale ?
                                                                                formatCurrency(item.Product_Detail.Product.price_sale * item.quantity)
                                                                                :
                                                                                formatCurrency(item.Product_Detail.Product.price * item.quantity)
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        <MdDelete size={25} title={"Xóa"}
                                                                                  style={{
                                                                                      color: "red",
                                                                                      cursor: "pointer"
                                                                                  }}
                                                                                  onClick={() => handleRemoveItem(item)}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </>
                                                :
                                                <>
                                                    <tr>
                                                        <td colSpan={8}>Giỏ hàng trống! <Link to={'/shops'}
                                                                                              style={{color: "#1178f2"}}>Cửa
                                                            hàng</Link></td>
                                                    </tr>
                                                </>
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </Spin>

                            {/*cart bottom*/}
                            <div className="cart-bottom p-3">
                                <div className="d-flex row align-items-center justify-content-between">
                                    <div
                                        className="d-flex align-items-center justify-content-sm-start justify-content-center col-sm-6 col-12">
                                        <input
                                            type="checkbox"
                                            id="selectAllCart"
                                            checked={selectAll}
                                            onChange={toggleSelectAll}
                                            className="form-check-input me-2"
                                        />
                                        <label className="me-3" htmlFor="selectAllCart">Chọn tất cả
                                            ({cartItems.length})</label>
                                        <button className="btn btn-outline-danger"
                                                onClick={() => handleRemoveManyItems()}>
                                            Xóa
                                        </button>
                                    </div>
                                    <div
                                        className="d-flex mt-3 mt-sm-0 justify-content-sm-end justify-content-center align-items-center col-sm-6 col-12">
                                        <span
                                            className="me-3">Tổng thanh toán ({selectedIds.length} sản phẩm): {formatCurrency(calculateTotal())}</span>
                                        <button className="btn btn-primary" onClick={() => handlePurchase()}>
                                            Mua hàng
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <Spin spinning={isLoadingRelated}>
                                <div className="related-products mt-5">
                                    <span className="text-uppercase fs-4">Sản phẩm liên quan</span>
                                    <div className="shop-page mt-3">
                                        <div className="shop-product-wrap row justify-content-center grid">
                                            {relatedProducts.length > 0 ? relatedProducts.map((product) => (
                                                    <div className="col-lg-3 col-md-4 col-6" key={product.id}>
                                                        <RelatedProductCard
                                                            product={product}
                                                            loading={loading}
                                                            handleWishlistAction={handleWishlistAction}
                                                            isInWishlist={isInWishlist}
                                                            fetchCartItems={fetchCartItems}
                                                            fetchRelatedProducts={fetchRelatedProducts}
                                                        />
                                                    </div>
                                                ))
                                                :
                                                <div className="col-lg-12 col-md-12 col-12 text-center">
                                                    <p>Không có sản phẩm nào để hiển thị.</p>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </Spin>
                        </div>
                    </div>
                </div>
                <ModalDeleteCartItem
                    isShowModalConfirm={isShowModalConfirm}
                    handleCloseModalConfirm={handleCloseModalConfirm}
                    selectedItemForDelete={selectedItemForDelete}
                    fetchCartItems={fetchCartItems}
                    fetchRelatedProducts={fetchRelatedProducts}
                    setSelectedIds={setSelectedIds}
                    isMultipleDelete={Array.isArray(selectedItemForDelete)}
                />
            </div>
        </>
    );
};

export default CartPage;