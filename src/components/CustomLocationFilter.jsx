import React, { useState, useRef, useEffect } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

const CustomLocationFilter = ({ value, onChange, options, lightMode }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((loc) => loc._id === value);

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
    <div ref={ref} className="relative inline-block min-w-[270px]">
      <button
        type="button"
        className={`flex items-center gap-3 border border-gray-300 ${
          lightMode ? "bg-white" : "bg-gray-800"
        } rounded-lg px-4 py-2 shadow-sm min-w-[270px] text-left focus:outline-none`}
        style={{ height: 56 }}
        onClick={() => setOpen((o) => !o)}
      >
        <FaMapMarkerAlt className="text-green-600 text-2xl" />
        <span className="flex-1">
          <span
            className={`block text-xs ${
              lightMode ? "text-gray-500" : "text-gray-300"
            } font-semibold`}
          >
            LOCATION
          </span>
          <span
            className={`block text-base ${
              selected ? "text-green-700" : "text-green-600"
            }`}
          >
            {selected ? selected.streetName : "Select Location"}
          </span>
        </span>
        <IoIosArrowDown
          className={`ml-auto text-lg ${
            lightMode ? "text-gray-400" : "text-gray-300"
          }`}
        />
      </button>

      {open && (
        <div
          className={`absolute left-0 right-0 mt-2 rounded-lg shadow-lg border z-10 ${
            lightMode
              ? "bg-white border-gray-200"
              : "bg-gray-800 border-gray-700"
          }`}
        >
          {options.length === 0 && (
            <div
              className={`px-4 py-2 ${
                lightMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No locations
            </div>
          )}
          {options.map((loc) => (
            <div
              key={loc._id}
              className={`px-4 py-2 cursor-pointer rounded-md ${
                value === loc._id
                  ? "text-green-600 font-semibold"
                  : lightMode
                  ? "text-gray-700 hover:bg-green-50"
                  : "text-gray-200 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => {
                onChange(loc._id);
                setOpen(false);
              }}
            >
              {loc.streetName}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomLocationFilter;
