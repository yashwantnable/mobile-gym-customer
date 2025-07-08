import React from "react";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker = ({ selected, onChange }) => {
  const formatted = selected
    ? format(selected, "EEEE, dd MMM ''yy")
    : "Select date";

  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      customInput={
        <button
          type="button"
          className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-sm min-w-[270px] text-left focus:outline-none"
        >
          <span className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
            {/* Calendar SVG */}
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-green-700">
              <rect x="3" y="5" width="18" height="16" rx="2" fill="#fff" stroke="#059669" strokeWidth="1.5"/>
              <path d="M16 3v4M8 3v4" stroke="#059669" strokeWidth="1.5" strokeLinecap="round"/>
              <rect x="7" y="11" width="2" height="2" rx="1" fill="#059669"/>
            </svg>
          </span>
          <span>
            <span className="block text-xs text-gray-500 font-semibold">DATE</span>
            <span className="block text-base font-medium text-gray-900">{formatted}</span>
          </span>
          <span className="ml-auto">
            {/* Dropdown arrow */}
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-500">
              <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </button>
      }
      popperPlacement="bottom-start"
      calendarClassName="shadow-lg border border-gray-200 rounded-xl"
      dayClassName={() => "!rounded-full"}
      wrapperClassName="inline-block"
      dateFormat="EEEE, dd MMM ''yy"
      showPopperArrow={false}
    />
  );
};

export default CustomDatePicker; 