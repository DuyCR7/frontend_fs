import {useState} from "react";
import './starRating.scss';
import {FaStar} from "react-icons/fa";

const StarRating = ({rating, onRatingChange, readOnly = false}) => {

    const [hoverRating, setHoverRating] = useState(0);

    const handleMouseEnter = (index) => {
        if (!readOnly) {
            setHoverRating(index);
        }
    };

    const handleMouseLeave = () => {
        if (!readOnly) {
            setHoverRating(0);
        }
    };

    const handleClick = (index) => {
        if (!readOnly) {
            onRatingChange(index);
        }
    };

    return (
        <div className={`star-rating ${readOnly ? 'read-only' : ''}`}>
            {[...Array(5)].map((_, index) => {
                return (
                    <span
                        key={index}
                        className={`${index + 1 <= (hoverRating || rating) ? 'selected' : ''}`}
                        onClick={() => handleClick(index + 1)}
                        onMouseEnter={() => handleMouseEnter(index + 1)}
                        onMouseLeave={handleMouseLeave}
                    >
                        {/*&#9733;*/}
                        <FaStar />
                    </span>
                )
            })}
        </div>
    );
};

export default StarRating;