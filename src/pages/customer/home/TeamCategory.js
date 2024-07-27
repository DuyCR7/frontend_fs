import React from 'react';
import {Link, useNavigate} from "react-router-dom";

const subTitle = "ĐẶC SẮC";
const title = "ĐỘI BÓNG";
const btnText = "Mua ngay";

const categoryList = [
    {
        imgUrl: '/admin/assets/img/examples/example1.jpeg',
        imgAlt: 'category rajibraj91 rajibraj',
        iconName: 'icofont-brand-windows',
        title: 'DSLR Camera',
    },
    {
        imgUrl: '/admin/assets/img/examples/example1.jpeg',
        imgAlt: 'category rajibraj91 rajibraj',
        iconName: 'icofont-brand-windows',
        title: 'Shoes',
    },
    {
        imgUrl: '/admin/assets/img/examples/example1.jpeg',
        imgAlt: 'category rajibraj91 rajibraj',
        iconName: 'icofont-brand-windows',
        title: 'Photography',
    },
    {
        imgUrl: '/admin/assets/img/examples/example1.jpeg',
        imgAlt: 'category rajibraj91 rajibraj',
        iconName: 'icofont-brand-windows',
        title: 'Formal Dress',
    },
    {
        imgUrl: '/admin/assets/img/examples/example1.jpeg',
        imgAlt: 'category rajibraj91 rajibraj',
        iconName: 'icofont-brand-windows',
        title: 'Colorful Bags',
    },
    {
        imgUrl: '/admin/assets/img/examples/example1.jpeg',
        imgAlt: 'category rajibraj91 rajibraj',
        iconName: 'icofont-brand-windows',
        title: 'AdApp Decor',
    },
];

const TeamCategory = () => {

    const navigate = useNavigate();

    return (
        <div className="category-section style-4 padding-tb">
            <div className="container-fluid ps-5 pe-5">
                {/*section header*/}
                <div className="section-header text-center">
                    <span className="subtitle">{subTitle}</span>
                    <h2 className="title">{title}</h2>
                </div>

                {/*section card*/}
                <div className="section-wrapper">
                    <div className="row g-4 justify-content-center row-cols-md-5 row-cols-sm-3 row-cols-1">
                        {
                            categoryList.map((item, index) => {
                                return (
                                    <div key={index} className="col">
                                        <Link to="/shop" className="category-item">
                                            <div className="category-inner">
                                                {/*image thumbnail*/}
                                                <div className="category-thumb">
                                                    <img src={item.imgUrl} alt={item.imgAlt}  />
                                                </div>

                                                {/*content*/}
                                                <div className="category-content">
                                                    <div className="cate-icon" style={{color: "#1877f2", background: "#f0f2f5"}}>
                                                        <i className={item.iconName}></i>
                                                    </div>
                                                    <h6>{item.title}</h6>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div className="text-center mt-5">
                        <button onClick={() => navigate('/shop')} className="btn btn-outline-primary">
                            {btnText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamCategory;