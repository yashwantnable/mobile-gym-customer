import { useState, useRef, useEffect } from "react";
import { FaWalking } from "react-icons/fa";

const CustomDistanceFilter = ({ value, onChange, options, lightMode }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block min-w-[270px]" ref={ref}>
      <button
        type="button"
        className={`flex items-center gap-3 border border-gray-300 ${
          lightMode ? "bg-white" : "bg-gray-800"
        } rounded-lg px-4 py-2 shadow-sm min-w-[270px] text-left focus:outline-none`}
        style={{ height: 56 }}
        onClick={() => setOpen((o) => !o)}
      >
        <i className="text-[#008363] text-2xl">
          <FaWalking />
        </i>
        <span>
          <span
            className={`block text-xs ${
              lightMode ? "text-gray-500" : "text-gray-300"
            } font-semibold`}
          >
            DISTANCE
          </span>
          <span className="block text-base font-medium text-green-700">
            {value}
          </span>
        </span>
        <span className="ml-auto">
          <svg
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className={lightMode ? "text-gray-500" : "text-gray-300"}
          >
            <path
              d="M6 9l6 6 6-6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {open && (
        <div
          className={`absolute left-0 mt-2 w-full rounded-xl shadow-lg border z-50 py-3 ${
            lightMode
              ? "bg-white border-gray-200"
              : "bg-gray-800 border-gray-700"
          }`}
        >
          {options.map((opt) => (
            <label
              key={opt}
              className={`flex items-center gap-3 px-4 py-2 cursor-pointer ${
                lightMode
                  ? "hover:bg-gray-50"
                  : "hover:bg-gray-700 hover:text-white"
              }`}
            >
              <input
                type="radio"
                name="distance"
                checked={value === opt}
                onChange={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className="accent-green-700 w-5 h-5"
              />
              <span
                className={`text-base ${
                  value === opt
                    ? "text-green-700 font-semibold"
                    : lightMode
                    ? "text-gray-700"
                    : "text-gray-200"
                }`}
              >
                {opt}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDistanceFilter;
