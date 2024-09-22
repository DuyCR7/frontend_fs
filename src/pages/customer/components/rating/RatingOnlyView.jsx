import React from 'react';
import './ratingOnlyView.scss';
import {FaStar, FaStarHalfAlt} from "react-icons/fa";

const RatingOnlyView = ({value}) => {
    const renderStars = () => {
        const stars = [];
        const fullStars = Math.floor(value);
        const hasHalfStar = value % 1 !== 0;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(
                    <FaStar
                        key={i}
                        className="star filled"
                    />
                );
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(
                    <FaStarHalfAlt
                        key={i}
                        className="star filled"
                    />
                );
            } else {
                stars.push(
                    <FaStar
                        key={i}
                        className="star"
                    />
                );
            }
        }

        return stars;
    };

    return (
        <div className="rating-only-view">
            {renderStars()}

            <span className="rating-value">
                ({value.toFixed(1)})
            </span>
        </div>
    );
};

export default RatingOnlyView;