import React from 'react';
import { Clock, MapPin } from 'lucide-react';

const DayView = ({ classes, selectedDate, onClassClick }) => {
    // State to track expanded slots
    const [expandedSlots, setExpandedSlots] = React.useState({});
    // Generate 45-minute slots from 00:00 to 23:45
    const generateTimeSlots = () => {
        const slots = [];
        let hour = 0;
        let minute = 0;
        while (hour < 24) {
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            const displayTime = formatTime(time);
            slots.push({ time, displayTime });
            minute += 45;
            if (minute >= 60) {
                hour += 1;
                minute = minute % 60;
            }
        }
        return slots;
    };

    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const getClassesForTimeSlot = (timeSlot) => {
        return classes.filter(cls => cls.time === timeSlot);
    };

    const timeSlots = generateTimeSlots();

    const handleExpand = (time) => {
        setExpandedSlots(prev => ({ ...prev, [time]: true }));
    };
    const handleCollapse = (time) => {
        setExpandedSlots(prev => ({ ...prev, [time]: false }));
    };

    return (
        <div className="w-full  mx-auto p-4 md:p-8 overflow-auto h-[90vh] ">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-sixth to-indigo-500 bg-clip-text text-transparent">
                {selectedDate
                    ? (typeof selectedDate === 'string'
                        ? selectedDate
                        : selectedDate instanceof Date
                            ? selectedDate.toLocaleDateString()
                            : String(selectedDate))
                    : 'Today'}'s Schedule
            </h2>
            <div className="space-y-6">
                {timeSlots.map(({ time, displayTime }) => {
                    const slotClasses = getClassesForTimeSlot(displayTime);
                    const isExpanded = expandedSlots[time];
                    const showCollapse = isExpanded && slotClasses.length > 2;
                    return (
                        <div
                            key={time}
                            className="rounded-xl shadow-lg bg-gradient-to-r from-white via-slate-50 to-slate-100 border border-slate-200 flex flex-col md:flex-row items-center md:items-stretch transition hover:shadow-2xl"
                        >
                            <div className="w-full md:w-32 flex-shrink-0 flex items-center justify-center py-4 md:py-0 bg-gradient-to-b from-sixth/10 to-indigo-100 rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
                                <span className="text-lg font-semibold text-sixth">{displayTime}</span>
                            </div>
                            <div className="flex-1 w-full px-4 py-3 flex flex-col justify-center">
                                {slotClasses.length === 0 ? (
                                    <div className="text-gray-400 text-sm italic text-center md:text-left">No classes scheduled</div>
                                ) : (
                                    <>
                                        {(isExpanded || slotClasses.length <= 2)
                                            ? slotClasses.map((cls, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => onClassClick(cls)}
                                                    className="mb-2 last:mb-0 cursor-pointer"
                                                >
                                                    <ClassCard classData={cls} />
                                                </div>
                                            ))
                                            : (
                                                <>
                                                    {slotClasses.slice(0, 2).map((cls, idx) => (
                                                        <div
                                                            key={idx}
                                                            onClick={() => onClassClick(cls)}
                                                            className="mb-2 last:mb-0 cursor-pointer"
                                                        >
                                                            <ClassCard classData={cls} />
                                                        </div>
                                                    ))}
                                                    <button
                                                        onClick={() => handleExpand(time)}
                                                        className="text-sm text-sixth font-medium hover:underline focus:outline-none"
                                                    >
                                                        +{slotClasses.length - 2} more
                                                    </button>
                                                </>
                                            )}
                                        {showCollapse && (
                                            <button
                                                onClick={() => handleCollapse(time)}
                                                className="text-xs text-gray-500 mt-2 hover:underline focus:outline-none"
                                            >
                                                Show less
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const ClassCard = ({ classData }) => {
    return (
        <div className="bg-white/80 border border-sixth/30 rounded-lg p-4 shadow-md hover:bg-sixth/10 transition-colors flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-base mb-1 md:mb-0">
                    {classData.name}
                </h4>
                <div className="flex items-center text-xs text-gray-600 mb-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {classData.location}
                </div>
                <div className="flex items-center text-xs text-gray-600">
                    <Clock className="h-3 w-3 mr-1" />
                    {classData.duration}
                </div>
            </div>
            <div className="text-xs text-gray-500 mt-2 md:mt-0 md:ml-4 text-right">
                {classData.trainer}
            </div>
        </div>
    );
};

export default DayView;