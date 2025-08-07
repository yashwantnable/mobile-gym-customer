import { useNavigate } from "react-router-dom";

const SubscriptionCard = ({ _id, media, name, price, date, isSingleClass }) => {
  const navigate = useNavigate();

  // Calculate date range
  let dateRange = "";
  if (Array.isArray(date) && date.length > 0) {
    const start = new Date(date[0]).toISOString().slice(0, 10);
    const end = new Date(date[date.length - 1]).toISOString().slice(0, 10);
    dateRange = `${start} - ${end}`;
  }

  // Number of classes
  const classesText = isSingleClass
    ? "1 Classes"
    : `${date?.length || 0} Classes`;

  const handleNavigate = () => {
    navigate(`/sessions/${_id}`);
  };

  return (
    <div
      className="bg-white rounded-2xl p-4  shadow-md cursor-pointer"
      onClick={handleNavigate}
    >
      <img
        src={media}
        alt={name}
        className="w-full h-48 object-cover rounded-xl mb-4"
      />
      <div className="flex justify-between items-center mb-2">
        <span className="text-[#6b6b6b] text-sm tracking-wide">
          {dateRange}
        </span>
        <span className="bg-[#f3e6d6] text-[#7a5c3e] text-xs px-3 py-1 rounded-full font-semibold flex flex-col items-center justify-center leading-tight text-center min-w-[60px] min-h-[40px]">
          {classesText}
        </span>
      </div>
      <div className="font-semibold text-xl text-[#1a1a1a]">{name}</div>
      <div className="text-right">
        <span className="text-[#7a5c3e] text-sm font-bold">AED {price}</span>
      </div>
    </div>
  );
};

export default SubscriptionCard;
