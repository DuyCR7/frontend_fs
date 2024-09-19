import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {formatCurrency} from "../../../../utils/formatCurrency";
import _ from "lodash";
import AddressModal from "./AddressModal";
import EditAddressModal from "./EditAddressModal";
import {
    createCustomerAddress, createOrder,
    getCustomerAddress, setDefaultAddress,
    updateCustomerAddress
} from "../../../../services/customer/checkOutService";
import {toast} from "react-toastify";
import {clearSelectedItemsForPayment, updateCartCount} from "../../../../redux/customer/slices/customerSlice";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const CheckOutPage = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const customer = useSelector((state) => state.customer);
    const [loading, setLoading] = useState(false);
    const [shippingMethod, setShippingMethod] = useState('standard');
    const [paymentMethod, setPaymentMethod] = useState('cod');

    const [actionModalAddress, setActionModalAddress] = useState("CREATE");
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [editingAddress, setEditingAddress] = useState(null);
    const [originalIsDefault, setOriginalIsDefault] = useState(false);
    const [errors, setErrors] = useState({});

    const [addresses, setAddresses] = useState([]);

    const fetchCustomerAddress = async () => {
        setLoading(true);
        try {
            let res = await getCustomerAddress();
            if (res && res.EC === 0) {
                setAddresses(res.DT);
                const defaultAddress = res.DT.find(addr => addr.isDefault);
                if (defaultAddress) {
                    setSelectedAddress(defaultAddress);
                } else if (res.DT.length > 0) {
                    setSelectedAddress(res.DT[0]);
                }
            } else {
                console.error(res.EM);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!customer || !customer.isAuthenticated) {
            navigate('/sign-in');
        } else if (customer.selectedItemsForPayment.length === 0) {
            navigate('/carts');
        } else {
            fetchCustomerAddress();
        }
    }, [customer, navigate]);

    const calculateSubtotal = () => {
        return customer.selectedItemsForPayment.reduce((total, item) => {
            const price = item.Product_Detail.Product.isSale
                ? item.Product_Detail.Product.price_sale
                : item.Product_Detail.Product.price;
            return total + price * item.quantity;
        }, 0);
    };

    const calculateShippingCost = () => {
        // Giả sử phí vận chuyển
        return shippingMethod === 'express' ? 50000 : 20000;
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateShippingCost();
    };

    const handleChangeAddress = () => {
        setShowAddressModal(true);
    };

    const handleSelectAddress = (address) => {
        setSelectedAddress(address);
        setShowAddressModal(false);
    };

    const handleAddAddress = () => {
        setActionModalAddress("CREATE");
        setEditingAddress({
            name: '',
            address: '',
            phone: '',
            email: '',
            isDefault: false
        });
        setShowEditModal(true);
        setShowAddressModal(false);
    }

    const handleEditAddress = (address) => {
        setActionModalAddress("EDIT");
        setEditingAddress({ ...address });
        setOriginalIsDefault(address.isDefault);
        setShowEditModal(true);
        setShowAddressModal(false);
    };

    const handleOnChangeInput = (value, name) => {
        let _editingAddress = _.cloneDeep(editingAddress);
        _editingAddress[name] = value;
        setEditingAddress(_editingAddress);

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: undefined
        }));
    }

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        if(!editingAddress.name.trim()) {
            newErrors.name = "Vui lòng nhập tên!";
            isValid = false;
        }
        if(!editingAddress.address.trim()) {
            newErrors.address = "Vui lòng nhập địa chỉ!";
            isValid = false;
        }
        if(!editingAddress.phone.trim()) {
            newErrors.phone = "Vui lòng nhập số điện thoại!";
            isValid = false;
        }
        if(!editingAddress.email.trim()) {
            newErrors.email = "Vui lòng nhập email!";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }

    const handleUpdateAddress = async () => {
        let check = validateForm();
        if(check) {
            setLoading(true);
            try {
                let res;
                if (actionModalAddress === "CREATE") {
                    res = await createCustomerAddress(editingAddress.name, editingAddress.address, editingAddress.phone, editingAddress.email, editingAddress.isDefault);
                } else {
                    res = await updateCustomerAddress(editingAddress.id, editingAddress.name, editingAddress.address, editingAddress.phone, editingAddress.email, editingAddress.isDefault);
                }
                if (res && res.EC === 0) {
                    toast.success(res.EM);
                    await fetchCustomerAddress();
                    setEditingAddress(null);
                    setShowEditModal(false);
                    setShowAddressModal(true);
                } else if (res && res.EC === 1) {
                    toast.warn(res.EM);
                } else {
                    console.error(res.EM);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
    };

    const renderError = (error) => {
        return error ? <div className="text-danger mt-1">{error}</div> : null;
    };

    const handleCODOrder = async () => {
        setLoading(true);
        try {
            if (!selectedAddress) {
                toast.error("Vui lòng chọn địa chỉ giao hàng!");
                return;
            }

            const orderDetails = customer.selectedItemsForPayment.map(item => ({
                productDetailId: item.productDetailId,
                quantity: item.quantity,
                price: item.Product_Detail.Product.isSale
                    ? item.Product_Detail.Product.price_sale
                    : item.Product_Detail.Product.price
            }));

            let res = await createOrder(paymentMethod, shippingMethod, calculateTotal(), selectedAddress.id, orderDetails);
            if (res && res.EC === 0) {
                toast.success(res.EM);
                dispatch(clearSelectedItemsForPayment());
                dispatch(updateCartCount(res.DT.remainingCartItems));
                navigate('/carts');
            } else {
                toast.error(res.EM);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const handleCreateOrder = async (data, actions) => {
        if (!selectedAddress) {
            toast.error("Vui lòng chọn địa chỉ giao hàng!");
            return;
        }

        const orderAmount = calculateTotal();
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: (orderAmount / 24580).toFixed(2),
                    },
                },
            ],
        });
    };

    const handleApprove = async (data, actions) => {
        setLoading(true);
        try {
            const details = await actions.order.capture();
            console.log("Paypal transaction completed", details);

            const orderDetails = customer.selectedItemsForPayment.map(item => ({
                productDetailId: item.productDetailId,
                quantity: item.quantity,
                price: item.Product_Detail.Product.isSale
                    ? item.Product_Detail.Product.price_sale
                    : item.Product_Detail.Product.price
            }));

            const res = await createOrder(paymentMethod, shippingMethod, calculateTotal(), selectedAddress.id, orderDetails, data.orderID);
            if (res && res.EC === 0) {
                toast.success(res.EM);
                dispatch(clearSelectedItemsForPayment());
                dispatch(updateCartCount(res.DT.remainingCartItems));
                navigate('/carts');
            } else {
                toast.error(res.EM);
            }
        } catch (e) {
            console.error(e);
            toast.error("Có lỗi xảy ra khi xử lý thanh toán");
        } finally {
            setLoading(false);
        }
    };

    const handleError = (err) => {
        console.error("PayPal Checkout onError", err);
        toast.error("Có lỗi xảy ra trong quá trình thanh toán PayPal");
    };

    const handleCancel = (data) => {
        console.log("PayPal Checkout onCancel", data);
        toast.info("Bạn đã hủy giao dịch PayPal");
    };

    return (
        <PayPalScriptProvider options={{ clientId: process.env.REACT_APP_CLIENT_ID }}>
            <div className="checkout-page">
                <div className="pageheader-section">
                    <div className="container-fluid ps-5 pe-5">
                        <div className="row">
                            <div className="col-12">
                                <div className="pageheader-content text-center">
                                    <h2>Thanh toán</h2>
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb justify-content-center">
                                            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                                            <li className="breadcrumb-item"><Link to="/carts">Giỏ hàng</Link></li>
                                            <li className="breadcrumb-item active" aria-current="page">Thanh toán</li>
                                        </ol>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-5">
                    <div className="container-fluid ps-5 pe-5">
                        <div className="row">
                            <div className="col-md-6 mb-4">
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="mb-0 mt-1">Thông tin đơn hàng</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table">
                                                <thead>
                                                <tr className="text-center">
                                                    <th scope="col">Hình ảnh</th>
                                                    <th scope="col">Sản phẩm</th>
                                                    <th scope="col">Đơn giá</th>
                                                    <th scope="col">Số lượng</th>
                                                    <th scope="col">Tổng</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {customer.selectedItemsForPayment.map((item) => (
                                                    <tr key={item.id} className="text-center">
                                                        <td>
                                                            <img
                                                                src={`${process.env.REACT_APP_URL_BACKEND}/${item.Product_Detail.image}`}
                                                                width={50}
                                                                height={50}
                                                                alt={item.Product_Detail.Product.name}
                                                            />
                                                        </td>
                                                        <td>{item.Product_Detail.Product.name}</td>
                                                        <td>{formatCurrency(item.Product_Detail.Product.isSale
                                                            ? item.Product_Detail.Product.price_sale
                                                            : item.Product_Detail.Product.price)}
                                                        </td>
                                                        <td>{item.quantity}</td>
                                                        <td>{formatCurrency(item.Product_Detail.Product.isSale
                                                            ? item.Product_Detail.Product.price_sale * item.quantity
                                                            : item.Product_Detail.Product.price * item.quantity)}
                                                        </td>
                                                    </tr>
                                                ))}
                                                <tr>
                                                    <td colSpan="4" className="text-end">Tạm tính:</td>
                                                    <td className="text-center">{formatCurrency(calculateSubtotal())}</td>
                                                </tr>
                                                {/* Phí vận chuyển */}
                                                <tr>
                                                    <td colSpan="4" className="text-end">Phí vận chuyển:</td>
                                                    <td className="text-center">{formatCurrency(calculateShippingCost())}</td>
                                                </tr>
                                                {/* Tổng cộng */}
                                                <tr className="fw-bold">
                                                    <td colSpan="4" className="text-end">Tổng cộng:</td>
                                                    <td className="text-center">{formatCurrency(calculateTotal())}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 mb-4">
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="mb-0 mt-1">Thông tin vận chuyển</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="mb-3">
                                            {selectedAddress ? (
                                                <div>
                                                    <p><strong>Họ và tên:</strong> {selectedAddress.name}</p>
                                                    <p><strong>Địa chỉ:</strong> {selectedAddress.address}</p>
                                                    <p><strong>Số điện thoại:</strong> {selectedAddress.phone}</p>
                                                    <p><strong>Email:</strong> {selectedAddress.email}</p>
                                                    <button className="btn btn-outline-primary"
                                                            onClick={() => handleChangeAddress()}>
                                                        Thay đổi địa chỉ
                                                    </button>
                                                </div>
                                            ) : (
                                                <button className="btn btn-primary" onClick={() => handleChangeAddress()}>
                                                    Chọn địa chỉ giao hàng
                                                </button>
                                            )}
                                        </div>

                                        <hr/>
                                        <div className="row mb-3">
                                            <div className="col-sm-6 pe-sm-3">
                                                <label className="form-label" style={{fontWeight: "bold"}}>Phương thức vận
                                                    chuyển</label>
                                                <div>
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            id="standardShipping"
                                                            value="standard"
                                                            checked={shippingMethod === 'standard'}
                                                            onChange={(e) => setShippingMethod(e.target.value)}
                                                        />
                                                        <label className="form-check-label" htmlFor="standardShipping">
                                                            Tiêu chuẩn ({formatCurrency(20000)})
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            id="expressShipping"
                                                            value="express"
                                                            checked={shippingMethod === 'express'}
                                                            onChange={(e) => setShippingMethod(e.target.value)}
                                                        />
                                                        <label className="form-check-label" htmlFor="expressShipping">
                                                            Nhanh ({formatCurrency(50000)})
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 ps-sm-3 position-relative">
                                                <div className="d-none d-sm-block position-absolute h-100" style={{
                                                    width: '1px',
                                                    backgroundColor: '#dee2e6',
                                                    left: '0',
                                                    top: '0'
                                                }}></div>
                                                <div className="d-sm-none mb-3 mt-3"
                                                     style={{height: '1px', backgroundColor: '#dee2e6'}}></div>
                                                <label className="form-label" style={{fontWeight: "bold"}}>Phương thức thanh
                                                    toán</label>
                                                <div>
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            id="codPayment"
                                                            value="cod"
                                                            checked={paymentMethod === 'cod'}
                                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                                        />
                                                        <label className="form-check-label" htmlFor="codPayment">
                                                            Thanh toán khi nhận hàng
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            id="paypalPayment"
                                                            value="paypal"
                                                            checked={paymentMethod === 'paypal'}
                                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                                        />
                                                        <label className="form-check-label" htmlFor="paypalPayment">
                                                            Thanh toán bằng PayPal
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {paymentMethod === 'cod' ? (
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100"
                                        disabled={loading}
                                        onClick={handleCODOrder}
                                    >
                                        {loading ? 'Đang xử lý...' : 'Đặt hàng'}
                                    </button>
                                ) : (
                                    <PayPalButtons
                                        createOrder={handleCreateOrder}
                                        onApprove={handleApprove}
                                        onError={handleError}
                                        onCancel={handleCancel}
                                        style={{
                                            layout: "horizontal",
                                            color: "silver",
                                            height: 48,
                                            tagline: false,
                                            shape: "pill"
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <AddressModal
                    show={showAddressModal}
                    onHide={() => setShowAddressModal(false)}
                    addresses={addresses}
                    onSelectAddress={handleSelectAddress}
                    onEditAddress={handleEditAddress}
                    onAddAddress={handleAddAddress}
                />

                <EditAddressModal
                    show={showEditModal}
                    onHide={() => {
                        setShowEditModal(false);
                        setShowAddressModal(true);
                        setErrors({});
                        setEditingAddress(null);
                        setOriginalIsDefault(false);
                    }}
                    onActionModalAddress={actionModalAddress}
                    editingAddress={editingAddress}
                    originalIsDefault={originalIsDefault}
                    onUpdateAddress={handleUpdateAddress}
                    onChangeInput={handleOnChangeInput}
                    errors={errors}
                    onRenderError={renderError}
                />
            </div>
        </PayPalScriptProvider>
    );
};

export default CheckOutPage;