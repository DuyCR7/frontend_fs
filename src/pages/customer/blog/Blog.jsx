import React, {useEffect, useState} from 'react';
import PageHeader from "../components/pageHeader/PageHeader.jsx";
import blogList from "../../../utils/blogdata"
import {Link} from "react-router-dom";
import {getAllPost} from "../../../services/customer/postService";
import {formatDate} from "../../../utils/formatDate";
import parse from "html-react-parser";

const Blog = () => {

    const [listPosts, setListPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAllPosts();
    }, []);

    const fetchAllPosts = async () => {
        setLoading(true);
        try {
            let res = await getAllPost();
            if(res && res.EC === 0) {
                setListPosts(res.DT);
            } else {
                console.log("Error: ", res);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const truncateContent = (content, maxLength = 150) => {
        const strippedContent = content.replace(/<[^>]+>/g, '');
        if (strippedContent.length <= maxLength) return content;
        return strippedContent.slice(0, maxLength) + '...';
    };

    return (
        <div>
            <PageHeader title="Bài viết" curPage="Bài viết" />
            <div className="blog-section padding-tb section-bg">
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
            </div>
        </div>
    );
};

export default Blog;