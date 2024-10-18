import React, {useState} from 'react';
import parse from 'html-react-parser';
import {formatDate} from "../../../../utils/formatDate";
import RatingOnlyView from "../../components/rating/RatingOnlyView";
import "./review.scss";

const Review = (props) => {

    const [reviewShow, setReviewShow] = useState(true);
    const { reviews, description } = props.productData;
console.log(reviews);
    return (
        <div className="review-section">
            <ul className={`review-nav lab-ul ${reviewShow ? "RevActive" : "DescActive"}`}>
                <li className="desc" onClick={() => setReviewShow(!reviewShow)}>Mô tả</li>
                <li className="rev" onClick={() => setReviewShow(!reviewShow)}>Đánh giá 4</li>
            </ul>

            {/*desc & review content*/}
            <div className={`review-content ${reviewShow ? "review-content-show" : "description-show"}`}>
                <div className="review-showing">
                    <ul className="content lab-ul">
                        {
                            reviews.length > 0 ? reviews.map((item, index) => {
                                return (
                                    <li key={item.id} className="item-review">
                                        <div className="post-thumb">
                                            <img src={item.Customer.image.startsWith('https')
                                                ? item.Customer.image
                                                : `${process.env.REACT_APP_URL_BACKEND}/${item.Customer.image}`}
                                                 alt={item.Customer.username} alt=""/>
                                        </div>
                                        <div className="post-content">
                                            <div className="entry-meta">
                                                <div className="posted-on">
                                                    <div className="review-info">
                                                        <p className="fs-4 fw-bold">{item.Customer.email ? item.Customer.email : item.Customer.username}</p>
                                                        <p>{formatDate(item.updatedAt)}</p>
                                                    </div>
                                                    <div className="review-rating">
                                                        <RatingOnlyView value={item.rating}/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="entry-content">
                                                <p>{item.comment}</p>
                                            </div>
                                        </div>
                                    </li>
                                )
                            }) : (
                                <div className="fs-4 fw-bold py-3 text-center">Chưa có đánh giá nào</div>
                            )
                        }
                    </ul>
                </div>

                {/*description*/}
                <div className="description">
                    {parse(description)}
                </div>
            </div>
        </div>
    );
};

export default Review;