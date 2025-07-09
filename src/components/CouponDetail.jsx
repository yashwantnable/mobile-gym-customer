import { FaCopy, FaCheck } from "react-icons/fa";

const CouponDetail = ({ title, offer, code, terms, logo, onCopy, copied }) => {
    const getPlaceholderImage = () => {
        const colors = ['21C8B1'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        return `https://dummyimage.com/500x500/${randomColor}/fff&text=${encodeURIComponent(title.substring(0, 15))}`;
    };

    return (
        <div className="bg-white rounded-xl overflow-hidden">
            {/* Coupon Header */}
            <div className="bg-[#353535] p-4 text-white">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-[#FCEEE5]">{offer}</p>
            </div>

            {/* Coupon Content */}
            <div className="p-6">
                {/* Logo and Offer */}
                <div className="flex flex-col items-center mb-6">
                    {logo ? <img
                        src={logo}
                        alt={title}
                        className="h-1/2 w-full object-contain mb-4"
                    /> : <img
                        src={getPlaceholderImage()}
                        alt={title}
                        className="h-1/2 w-1/4 rounded-full object-contain mb-4"
                    />}
                    <p className="text-2xl font-bold text-[#353535] text-center">{offer}</p>
                </div>

                {/* Coupon Code */}
                <div className="bg-[#FCEEE5] rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center">
                        <span className="font-mono text-lg font-bold text-[#353535]">{code}</span>
                        <button
                            onClick={onCopy}
                            className={`flex items-center gap-2 px-3 py-1 rounded-md ${copied ? "bg-green-500 text-white" : "bg-[#353535] text-[#FCEEE5]"
                                }`}
                        >
                            {copied ? (
                                <>
                                    <FaCheck /> Copied!
                                </>
                            ) : (
                                <>
                                    <FaCopy /> Copy
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Terms */}
                <div className="mb-6">
                    <h4 className="text-lg font-bold text-[#353535] mb-2">Terms & Conditions</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        {terms?.split('\n').map((paragraph, i) => (
                            <p key={i} className="text-[#353535] mb-2 last:mb-0">
                                {paragraph.trim()}
                            </p>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CouponDetail