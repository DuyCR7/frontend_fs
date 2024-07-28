import React, {useState} from 'react';
import blogList from "../../../utils/blogdata";
import {useParams} from "react-router-dom";
import PageHeader from "../components/pageHeader/PageHeader.js";
import Tags from "../shop/tags/Tags.js";
import PopularPost from "../shop/popularPost/PopularPost.js";

const socialList = [{link: "#", iconName: "icofont-facebook", className: "facebook",}, {
    link: "#",
    iconName: "icofont-instagram",
    className: "instagram",
}];

const SingleBlog = () => {

    const [blog, setBlog] = useState(blogList);
    const {id} = useParams();

    const result = blogList.filter((blog) => blog.id === +id);

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
                                                    {
                                                        result.map((item) => {
                                                            return (
                                                                <div key={item.id}>
                                                                    <div className="post-thumb">
                                                                        <img src={item.imgUrl} alt=""
                                                                             className="w-100"/>
                                                                    </div>
                                                                    <div className="post-content">
                                                                        <h3>{item.title}</h3>
                                                                        <div className="meta-post">
                                                                            <ul className="lab-ul">
                                                                                {
                                                                                    item.metaList.map((val, i) => {
                                                                                        return (
                                                                                            <li key={i}><i
                                                                                                className={val.iconName}></i> {val.text}
                                                                                            </li>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </ul>
                                                                        </div>
                                                                        <p>{item.desc}</p>

                                                                        <blockquote>
                                                                            <p>{item.desc}</p>
                                                                            <cite>
                                                                                <a href="#">...Vu Duc Duy</a>
                                                                            </cite>
                                                                        </blockquote>

                                                                        <p>{item.desc}</p>

                                                                        <img src="/admin/assets/img/examples/example1.jpeg"
                                                                             alt=""/>

                                                                        <p>{item.desc}</p>

                                                                        <div className="video-thumb">
                                                                            <img
                                                                                src="/admin/assets/img/examples/example1.jpeg"
                                                                                alt=""/>
                                                                            <a href="https://youtu.be/bVAxHPEHOVE?si=jNco0YQlScD2luLG"
                                                                               className="video-button popup"
                                                                               target="_blank">
                                                                                <i className="icofont-ui-play"></i>
                                                                            </a>
                                                                        </div>

                                                                        <p>{item.desc}</p>

                                                                        <div className="tags-section">
                                                                            <ul className="lab-ul social-icons">
                                                                                {
                                                                                    socialList.map((item, index) => {
                                                                                        return (
                                                                                            <li key={index}>
                                                                                                <a href="#"
                                                                                                   className={item.className}>
                                                                                                    <i className={item.iconName}></i>
                                                                                                </a>
                                                                                            </li>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>

                                            <div className="navigations-part">
                                                <div className="left">
                                                    <a href="#" className="prev">
                                                        <i className="icofont-double-left"></i> Bài viết trước
                                                    </a>
                                                    <a href="#" className="title">
                                                        Evisculate Parallel Processes vis Technica Sound Models
                                                        Authoritative
                                                    </a>
                                                </div>
                                                <div className="right">
                                                    <a href="#" className="next">
                                                        <i className="icofont-double-right"></i> Bài viết sau
                                                    </a>
                                                    <a href="#" className="title">
                                                        Evisculate Parallel Processes vis Technica Sound Models
                                                        Authoritative
                                                    </a>
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
                                <Tags />
                                <PopularPost />
                            </aside>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleBlog;