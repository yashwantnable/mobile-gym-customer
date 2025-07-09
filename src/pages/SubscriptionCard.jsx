import { useNavigate } from "react-router-dom";

const SubscriptionCard = ({ _id,image, name, price, numberOfClasses, duration }) => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/sessions/${_id}`)
    }
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden w-80 flex-shrink-0 transition-all duration-200 hover:shadow-2xl border border-gray-100 flex flex-col cursor-pointer" onClick={handleNavigate}>
            <img
                src={image}
                alt={name}
                className="w-full h-44 object-cover object-center"
            />
            <div className="p-4 flex flex-col gap-2 flex-1 justify-between">
                <div className="flex justify-between items-center mb-1">
                    <span className="uppercase text-xs font-bold tracking-widest text-third bg-primary-50 px-2 py-0.5 rounded-full">
                        {duration}
                    </span>
                    <span className="text-xs font-semibold text-third bg-primary px-2 py-0.5 rounded-full">
                        {numberOfClasses} Classes
                    </span>
                </div>
                <h3 className="font-semibold text-lg mb-1 capitalize text-gray-800 line-clamp-1">
                    {name}
                </h3>
                <div className="flex items-center text-xs text-third mb-1 gap-2">
                    <span className="ml-auto font-semibold text-third">AED {price}</span>
                </div>
            </div>
        </div>
    );
}

export default SubscriptionCard;
