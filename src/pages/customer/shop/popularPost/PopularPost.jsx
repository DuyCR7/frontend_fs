import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {getPopularPost} from "../../../../services/customer/postService";
import {formatDate} from "../../../../utils/formatDate";

const title = "Bài viết phổ biến";

const PopularPost = () => {

    const [popularPosts, setPopularPosts] = useState([]);

    useEffect(() => {
        fetchPopularPosts();
    }, []);

    const fetchPopularPosts = async () => {
        try {
            let res = await getPopularPost();
            if (res && res.EC === 0) {
                setPopularPosts(res.DT);
            } else {
                console.log('Error:', res.EM);
            }
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="widget widget-post mt-4 mt-md-0">
            <div className="widget-header">
                <h5 className="title">{title}</h5>
            </div>

            <ul className="widget-wrapper">
                {
                    popularPosts && popularPosts.length > 0 &&
                    popularPosts.map((item, index) => {
                        return (
                            <li key={index} className="d-flex flex-wrap justify-content-between">
                                <div className="post-thumb">
                                    <Link to={`/blogs/${item.slug}`}><img src={`${process.env.REACT_APP_URL_BACKEND}/${item.image}`} alt={`${process.env.REACT_APP_URL_BACKEND}/${item.image}`}/></Link>
                                </div>
                                <div className="post-content">
                                    <Link to={`/blogs/${item.slug}`}><h5>{item.title}</h5></Link>
                                    <p>{formatDate(item.createdAt)}</p>
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