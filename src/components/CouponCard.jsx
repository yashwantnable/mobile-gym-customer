import moment from "moment/moment";

const CouponCard = ({ title, discount, expiry, logo, onClick, isSelected }) => {
    const getPlaceholderImage = () => {
        const colors = ['21C8B1'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        return `https://dummyimage.com/500x500/${randomColor}/fff&text=${encodeURIComponent(title.substring(0, 15))}`;
    };
    
    return (
        <div
            className={`relative p-4 rounded-xl transition-all duration-300 cursor-pointer ${isSelected
                ? "bg-[#353535] text-white border-2 border-[#FCEEE5] shadow-md"
                : "bg-[#FCEEE5] border border-[#99928D]"
                }`}
            onClick={onClick}
        >
            <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-40 h-24">
                    <img
                        src={logo || getPlaceholderImage()}
                        alt={title}
                        className="w-full h-full object-cover object-center rounded-lg"
                    />
                </div>

                <div className="flex-grow">
                    <h3 className={`text-lg font-bold ${isSelected ? "text-white" : "text-[#353535]"}`}>
                        {title}
                    </h3>
                    <p className={`text-xl font-bold ${isSelected ? "text-[#FCEEE5]" : "text-[#99928D]"}`}>
                        {discount}
                    </p>
                    <p className={`text-sm ${isSelected ? "text-gray-300" : "text-gray-500"}`}>
                        Expires: {moment(expiry).format("DD-MM-YYYY")}
                    </p>
                </div>

                <div className={`w-11 h-11 rounded-full absolute -right-5 bg-white`}></div>
            </div>
        </div>
    );
};

export default CouponCard;