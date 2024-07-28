import React, {useEffect, useState} from 'react';
import PageHeader from "../../components/pageHeader/PageHeader.jsx";
import {Link} from "react-router-dom";
import CheckOutPage from "../checkOutPage/CheckOutPage.jsx";

const CartPage = () => {

    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        // fetch cart items from local storage
        const storedCartItems = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(storedCartItems);
    }, []);

    // calculate prices
    const calculateTotalPrice = (item) => {
        return item.price * item.quantity;
    }

    // handle quantity increase
    const hanldeIncrease = (item) => {
        item.quantity += 1;
        setCartItems([...cartItems]);

        // update local storage with new cart items
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }

    // handle quantity decrease
    const handleDecrease = (item) => {
        if (item.quantity > 1) {
            item.quantity -= 1;
            setCartItems([...cartItems]);

            // update local storage with new cart items
            localStorage.setItem("cart", JSON.stringify(cartItems));
        }
    }

    // handle remove item
    const handleRemove = (item) => {
        const updatedCartItems = cartItems.filter((cartItem) => cartItem.id!== item.id);
        setCartItems(updatedCartItems);

        // update local storage with new cart items
        localStorage.setItem("cart", JSON.stringify(updatedCartItems));
    }

    // cart subtotal
    const carSubtotal = cartItems.reduce((total, item) => {
        return total + calculateTotalPrice(item);
    }, 0);

    // order total
    const orderTotal = carSubtotal;

    return (
        <div>
            <PageHeader title={"Giỏ Hàng"} curPage={"Giỏ hàng"}/>

            <div className="shop-cart padding-tb">
                <div className="container-fluid ps-5 pe-5">
                    <div className="section-wrapper">
                        {/*cart top*/}
                        <div className="cart-top">
                            <table>
                                <thead>
                                    <tr>
                                        <th className="cat-product">Sản phẩm</th>
                                        <th className="cat-price">Giá</th>
                                        <th className="cat-quantity">Số lượng</th>
                                        <th className="cat-toprice">Tổng</th>
                                        <th className="cat-edit">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    cartItems.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className="product-item cat-product">
                                                    <div className="p-thumb">
                                                        <Link to="/shop"><img src={item.img} alt=""/></Link>
                                                    </div>
                                                    <div className="p-content">
                                                        <Link to="/shop">{item.name}</Link>
                                                    </div>
                                                </td>
                                                <td className="cat-price">
                                                    $ {item.price}
                                                </td>
                                                <td className="cat-quantity">
                                                    <div className="cart-plus-minus">
                                                        <div className="dec qtybutton" onClick={() => handleDecrease(item)}>-</div>
                                                        <input type="text" className="cart-plus-minus-box"
                                                               name="qtybutton"
                                                               value={item.quantity}/>
                                                        <div className="inc qtybutton" onClick={() => hanldeIncrease(item)}>+</div>
                                                    </div>
                                                </td>
                                                <td className="cat-price">
                                                    $ {calculateTotalPrice(item)}
                                                </td>
                                                <td className="cat-edit">
                                                    <a href="#" onClick={() => handleRemove(item)}>
                                                        <img src="/admin/assets/img/examples/example1.jpeg" alt="" width={16} height={16}/>
                                                    </a>
                                                </td>
                                            </tr>
                                        )
                                    })
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
                                        <CheckOutPage />
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
                                                    <p className="pull-right">$ {carSubtotal}</p>
                                                </li>
                                                <li>
                                                    <span className="pull-left">Vận chuyển và Xử lý</span>
                                                    <p className="pull-right">Miễn phí vận chuyển</p>
                                                </li>
                                                <li>
                                                    <span className="pull-left">Tổng tiền</span>
                                                    <p className="pull-right">$ {orderTotal.toFixed(2)}</p>
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
        </div>
    );
};

export default CartPage;