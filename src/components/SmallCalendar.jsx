import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useBrandColor } from "../contexts/BrandColorContext";
import { useTheme } from "../contexts/ThemeContext";

const SmallCalendar = ({ selectedDate, onDateSelect, classesData }) => {
  const [currentMonth, setCurrentMonth] = useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth())
  );
  const { brandColor } = useBrandColor();
  const { lightMode } = useTheme();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    for (
      let day = new Date(startDate);
      day <= endDate;
      day.setDate(day.getDate() + 1)
    ) {
      days.push(new Date(day));
    }

    return days;
  };

  const hasClasses = (date) =>
    classesData.some(
      (cls) => new Date(cls.date).toDateString() === date.toDateString()
    );

  const getClassForDate = (date) =>
    classesData.find(
      (cls) => new Date(cls.date).toDateString() === date.toDateString()
    );

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const days = getDaysInMonth(currentMonth);
  const today = new Date();

  return (
    <div className="w-full">
      {/* Month Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className={`p-1 rounded-full transition-colors ${
            lightMode ? "hover:bg-gray-100" : "hover:bg-gray-700"
          }`}
        >
          <ChevronLeft
            className={`h-4 w-4 ${
              lightMode ? "text-gray-600" : "text-gray-300"
            }`}
          />
        </button>
        <h3
          className={`text-sm font-medium ${
            lightMode ? "text-gray-900" : "text-gray-100"
          }`}
        >
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={goToNextMonth}
          className={`p-1 rounded-full transition-colors ${
            lightMode ? "hover:bg-gray-100" : "hover:bg-gray-700"
          }`}
        >
          <ChevronRight
            className={`h-4 w-4 ${
              lightMode ? "text-gray-600" : "text-gray-300"
            }`}
          />
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <div
            key={index}
            className={`text-center text-xs font-medium py-2 ${
              lightMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
          const isSelected = day.toDateString() === selectedDate.toDateString();
          const isToday = day.toDateString() === today.toDateString();
          const hasClassesOnDay = hasClasses(day);

          return (
            <button
              key={index}
              onClick={() => onDateSelect(day)}
              className={`
    relative h-8 w-8 text-xs rounded-full transition-colors border
    ${
      isCurrentMonth
        ? lightMode
          ? "text-gray-900"
          : "text-gray-200"
        : "text-gray-400"
    }
    ${isSelected ? `bg-${brandColor} text-white` : ""}
    ${isToday && !isSelected ? `bg-${brandColor}/40 text-${brandColor}` : ""}
    ${
      !isSelected && !isToday
        ? lightMode
          ? "hover:bg-gray-100"
          : "hover:bg-gray-200 hover:text-gray-500"
        : ""
    }
  `}
            >
              <span className="relative z-10">{day.getDate()}</span>
              {hasClassesOnDay && !isSelected && (
                <div
                  className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 
        bg-${brandColor} rounded-full`}
                ></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SmallCalendar;
