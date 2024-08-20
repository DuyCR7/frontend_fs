import React from 'react';
import { useNavigate } from "react-router-dom";
import { TiHomeOutline } from "react-icons/ti";
import './notFoundPageCus.scss';

const NotFoundPageCus = () => {
    const navigate = useNavigate();

    return (
        <div className="not-found-page">
            <div className="content">
                <h1>404</h1>
                <p className="message">Trang không tồn tại</p>
                <p className="description">Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.</p>
                <button onClick={() => navigate('/')} className="home-button">
                    <TiHomeOutline size={24}/>
                    Về trang chủ
                </button>
            </div>
        </div>
    );
};

export default NotFoundPageCus;