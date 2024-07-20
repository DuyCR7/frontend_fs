import React, {useState} from 'react';
import Rating from "../components/Rating.js";
import {Link} from "react-router-dom";

const title = "Our Products";

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

const CategoryShowCate = () => {

    const [items, setItems] = useState(ProductData);

    // category based filtering
    const filterItem = (cateItem) => {
        const updateItems = ProductData.filter((curElem) => {
            return curElem.cate === cateItem;
        })

        setItems(updateItems);
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
                    <h2 className="title">{title}</h2>
                    <div className="course-filter-group">
                        <ul className="lab-ul">
                            <li onClick={() => setItems(ProductData)}>All</li>
                            <li onClick={() => filterItem("Shoes")}>Shoes</li>
                            <li onClick={() => filterItem("Bags")}>Bags</li>
                            <li onClick={() => filterItem("Phones")}>Phones</li>
                            <li onClick={() => filterItem("Beauty")}>Beauty</li>
                        </ul>
                    </div>
                </div>

                {/*section body*/}
                <div className="section-wrapper">
                    <div className="row g-4 justify-content-center row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1
                    course-filter-group">
                        {
                            items.map((item, index) => {
                                return (
                                    <div key={item.id} className="col">
                                        <div className="course-item style-4">
                                            <div className="course-inner">
                                                <div className="course-thumb">
                                                    <img src={item.imgUrl} alt="" />
                                                    <div className="course-category">
                                                        <div className="course-cate">
                                                            <a href="#">{item.cate}</a>
                                                        </div>
                                                        <div className="course-reiew">
                                                            <Rating/>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/*content*/}
                                                <div className="course-content">
                                                    <Link to={`/shop/${item.id}`}><h6>{item.title}</h6></Link>
                                                    <div className="course-footer">
                                                        <div className="course-author">
                                                            <Link to="/" className="ca-name">{item.brand}</Link>
                                                        </div>
                                                        <div className="course-price" style={{color: "#000000"}}>
                                                            {item.price}
                                                        </div>
                                                    </div>
                                                </div>
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

export default CategoryShowCate;