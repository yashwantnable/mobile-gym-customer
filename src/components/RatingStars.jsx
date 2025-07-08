import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const RatingStars = ({ rating, totalReviews }) => {
    const stars = [];

    for (let i = 0; i < 5; i++) {
        if (i < Math.floor(rating)) {
            stars.push(<FaStar key={i} className="text-yellow-400" size={12} />);
        } else if (i < rating) {
            stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" size={12} />);
        } else {
            stars.push(<FaRegStar key={i} className="text-gray-200" size={12} />);
        }
    }

    return (
        <div className="flex items-center">
            <div className="flex mr-1">
                {stars}
            </div>
            <span className="text-xs text-gray-500">
                {totalReviews} reviews
            </span>
        </div>
    );
};

export default RatingStars;
