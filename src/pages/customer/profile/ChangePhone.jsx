import React, {useEffect, useState} from 'react';
import "./changePhone.scss";
import {useLocation, useNavigate} from "react-router-dom";
import PageHeader from "../components/pageHeader/PageHeader";
import {useSelector} from "react-redux";

const ChangePhone = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const customer = useSelector(state => state.customer);
    const [phone, setPhone] = useState('');

    useEffect(() => {
        // Kiểm tra xem người dùng đã đăng nhập chưa
        if (!customer || !customer.isAuthenticated) {
            navigate('/sign-in');
            return;
        }

        // Kiểm tra xem người dùng có đến từ trang hồ sơ không
        if (!location.state || (location.state.phone === undefined)) {
            navigate('/account/profiles');
            return;
        }

        setPhone(location.state.phone);
    }, [customer, location, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý logic xác thực số điện thoại ở đây
        console.log('Verifying phone:', phone);
        // Sau khi xác thực thành công, chuyển hướng về trang hồ sơ
        // navigate('/profile');
    };


    return (
        <div>
            <PageHeader title={"Thay đổi số điện thoại"} curPage={"Thay đổi số điện thoại"}/>
            {phone}
        </div>
    );
};

export default ChangePhone;