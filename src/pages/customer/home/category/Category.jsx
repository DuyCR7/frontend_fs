import React, {useState} from 'react';
import "./category.scss"

const Category = () => {

    const [leftBg, setLeftBg] = useState("/admin/assets/img/clothing.png");
    const [rightTopBg, setRightTopBg] = useState("/admin/assets/img/fans.png");
    const [rightBottomBg, setRightBottomBg] = useState("/admin/assets/img/gifts.png");

    return (
        <div className="container-fluid category-container p-5" style={{background: "transparent"}}>
            <div className="row">
                <div className="col-12 mb-md-0 mb-3 col-md-8">
                    <div className="category-box" style={{ backgroundImage: `url(${leftBg})`}}>
                        <button className="btn btn-outline-primary">QUẦN ÁO</button>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="d-flex flex-column header-left">
                        <div className="row">
                            <div className="col-12 mb-3 mb-md-0">
                                <div className="category-box content-box-top" style={{backgroundImage: `url(${rightTopBg})`}}>
                                    <button className="btn btn-outline-primary">ĐỒ CỔ VŨ</button>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="category-box content-box-bottom" style={{backgroundImage: `url(${rightBottomBg})`}}>
                                    <button className="btn btn-outline-primary">QUÀ TẶNG</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Category;