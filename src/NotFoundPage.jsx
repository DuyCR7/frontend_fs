import React from 'react';
import {useNavigate} from "react-router-dom";

const NotFoundPage = () => {
    const  navigate = useNavigate();
    return (
        <div className="container mt-5 text-center">
            <h1>404 Not Found</h1>
            <button className="btn btn-outline-primary" onClick={() => navigate('/')}>Trang chủ</button>
        </div>
    );
};

export default NotFoundPage;