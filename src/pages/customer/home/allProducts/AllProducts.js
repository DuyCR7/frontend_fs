import React, {useState} from 'react';
import Rating from "../../components/rating/Rating.js";
import {Link} from "react-router-dom";

const title = "Xu hướng";

const ProductData = [
    {
        imgUrl: '/admin/assets/img/examples/example1.jpeg',
        cate: 'Shoes',
        title: 'Nike Premier X',
        author: 'assets/images/course/author/01.jpg',
        brand: 'Nike',
        price: '$199.00',
        id: 1,
    },
    {
        imgUrl: '/admin/assets/img/examples/example1.jpeg',
        cate: 'Bags',
        title: 'Asthetic Bags',
        author: 'assets/images/course/author/02.jpg',
        brand: 'D&J Bags',
        price: '$199.00',
        id: 2,
    },
    {
        imgUrl: '/admin/assets/img/examples/example1.jpeg',
        cate: 'Phones',
        title: 'iPhone 12',
        author: 'customer/assets/images/categoryTab/brand/apple.png',
        brand: 'Apple',
        price: '$199.00',
        id: 3,
    },
    {
        imgUrl: '/admin/assets/img/examples/example1.jpeg',
        cate: 'Bags',
        title: 'Hiking Bag 15 Nh100',
        author: 'assets/images/course/author/04.jpg',
        brand: 'Gucci',
        price: '$199.00',
        id: 4,
    },
    {
        imgUrl: '/admin/assets/img/examples/example1.jpeg',
        cate: 'Shoes',
        title: 'Outdoor Sports Shoes',
        author: 'assets/images/course/author/05.jpg',
        brand: 'Nike',
        price: '$199.00',
        id: 5,
    },
    {
        imgUrl: '/admin/assets/img/examples/example1.jpeg',
        cate: 'Beauty',
        title: 'COSRX Snail Mucin',
        author: 'assets/images/course/author/06.jpg',
        brand: 'Zaara',
        price: '$199.00',
        id: 6,
    },
    {
        imgUrl: '/admin/assets/img/examples/example1.jpeg',
        cate: 'Bags',
        title: 'Look Less Chanel Bag ',
        author: 'assets/images/course/author/01.jpg',
        brand: 'Gucci',
        price: '$199.00',
        id: 7,
    },
    {
        imgUrl: '/admin/assets/img/examples/example1.jpeg',
        cate: 'Shoes',
        title: 'Casual Sneakers',
        author: 'assets/images/course/author/02.jpg',
        brand: 'Bata',
        price: '$199.00',
        id: 8,
    },
];

const AllProducts = () => {

    const [items, setItems] = useState(ProductData);
    const [activeCategory, setActiveCategory] = useState('All');

    // category based filtering
    const filterItem = (cateItem) => {
        const updateItems = ProductData.filter((curElem) => {
            return curElem.cate === cateItem;
        })

        setItems(updateItems);
        setActiveCategory(cateItem);
    }

    return (
        <div className="course-section style-3 padding-tb">
            {/*shape*/}
            <div className="course-shape one">
                <img src="/admin/assets/img/examples/example1.jpeg" alt="" style={{width: "169px", height: "161px"}}/>
            </div>
            <div className="course-shape two">
                <img src="/admin/assets/img/examples/example1.jpeg" alt="" style={{width: "169px", height: "161px"}}/>
            </div>

            {/*main section*/}
            <div className="container-fluid ps-5 pe-5">
                {/*section header*/}
                <div className="section-header">
                    <h2 className="title" style={{ color: "red" }}>{title}</h2>
                    <div className="course-filter-group">
                        <ul className="lab-ul" style={{fontSize: "20px"}}>
                            {/* <li onClick={() => setItems(ProductData)}>All</li>
                            <li onClick={() => filterItem("Shoes")}>Shoes</li>
                            <li onClick={() => filterItem("Bags")}>Bags</li>
                            <li onClick={() => filterItem("Phones")}>Phones</li>
                            <li onClick={() => filterItem("Beauty")}>Beauty</li> */}
                            <li
                                className={activeCategory === 'All' ? 'active' : ''}
                                onClick={() => {
                                    setItems(ProductData);
                                    setActiveCategory('All');
                                }}
                            >
                                All
                            </li>
                            <li
                                className={activeCategory === 'Shoes' ? 'active' : ''}
                                onClick={() => filterItem("Shoes")}
                            >
                                Shoes
                            </li>
                            <li
                                className={activeCategory === 'Bags' ? 'active' : ''}
                                onClick={() => filterItem("Bags")}
                            >
                                Bags
                            </li>
                            <li
                                className={activeCategory === 'Phones' ? 'active' : ''}
                                onClick={() => filterItem("Phones")}
                            >
                                Phones
                            </li>
                            <li
                                className={activeCategory === 'Beauty' ? 'active' : ''}
                                onClick={() => filterItem("Beauty")}
                            >
                                Beauty
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={`shop-page`}>
                    <div className={`shop-product-wrap row justify-content-center grid`}>
                        {
                            items.map((item, index) => {
                                return (
                                    <div key={index} className="col-lg-3 col-md-4 col-sm-6 col-12">
                                        <div className="product-item">
                                            {/*product images*/}
                                            <div className="product-thumb">
                                                <div className="pro-thumb">
                                                    <img src={item.imgUrl} alt={item.imgUrl}/>
                                                </div>

                                                {/*product action links*/}
                                                <div className="product-action-link">
                                                    <Link to={`/shop/${item.id}`}><i className="icofont-eye"></i></Link>
                                                    <a href="#">
                                                        <i className="icofont-heart"></i>
                                                    </a>
                                                    <Link to="/cart-page"><i className="icofont-cart-alt"></i></Link>
                                                </div>
                                            </div>

                                            {/*product content*/}
                                            <div className="product-content">
                                                <h5>
                                                    <Link to={`/shop/${item.id}`}>{item.title}</Link>
                                                </h5>
                                                <p className="productRating">
                                                    <Rating/>
                                                </p>
                                                <h6>{item.price}</h6>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllProducts;