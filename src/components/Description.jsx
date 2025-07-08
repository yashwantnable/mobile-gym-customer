import { useState } from 'react';

const Description = ({ description = "", length }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleExpand = () => setIsExpanded(!isExpanded);

    const MAX_LENGTH = length ? length :  300;
    const shouldTruncate = description.length > MAX_LENGTH;
    const displayedText = isExpanded ? description : description.slice(0, MAX_LENGTH);

    return (
        <div className="text-sm font-medium mb-1 capitalize text-fifth">
            {displayedText}
            {shouldTruncate && !isExpanded && '...'}
            {shouldTruncate && (
                <button
                    className="ml-1 text-blue-600 hover:underline"
                    onClick={(e) => {
                        e.preventDefault(); 
                        e.stopPropagation();
                        toggleExpand();
                    }}
                >
                    {isExpanded ? 'Read less' : 'Read more'}
                </button>
            )}
        </div>
    );
};

export default Description;
