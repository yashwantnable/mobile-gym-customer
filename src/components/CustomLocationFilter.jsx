import React, { useState, useRef, useEffect } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

const CustomLocationFilter = ({ value, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((loc) => loc._id === value);
  console.log("options:", options);

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
        className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-sm min-w-[270px] text-left focus:outline-none w-full"
        style={{ height: 56 }}
        onClick={() => setOpen((o) => !o)}
      >
        <FaMapMarkerAlt className="text-green-600 text-2xl" />
        <span className="flex-1">
          <span className="block text-xs text-gray-400 font-semibold">
            LOCATION
          </span>
          <span
            className={`block text-base  ${
              selected ? "text-green-600" : "text-green-600"
            }`}
          >
            {selected ? selected.streetName : "Select Location"}
          </span>
        </span>
        <IoIosArrowDown className="ml-auto text-gray-400 text-lg" />
      </button>
      {open && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {options.length === 0 && (
            <div className="px-4 py-2 text-gray-400">No locations</div>
          )}
          {options.map((loc) => (
            <div
              key={loc._id}
              className={`px-4 py-2 cursor-pointer hover:bg-green-50 ${
                value === loc._id
                  ? "text-green-600 font-semibold"
                  : "text-gray-700"
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
