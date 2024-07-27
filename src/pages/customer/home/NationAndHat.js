import React, {useState} from 'react';
import "./nationAndHat.scss";

const NationAndHat = () => {
    const [topBg, setTopBg] = useState('/admin/assets/img/home-nations.png');
    const [bottomBg, setBottomBg] = useState('/admin/assets/img/fan-original-hats.png');

    return (
        <div className="container-fluid nation-hat p-5" style={{background: "transparent"}}>
            <div className="row">
                <div className="nation-hat-bg col-12 col-md-6" style={{backgroundImage: `url(${topBg})`}}></div>
                <div className="nation-hat-content col-12 col-md-6" style={{backgroundColor: "#f0f2f5"}}>
                    <h4>BỘ SƯU TẬP ĐỘI BÓNG</h4>
                    <p>Mua bộ sưu tập áo sơ mi cổ điển của Home Nations và quần áo ủng hộ, cờ, mũ, khăn quàng cổ, v.v. Cho dù bạn ủng hộ Anh hay Scotland tại Euro, hay Bắc Ireland hay xứ Wales, chúng tôi đều sẵn sàng hỗ trợ bạn.</p>
                    <button className="btn btn-outline-primary">Mua ngay</button>
                </div>
            </div>
            <div className="row">
                <div className="nation-hat-content col-12 col-md-6 order-2 order-md-1" style={{backgroundColor: "#f0f2f5"}}>
                    <h4>MŨ CỔ VŨ CHÍNH HÃNG</h4>
                    <p>Cỗ vũ cho đội hoặc quốc gia của bạn bằng một trong nhiều thiết kế mũ đầy phong cách của chúng tôi.</p>
                    <button className="btn btn-outline-primary">Mua ngay</button>
                </div>
                <div className="nation-hat-bg col-12 col-md-6 order-1 order-md-2" style={{backgroundImage: `url(${bottomBg})`}}>
                </div>
            </div>
        </div>
    );
};

export default NationAndHat;