import React from 'react';
import {Link} from "react-router-dom";

const title = "Bài viết phổ biến";

const postList = [{
    id: 1,
    imgUrl: '/admin/assets/img/examples/example1.jpeg',
    imgAlt: 'rajibraj91',
    title: 'Poor People Campaign Our Resources',
    date: 'Jun 05,2022',
}, {
    id: 2,
    imgUrl: '/admin/assets/img/examples/example1.jpeg',
    imgAlt: 'rajibraj91',
    title: 'Poor Peoples Campaign Our Resources',
    date: 'Jun 05,2022',
}, {
    id: 3,
    imgUrl: '/admin/assets/img/examples/example1.jpeg',
    imgAlt: 'rajibraj91',
    title: 'Poor Peoples Campaign Our Resources',
    date: 'Jun 05,2022',
}, {
    id: 4,
    imgUrl: '/admin/assets/img/examples/example1.jpeg',
    imgAlt: 'rajibraj91',
    title: 'Poor Peoples Campaign Our Resources',
    date: 'Jun 05,2022',
},]

const PopularPost = () => {
    return (
        <div className="widget widget-post mt-3">
            <div className="widget-header">
                <h5 className="title">{title}</h5>
            </div>

            <ul className="widget-wrapper">
                {
                    postList.map((item, index) => {
                        return (
                            <li key={index} className="d-flex flex-wrap justify-content-between">
                                <div className="post-thumb">
                                    <Link to={`/blog/${item.id}`}><img src={item.imgUrl} alt=""/></Link>
                                </div>
                                <div className="post-content">
                                    <Link to={`/blog/${item.id}`}><h5>{item.title}</h5></Link>
                                    <p>{item.date}</p>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    );
};

export default PopularPost;