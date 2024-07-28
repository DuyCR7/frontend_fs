import React from 'react';
import PageHeader from "../components/pageHeader/PageHeader.jsx";
import blogList from "../../../utils/blogdata"
import {Link} from "react-router-dom";

const Blog = () => {
    return (
        <div>
            <PageHeader title="Bài viết" curPage="Bài viết" />
            <div className="blog-section padding-tb section-bg">
                <div className="container-fluid ps-5 pe-5">
                    <div className="section-wrapper">
                        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 justify-content-center g-4">
                            {
                                blogList.map((item, index) => {
                                    return (
                                        <div key={index} className="col">
                                            <div className="post-item">
                                                <div className="post-inner">
                                                    <div className="post-thumb">
                                                        <Link to={`/blog/${item.id}`}><img src={item.imgUrl} alt=""/></Link>
                                                    </div>
                                                    <div className="post-content">
                                                        <Link to={`/blog/${item.id}`}><h4>{item.title}</h4></Link>
                                                        <div className="meta-post">
                                                            <ul className="lab-ul">
                                                                {
                                                                    item.metaList.map((val, i) => {
                                                                        return (
                                                                            <li key={i}><i className={val.iconName}></i>{val.text}</li>
                                                                        )
                                                                    })
                                                                }
                                                            </ul>
                                                        </div>
                                                        <p>{item.desc}</p>
                                                    </div>
                                                    <div className="post-footer">
                                                        <div className="pf-left">
                                                            <Link to={`/blog/${item.id}`} className="lab-btn-text">{item.btnText} <i
                                                            className="icofont-external-link">

                                                            </i></Link>
                                                        </div>
                                                        <div className="pf-right">
                                                            <i className="icofont-comment"></i>
                                                            <span className="comment-count">{item.commentCount}</span>
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
        </div>
    );
};

export default Blog;