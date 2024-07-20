import React, {useState} from 'react';
import Rating from "../components/Rating.js";

const reviewtitle = "Add a Review";

let ReviewList = [{
    imgUrl: "/admin/assets/img/examples/01.jpg",
    imgAlt: "Client thumb",
    name: "Ganelon Boileau",
    date: "Posted on Jun 10, 2022 at 6:57 am",
    desc: "Enthusiast build innovativ initiatives before lonterm high-impact awesome theme seo psd porta monetize covalent leadership after without resource.",
}, {
    imgUrl: "/admin/assets/img/examples/01.jpg",
    imgAlt: "Client thumb",
    name: "Morgana Cailot",
    date: "Posted on Jun 10, 2022 at 6:57 am",
    desc: "Enthusiast build innovativ initiatives before lonterm high-impact awesome theme seo psd porta monetize covalent leadership after without resource.",
}, {
    imgUrl: "/admin/assets/img/examples/01.jpg",
    imgAlt: "Client thumb",
    name: "Telford Bois",
    date: "Posted on Jun 10, 2022 at 6:57 am",
    desc: "Enthusiast build innovativ initiatives before lonterm high-impact awesome theme seo psd porta monetize covalent leadership after without resource.",
}, {
    imgUrl: "/admin/assets/img/examples/01.jpg",
    imgAlt: "Client thumb",
    name: "Cher Daviau",
    date: "Posted on Jun 10, 2022 at 6:57 am",
    desc: "Enthusiast build innovativ initiatives before lonterm high-impact awesome theme seo psd porta monetize covalent leadership after without resource.",
},];

const Review = () => {

    const [reviewShow, setReviewShow] = useState(true);

    return (
        <>
            <ul className={`review-nav lab-ul ${reviewShow ? "RevActive" : "DescActive"}`}>
                <li className="desc" onClick={() => setReviewShow(!reviewShow)}>Description</li>
                <li className="rev" onClick={() => setReviewShow(!reviewShow)}>Reviews 4</li>
            </ul>

            {/*desc & review content*/}
            <div className={`review-content ${reviewShow ? "review-content-show" : "description-show"}`}>
                <div className="review-showing">
                    <ul className="content lab-ul">
                        {
                            ReviewList.map((item, index) => {
                                return (
                                    <li key={index}>
                                        <div className="post-thumb">
                                            <img src={item.imgUrl} alt=""/>
                                        </div>
                                        <div className="post-content">
                                            <div className="entry-meta">
                                                <div className="posted-on">
                                                    <a href="#">{item.name}</a>
                                                    <p>{item.date}</p>
                                                </div>
                                            </div>
                                            <div className="entry-content">
                                                <p>{item.desc}</p>
                                            </div>
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>

                    {/*add review*/}
                    <div className="client-review">
                        <div className="review-form">
                            <div className="review-title">
                                <h5>{reviewtitle}</h5>
                            </div>

                            <form action="action" className="row">
                                <div className="col-md-4 col-12">
                                    <input type="text" name="name" id="name" placeholder="Full Name *"/>
                                </div>
                                <div className="col-md-4 col-12">
                                    <input type="email" name="email" id="email" placeholder="Your Email *"/>
                                </div>
                                <div className="col-md-4 col-12">
                                    <div className="rating">
                                        <span className="me-2">Your Rating</span>
                                        <Rating />
                                    </div>
                                </div>
                                <div className="col-md-12 col-12">
                                    <textarea name="message" id="message" rows="8" placeholder="Type Here Message"></textarea>
                                </div>

                                <div className="col-12">
                                    <button type="submit" className="default-button">
                                        <span>Submit Review</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/*description*/}
                <div className="description">
                    <p>Introducing our state-of-the-art wireless earbuds, designed to deliver an unparalleled audio
                        experience. These sleek and stylish earbuds feature advanced noise-cancellation technology,
                        ensuring crystal-clear sound quality in any environment. With a comfortable, ergonomic design,
                        they fit snugly in your ears for hours of listening pleasure. The long-lasting battery life
                        provides up to 8 hours of continuous playtime, and the portable charging case adds an additional
                        24 hours, making them perfect for on-the-go use. Seamlessly connect to your devices via
                        Bluetooth
                        5.0 for a stable and efficient connection. Elevate your audio experience with our cutting-edge
                        wireless
                        earbuds.
                    </p>

                    <div className="post-item">
                        <div className="post-thumb">
                            <img src="/admin/assets/img/examples/example1.jpeg" alt=""/>
                        </div>
                        <div className="post-content">
                            <ul className="lab-ul">
                                <li>Elevate your audio experience with our cutting-edge wireless earbuds.</li>
                                <li>Elevate your audio experience with our cutting-edge wireless earbuds.</li>
                                <li>Elevate your audio experience with our cutting-edge wireless earbuds.</li>
                                <li>Elevate your audio experience with our cutting-edge wireless earbuds.</li>
                                <li>Elevate your audio experience with our cutting-edge wireless earbuds.</li>
                                <li>Elevate your audio experience with our cutting-edge wireless earbuds.</li>
                            </ul>
                        </div>
                    </div>

                    <p>Introducing our state-of-the-art wireless earbuds, designed to deliver an unparalleled audio
                        experience. These sleek and stylish earbuds feature advanced noise-cancellation technology,
                        ensuring crystal-clear sound quality in any environment. With a comfortable, ergonomic design,
                        they fit snugly in your ears for hours of listening pleasure. The long-lasting battery life
                        provides up to 8 hours of continuous playtime, and the portable charging case adds an additional
                        24 hours, making them perfect for on-the-go use. Seamlessly connect to your devices via
                        Bluetooth
                        5.0 for a stable and efficient connection. Elevate your audio experience with our cutting-edge
                        wireless
                        earbuds.
                    </p>
                </div>
            </div>
        </>
    );
};

export default Review;