import React, {useEffect, useState} from 'react';
import parse from 'html-react-parser';
import {Link} from "react-router-dom";
import "./blog.scss";
import {getPosts} from "../../../../services/customer/homeService";
import {formatDate} from "../../../../utils/formatDate";
import { FiUser } from "react-icons/fi";

const Blog = () => {

    const [listPosts, setListPosts] = useState([]);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            let res = await getPosts();
            if (res && res.EC === 0) {
                setListPosts(res.DT);
            } else {
                console.error(res.EM);
            }
        } catch (e) {
            console.error(e);
        }
    }

    const truncateContent = (content, maxLength = 150) => {
        const strippedContent = content.replace(/<[^>]+>/g, '');
        if (strippedContent.length <= maxLength) return content;
        return strippedContent.slice(0, maxLength) + '...';
    };

    return (
        <>
            <div className="home-blog blog-section section-bg">
                <div className="d-flex justify-content-center align-items-center pt-5 mb-5">
                    <h2 className="title text-uppercase" style={{color: "red"}}>Bài viết</h2>
                </div>
                <div className="container-fluid ps-5 pe-5">
                    <div className="section-wrapper">
                        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 justify-content-center g-4">
                            {
                                listPosts.length > 0 && listPosts.map((item, index) => {
                                    return (
                                        <div key={item.id} className="col">
                                            <div className="post-item">
                                                <div className="post-inner">
                                                    <div className="post-thumb">
                                                        <Link to={`/blogs/${item.slug}`}><img
                                                            src={`${process.env.REACT_APP_URL_BACKEND}/${item.image}`}
                                                            alt=""/></Link>
                                                    </div>
                                                    <div className="post-content">
                                                        <Link to={`/blogs/${item.slug}`}><h4>{item.title}</h4></Link>
                                                        <div className="meta-post">
                                                            <ul className="lab-ul">
                                                                <li>
                                                                    <i className="icofont-ui-user"></i>{item.User.username}
                                                                </li>
                                                                <li>
                                                                    <i className="icofont-calendar"></i>{formatDate(item.createdAt)}
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <p>{parse(truncateContent(item.content))}</p>
                                                    </div>
                                                    <div className="post-footer">
                                                        <div className="pf-left">
                                                            <Link to={`/blogs/${item.slug}`}
                                                                  className="lab-btn-text">Đọc thêm <i
                                                                className="icofont-external-link">

                                                            </i></Link>
                                                        </div>
                                                        {/*<div className="pf-right">*/}
                                                        {/*    <i className="icofont-eye-alt"></i>*/}
                                                        {/*    <span className="comment-count">{item.views}</span>*/}
                                                        {/*</div>*/}
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
                <div className="d-flex justify-content-center align-items-center mt-5">
                    <Link to='/blogs'>
                        <button className="btn btn-outline-primary">Xem tất cả bài viết</button>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Blog;