import { Clock, MapPin, CheckCircle } from "lucide-react";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";

const DayView = ({
  classes,
  selectedDate,
  lightMode,
  onClassClick,
  joinedClassIds = [],
  joinedClasses,
}) => {
  // Filter classes for the selected date
  const filteredClasses = classes.filter((cls) => {
    const classDate = new Date(cls.date);
    return classDate.toDateString() === new Date(selectedDate).toDateString();
  });

  // Sort classes by start time
  const sortedClasses = filteredClasses.sort((a, b) => {
    // Assume time is in format 'HH:MM AM/PM' or 'HH:MM'
    const parseTime = (t) => {
      // If time is already in 24h format, just split
      if (/AM|PM/i.test(t)) {
        const [time, ampm] = t.split(" ");
        let [h, m] = time.split(":").map(Number);
        if (ampm.toUpperCase() === "PM" && h !== 12) h += 12;
        if (ampm.toUpperCase() === "AM" && h === 12) h = 0;
        return h * 60 + m;
      } else {
        const [h, m] = t.split(":").map(Number);
        return h * 60 + m;
      }
    };
    return parseTime(a.time) - parseTime(b.time);
  });

  return (
    <div className="w-full mx-auto p-4 md:p-8 overflow-auto h-[90vh] ">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-sixth to-indigo-500 bg-clip-text text-transparent">
        {selectedDate
          ? typeof selectedDate === "string"
            ? selectedDate
            : selectedDate instanceof Date
            ? moment(selectedDate).format("DD-MM-YYYY")
            : String(selectedDate)
          : "Today"}{" "}
        Schedule
      </h2>
      <div className="space-y-6">
        {sortedClasses.length === 0 ? (
          <div className="text-gray-400 text-sm italic text-center">
            No classes scheduled for this day.
          </div>
        ) : (
          sortedClasses.map((cls, idx) => {
            const isJoined = joinedClassIds
              .map(String)
              .includes(String(cls.id));
            const joinedClassObj = joinedClasses?.find(
              (jc) => String(jc.classId) === String(cls.id)
            );
            // Merge details and root for classData, so packageName is available
            const classData = {
              ...(cls.details || {}),
              ...cls, // root-level fields (like packageName, id, etc.)
            };
            return (
              <div
                key={idx}
                className={`rounded-xl shadow-lg   ${lightMode?"from-white via-slate-50 to-slate-100":"bg-gray-800"} border flex flex-col md:flex-row items-center md:items-stretch transition hover:shadow-2xl cursor-pointer
                                    ${
                                      isJoined && !lightMode
                                        ? "border-green-500 bg-green-50"
                                        : "border-slate-200"
                                    }
                                `}
                onClick={() => onClassClick(cls)}
              >
                <div
                  className={`w-full md:w-32 flex-shrink-0 flex items-center justify-center py-4 md:py-0 rounded-t-xl md:rounded-l-xl md:rounded-tr-none
        ${
          lightMode
            ? "bg-gradient-to-b from-sixth/10 to-indigo-100" // Light mode styles
            : "bg-gradient-to-b from-gray-800 to-gray-900"
        }   
         `}
                >
                  <span className="text-lg font-semibold text-sixth">
                    {classData.duration}
                  </span>
                </div>
                <div className="flex-1 w-full px-4 py-3 flex flex-col justify-center">
                  <ClassCard
                    classData={classData}
                    lightMode={lightMode}
                    isJoined={isJoined}
                    joinedClassObj={joinedClassObj}
                  />
                </div>
                {/* {isJoined && (
                  <div className="flex items-center gap-1 px-4 py-2">
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-400">
                      <CheckCircle className="h-4 w-4 mr-1 text-green-500" />{" "}
                      Joined
                    </span>
                  </div>
                )} */}

                {isJoined && (
                  <div className="flex items-center gap-1 px-4 py-2">
                    <button
                      className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-400 hover:bg-green-200 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/classes", { state: { tab: "myClasses" } });
                      }}
                    >
                      My Classes
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const ClassCard = ({ classData, isJoined, joinedClassObj, lightMode }) => {
  return (
    <div
      className={`border rounded-lg p-4 shadow-md transition-colors flex flex-col md:flex-row md:items-center md:justify-between 
            ${
              classData.isExpired
                ? "border-gray-300 opacity-50 cursor-not-allowed"
                : "border-sixth/30 hover:bg-sixth/10 cursor-pointer"
            }`}
    >
      <div className="flex-1">
        <h4 className={`font-semibold ${lightMode?"text-gray-900":"text-gray-200"} text-base mb-1 md:mb-0 capitalize`}>
          {classData.name}
          {classData.isExpired && (
            <span className="ml-2 text-xs text-red-500">(Expired)</span>
          )}
        </h4>
        {/* Show package name from joinedClassObj if available */}
        {joinedClassObj?.packageName && (
          <div className="text-xs text-sixth mb-1">
            Package: {joinedClassObj.packageName}
          </div>
        )}
        <div className="flex items-center text-xs text-gray-600 mb-1">
          <MapPin className="h-3 w-3 mr-1" />
          {classData.location}
        </div>
        <div className="flex items-center text-xs text-gray-600">
          <Clock className="h-3 w-3 mr-1" />
          {classData.duration}
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-2 md:mt-0 md:ml-4 text-right flex items-center justify-end gap-2">
        {classData.trainer}
        {isJoined && (
          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-400 ml-2">
            <CheckCircle className="h-4 w-4 mr-1 text-green-500" /> Joined
          </span>
        )}
      </div>
    </div>
  );
};

export default DayView;
