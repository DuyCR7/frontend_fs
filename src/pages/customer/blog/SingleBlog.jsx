import React, {useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import PageHeader from "../components/pageHeader/PageHeader.jsx";
import Tags from "../shop/tags/Tags.jsx";
import PopularPost from "../shop/popularPost/PopularPost.jsx";
import {getSinglePost, incrementViewCount} from "../../../services/customer/postService";
import {Spin} from "antd";
import NotFoundPageCus from "../../../components/NotFoundPageCus/NotFoundPageCus";
import {formatDate} from "../../../utils/formatDate";
import parse from "html-react-parser";

const SingleBlog = () => {

    const {slug} = useParams();
    const [currentPost, setCurrentPost] = useState({});
    const [previousPost, setPreviousPost] = useState({});
    const [nextPost, setNextPost] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [viewCount, setViewCount] = useState(0);

    useEffect(() => {
        fetchSinglePost();
    }, [slug]);

    const fetchSinglePost = async () => {
        try {
            let res = await getSinglePost(slug);
            if (res && res.EC === 0) {
                setCurrentPost(res.DT.currentPost);
                setPreviousPost(res.DT.previousPost);
                setNextPost(res.DT.nextPost);

                let updatedViewCount = await incrementViewCount(slug);
                setViewCount(updatedViewCount.DT);
            } else {
                setError(res.DT);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div
                className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
                style={{zIndex: 9999}}>
                <Spin size="large"/>
            </div>
        );
    }

    if (Object.keys(currentPost).length === 0 && error === 'not-found') {
        return <NotFoundPageCus/>
    }

    return (
        <div>
            <PageHeader title={"Chi tiết bài viết"} curPage={"Bài viết / Chi tiết"}/>

            <div className="blog-section blog-single padding-tb section-bg">
                <div className="container-fluid ps-5 pe-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-12">
                            {/*left sight*/}
                            <article>
                                <div className="section-wrapper">
                                    <div className="row row-cols-1 justify-content-center g-4">
                                        <div className="col">
                                            <div className="post-item style-2">
                                                <div className="post-inner">
                                                    <div>
                                                        <div className="post-thumb">
                                                            <img src={`${process.env.REACT_APP_URL_BACKEND}/${currentPost.image}`} alt=""
                                                                 className="w-100"/>
                                                        </div>
                                                        <div className="post-content">
                                                            <h3>{currentPost.title}</h3>
                                                            <div className="meta-post">
                                                                <ul className="lab-ul">
                                                                    <li>
                                                                        <i className="icofont-ui-user"></i>{currentPost.User.username}
                                                                    </li>
                                                                    <li>
                                                                        <i className="icofont-calendar"></i>{formatDate(currentPost.createdAt)}
                                                                    </li>
                                                                    <li>
                                                                        <i className="icofont-eye"></i>{viewCount} lượt xem
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            {parse(currentPost.content)}
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                            <div className="navigations-part">
                                                <div className="left">
                                                    {previousPost && (
                                                        <>
                                                            <Link to={`/blogs/${previousPost.slug}`} className="prev">
                                                                <i className="icofont-double-left"></i> Bài viết trước
                                                            </Link>
                                                            <Link to={`/blogs/${previousPost.slug}`} className="title">
                                                                {previousPost.title}
                                                            </Link>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="right">
                                                    {nextPost && (
                                                        <>
                                                            <Link to={`/blogs/${nextPost.slug}`} className="next">
                                                                Bài viết sau <i className="icofont-double-right"></i>
                                                            </Link>
                                                            <Link to={`/blogs/${nextPost.slug}`} className="title">
                                                                {nextPost.title}
                                                            </Link>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>
                        <div className="col-lg-4 col-12">
                            {/*right sight*/}
                            <aside>
                                <Tags/>
                                <PopularPost/>
                            </aside>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleBlog;