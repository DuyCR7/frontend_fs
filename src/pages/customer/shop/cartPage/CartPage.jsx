import React, {useEffect, useState} from 'react';
import PageHeader from "../../components/pageHeader/PageHeader.jsx";
import {Link, useNavigate} from "react-router-dom";
import CheckOutPage from "../checkOutPage/CheckOutPage.jsx";
import {useDispatch, useSelector} from "react-redux";
import {deleteCartItem, getCart, updateCartItemQuantity} from "../../../../services/customer/cartService";
import {formatCurrency} from "../../../../utils/formatCurrency";
import {FaMinus, FaPlus} from "react-icons/fa6";
import {MdDelete} from "react-icons/md";
import {toast} from "react-toastify";
import {updateCartCount} from "../../../../redux/customer/slices/customerSlice";
import ModalDeleteCartItem from "./ModalDeleteCartItem";
import "./cartPage.scss";

const CartPage = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const customer = useSelector((state) => state.customer);
    const [cartItems, setCartItems] = useState([]);
    const [localQuantities, setLocalQuantities] = useState({});

    const [isShowModalConfirm, setIsShowModalConfirm] = useState(false);
    const [selectedItemForDelete, setSelectedItemForDelete] = useState({});

    useEffect(() => {
        if(customer && customer.isAuthenticated) {
            fetchCartItems(customer.id);
        } else {
            navigate('/sign-in');
        }
    }, [customer]);

    const fetchCartItems = async (cusId) => {
        try {
            let res = await getCart(cusId);
            if (res && res.EC === 0) {
                setCartItems(res.DT);

                const initialQuantities = {};
                res.DT.forEach(item => {
                    initialQuantities[item.id] = item.quantity;
                });
                setLocalQuantities(initialQuantities);
            } else {
                console.log('Error:', res.EM);
            }
        } catch (e) {
            console.log('Error:', e);
        }
    }
    console.log(cartItems);

    const handleQuantityChange = async (cartDetailId, newQuantity) => {
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

                    if (EC === 0 || EC === 2) {
                        await fetchCartItems(customer.id);
                        if (EC === 2) {
                            toast.warn(EM);
                        }
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
    console.log(localQuantities);

    const handleRemoveItem = async (cartDetail) => {
        setIsShowModalConfirm(true);
        setSelectedItemForDelete(cartDetail);
    };

    const handleCloseModalConfirm = () => {
        setIsShowModalConfirm(false);
        setSelectedItemForDelete({});
    }

    return (
        <>
            <div>
                <PageHeader title={"Giỏ Hàng"} curPage={"Giỏ hàng"}/>

                <div className="shop-cart padding-tb">
                    <div className="container-fluid ps-5 pe-5">
                        <div className="section-wrapper">
                            {/*cart top*/}
                            <div className="show-table table-responsive mb-5">
                                <table className="table table-hover table-cart">
                                    <thead className="on-top">
                                    <tr className="text-center table-active">
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
                                                            <tr className="text-center" key={index}>
                                                                <td>
                                                                    <Link
                                                                        to={`/products/${item.Product_Detail.Product.slug}`}>{item.Product_Detail.Product.name}</Link>
                                                                </td>
                                                                <td>
                                                                    {item.Product_Detail.Color.name} - {item.Product_Detail.Size.code}
                                                                </td>
                                                                <td>
                                                                    <Link to="/shop">
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
                                                                        <div className="dec qtybutton"
                                                                             onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>
                                                                            <FaMinus/></div>
                                                                        <input className="cart-plus-minus-box"
                                                                               type="text"
                                                                               name="qtybutton"
                                                                               value={localQuantities[item.id] !== undefined ? localQuantities[item.id] : item.quantity}
                                                                               onChange={(e) => handleInputChange(e, item.id)}
                                                                               onBlur={() => handleBlur(item.id, item.Product_Detail.quantity)}
                                                                               min={1}
                                                                               max={item.Product_Detail.quantity}
                                                                        />
                                                                        <div className="inc qtybutton"
                                                                             onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                                                                            <FaPlus/></div>
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
                                                                              style={{color: "red", cursor: "pointer"}}
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
                                                    <td colSpan={7}>Giỏ hàng trống! <Link to={'/shops'} style={{color: "#1178f2"}}>Cửa hàng</Link></td>
                                                </tr>
                                            </>
                                    }
                                    </tbody>
                                </table>
                            </div>

                            {/*cart bottom*/}
                            <div className="cart-bottom">
                                {/*checkout box*/}
                                <div className="cart-checkout-box">
                                    <form className="coupon">
                                        <input type="text" name="coupon" id="coupon" placeholder="Mã giảm giá..."
                                               className="cart-page-input-text"/>
                                        <input type="submit" value={"Áp dụng"}/>
                                    </form>

                                    <form className="cart-checkout d-flex">
                                        <div className="ms-auto">
                                            <CheckOutPage/>
                                        </div>
                                    </form>
                                </div>

                                {/*shopping box*/}
                                <div className="shiping-box">
                                    <div className="row">
                                        <div className="col-md-6 col-12">
                                            {/*left sight*/}
                                            <div className="calculate-shiping">
                                                <h3>Thông tin vận chuyển</h3>
                                                <div className="outline-select">
                                                    <select>
                                                        <option value="UK">United Kingdom (UK)</option>
                                                        <option value="VN">Viet Nam</option>
                                                        <option value="PO">Portugal</option>
                                                        <option value="US">United States (US)</option>
                                                    </select>
                                                    <span className="select-icon">
                                                    <i className="icofont-rounded-down"></i>
                                                </span>
                                                </div>

                                                <div className="outline-select shipping-select w-100">
                                                    <select>
                                                        <option value="NY">New York</option>
                                                        <option value="LD">London</option>
                                                        <option value="LB">Lisbon</option>
                                                        <option value="PA">Paris</option>
                                                    </select>
                                                    <span className="select-icon">
                                                    <i className="icofont-rounded-down"></i>
                                                </span>
                                                </div>

                                                <button type="submit">Cập nhật</button>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-12">
                                            {/*right sight*/}
                                            <div className="cart-overview">
                                                <h3>Tổng tiền</h3>
                                                <ul className="lab-ul">
                                                    <li>
                                                        <span className="pull-left">Tổng phụ</span>
                                                        <p className="pull-right"></p>
                                                    </li>
                                                    <li>
                                                        <span className="pull-left">Vận chuyển và Xử lý</span>
                                                        <p className="pull-right">Miễn phí vận chuyển</p>
                                                    </li>
                                                    <li>
                                                        <span className="pull-left">Tổng tiền</span>
                                                        <p className="pull-right"></p>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ModalDeleteCartItem
                    isShowModalConfirm={isShowModalConfirm}
                    handleCloseModalConfirm={handleCloseModalConfirm}
                    selectedItemForDelete={selectedItemForDelete}
                    fetchCartItems={fetchCartItems}
                    cusId={customer.id}
                />
            </div>
        </>
    );
};

export default CartPage;