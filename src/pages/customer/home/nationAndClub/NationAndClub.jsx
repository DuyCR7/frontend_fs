import React, {useState} from 'react';
import "./nationAndClub.scss";
import {Link} from "react-router-dom";

const NationAndClub = () => {
    const [topBg, setTopBg] = useState('/admin/assets/img/home-nations.png');
    const [bottomBg, setBottomBg] = useState('/admin/assets/img/clb12.png');

    return (
        <div className="container-fluid nation-club p-5" style={{background: "transparent"}}>
            <div className="row">
                <div className="nation-club-bg col-12 col-md-6" style={{backgroundImage: `url(${topBg})`}}></div>
                <div className="nation-club-content col-12 col-md-6" style={{backgroundColor: "#f0f2f5"}}>
                    <h4>BỘ SƯU TẬP ĐỘI TUYỂN QUỐC GIA</h4>
                    <p>Mua bộ sưu tập các sản phẩm quần áo thuộc đội tuyển quốc gia cùng với các sản phẩm cổ vũ như cờ, mũ, khăn quàng cổ, và nhiều hơn nữa. Dù bạn ủng hộ đội tuyển nào, chúng tôi đều sẵn sàng hỗ trợ bạn.</p>
                    <Link to={'/shops/doi-tuyen-quoc-gia'}>
                        <button className="btn btn-outline-primary">Mua ngay</button>
                    </Link>
                </div>
            </div>
            <div className="row">
                <div className="nation-club-content col-12 col-md-6 order-2 order-md-1" style={{backgroundColor: "#f0f2f5"}}>
                    <h4>BỘ SƯU TẬP CÂU LẠC BỘ</h4>
                    <p>Mua bộ sưu tập các sản phẩm quần áo thuộc các câu lạc bộ cùng với các sản phẩm cổ vũ như cờ, mũ, khăn quàng cổ, và nhiều hơn nữa. Dù bạn ủng hộ câu lạc bộ nào, chúng tôi đều sẵn sàng hỗ trợ bạn.</p>
                    <Link to={'/shops/cau-lac-bo'}>
                        <button className="btn btn-outline-primary">Mua ngay</button>
                    </Link>
                </div>
                <div className="nation-club-bg col-12 col-md-6 order-1 order-md-2" style={{backgroundImage: `url(${bottomBg})`}}>
                </div>
            </div>
        </div>
    );
};

export default NationAndClub;