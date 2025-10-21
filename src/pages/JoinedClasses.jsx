import React, { useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaUserAlt,
  FaEnvelope,
  FaRunning,
  FaHeartbeat,
  FaChevronDown,
  FaChevronUp,
  FaTimes,
  FaCheckCircle,
  FaInfoCircle ,
  FaBox, // Added for package icon
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import toast from "react-hot-toast";
import { BookingApi } from "../Api/Booking.api";
import Pagination from "../components/Pagination";
import { Link } from "react-router-dom";
import Tooltip from "../components/Tooltip";

const JoinedClasses = ({ myJoinedClasses,lightMode }) => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const classesPerPage = 6;

  // Calculate pagination
  const totalPages = Math.ceil(myJoinedClasses.length / classesPerPage);
  const paginatedClasses = myJoinedClasses.slice(
    (currentPage - 1) * classesPerPage,
    currentPage * classesPerPage
  );
  // console.log("myJoinedClasses:", myJoinedClasses);
  const handleAttend = async (classId, bookingId) => {
    setIsLoading(true);
    const loadingToast = toast.loading("Marking attendance...");

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

      const { latitude, longitude } = position.coords;

      const payload = {
        bookingId,
        classId,
        coordinates: [longitude, latitude],
      };

      const response = await BookingApi.attendClass(payload);

      // If success is false or status not 200, show server message
      if (
        !response ||
        response.status !== 200 ||
        response.data?.success === false
      ) {
        const errorMessage =
          response?.data?.message ||
          response?.data?.error?.message ||
          "Failed to mark attendance";

        throw new Error(errorMessage);
      }

      setAttendanceStatus((prev) => ({
        ...prev,
        [classId]: "attended",
      }));

      toast.success("✅ Attendance marked successfully!", { id: loadingToast });
    } catch (error) {
      console.error("Attendance error:", error);
      toast.error(` ${error.message || "Something went wrong"}`, {
        id: loadingToast,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format date (e.g., "July 18, 2025")
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time (e.g., "6:30 PM")
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Toggle card expansion
  const toggleExpand = (classId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [classId]: !prev[classId],
    }));
  };

  return (
    <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
 <div className="flex items-center mb-8">
  <h1 className={`text-3xl font-bold flex items-center ${lightMode ? "text-gray-800" : "text-gray-100"}`}>
    <FaCalendarAlt className="mr-2 text-sixth" />
    My Joined Classes
  </h1>
  <div className="relative group inline-block ml-3">
    <FaInfoCircle className={`cursor-pointer text-xl ${lightMode ? "text-gray-800" : "text-gray-100"}`} />
    <Tooltip text="This section only shows classes that you purchased inside a package." />
  </div>
</div>
  {myJoinedClasses.length === 0 ? (
    <div
      className={`text-center py-12 rounded-lg ${
        lightMode ? "bg-gray-50" : "bg-gray-800"
      }`}
    >
      <div className="flex flex-col items-center">
        <p
          className={`text-lg ${
            lightMode ? "text-gray-500" : "text-gray-400"
          }`}
        >
          You haven't joined any classes yet.
        </p>
        <Link
          to={`/subscriptions`}
          className="text-fourth font-semibold flex items-center gap-1"
        >
          Join Now
        </Link>
      </div>
    </div>
  ) : (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {paginatedClasses.map((classItem) => (
          <div
            key={classItem.classId}
            className={`rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border ${
              lightMode
                ? "bg-white border-gray-100"
                : "bg-gray-900 border-gray-700"
            }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <h2
                    className={`text-xl font-bold uppercase ${
                      lightMode ? "text-gray-800" : "text-gray-100"
                    }`}
                  >
                    {classItem.className}
                  </h2>
                </div>
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  {classItem?.attended ? "Attended" : "Confirmed"}
                </span>
              </div>

              <div
                className={`space-y-3 mb-5 ${
                  lightMode ? "text-gray-700" : "text-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <FaClock className="text-second mr-2 flex-shrink-0" />
                  <span>
                    {formatDate(classItem.details.date)} •{" "}
                    {formatTime(classItem.details.startTime)} -{" "}
                    {formatTime(classItem.details.endTime)}
                  </span>
                </div>

                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-red-500 mr-2 flex-shrink-0" />
                  <span className="truncate">
                    {classItem?.details?.location?.streetName},{" "}
                    {classItem?.details?.location?.landmark}
                  </span>
                </div>

                <div className="flex items-center">
                  <FaUserAlt className="text-second mr-2 flex-shrink-0" />
                  <span className="font-medium">
                    {classItem.details.trainer.name}
                  </span>
                </div>

                <div className="flex items-center">
                  <FaBox className="text-second mr-2 flex-shrink-0" />
                  <span
                    className={`ml-2 text-sm ${
                      lightMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {classItem.packageName}
                  </span>
                </div>
              </div>

              {expandedCards[classItem.classId] && (
                <div className="mb-4">
                  <p
                    className={`mb-4 pl-2 border-l-2 italic ${
                      lightMode
                        ? "text-gray-600 border-indigo-200"
                        : "text-gray-400 border-indigo-700"
                    }`}
                  >
                    {classItem.details.description}
                  </p>
                </div>
              )}

              <div
                className={`flex justify-between items-center pt-4 border-t ${
                  lightMode ? "border-gray-100" : "border-gray-700"
                }`}
              >
                <button
                  onClick={() => toggleExpand(classItem.classId)}
                  className={`flex items-center text-sm ${
                    lightMode ? "text-sixth hover:text-fifth" : "text-blue-400 hover:text-blue-300"
                  }`}
                >
                  {expandedCards[classItem.classId] ? (
                    <>
                      <FaChevronUp className="mr-1" /> Show Less
                    </>
                  ) : (
                    <>
                      <FaChevronDown className="mr-1" /> View Details
                    </>
                  )}
                </button>
                <button
                  onClick={() => setSelectedClass(classItem)}
                  className="px-4 py-2 bg-sixth text-white text-sm font-medium rounded-md hover:bg-fifth transition-colors"
                >
                  Full Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  )}

  {/* Modal for full details */}
  {selectedClass && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col ${
          lightMode ? "bg-white" : "bg-gray-900"
        }`}
      >
        {/* Header */}
        <div
          className={`p-6 border-b ${
            lightMode ? "border-gray-200" : "border-gray-700"
          }`}
        >
          <div className="flex justify-between items-start">
            <h2
              className={`text-2xl font-bold uppercase ${
                lightMode ? "text-gray-800" : "text-gray-100"
              }`}
            >
              {selectedClass.className}
            </h2>
            <button
              onClick={() => setSelectedClass(null)}
              className={`${
                lightMode
                  ? "text-gray-500 hover:text-gray-700"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-6">
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    lightMode ? "text-gray-800" : "text-gray-100"
                  }`}
                >
                  Class Details
                </h3>
                <p
                  className={`mb-4 ${
                    lightMode ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {selectedClass.details.description}
                </p>

                <div
                  className={`space-y-3 ${
                    lightMode ? "text-gray-800" : "text-gray-200"
                  }`}
                >
                  <div className="flex items-start">
                    <FaClock className="text-indigo-500 mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <p
                        className={`font-medium ${
                          lightMode ? "text-gray-800" : "text-gray-200"
                        }`}
                      >
                        Date & Time
                      </p>
                      <p>
                        {formatDate(selectedClass.details.date)} •{" "}
                        {formatTime(selectedClass.details.startTime)} -{" "}
                        {formatTime(selectedClass.details.endTime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaUserAlt className="text-purple-500 mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <p
                        className={`font-medium ${
                          lightMode ? "text-gray-800" : "text-gray-200"
                        }`}
                      >
                        Trainer
                      </p>
                      <p>{selectedClass.details.trainer.name}</p>
                      <a
                        href={`mailto:${selectedClass.details.trainer.email}`}
                        className="text-blue-500 hover:underline flex items-center"
                      >
                        <FaEnvelope className="mr-1" />{" "}
                        {selectedClass.details.trainer.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaMapMarkerAlt className="text-red-500 mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <p
                        className={`font-medium ${
                          lightMode ? "text-gray-800" : "text-gray-200"
                        }`}
                      >
                        Location
                      </p>
                      <p>
                        {selectedClass.details?.location?.streetName},{" "}
                        {selectedClass.details?.location?.landmark}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 rounded-lg ${
                  lightMode ? "bg-gray-50" : "bg-gray-800"
                }`}
              >
                <h4
                  className={`font-medium mb-2 ${
                    lightMode ? "text-gray-800" : "text-gray-200"
                  }`}
                >
                  Booking Information
                </h4>
                <p
                  className={`text-sm ${
                    lightMode ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  Booking ID: {selectedClass.bookingId}
                </p>
                <p
                  className={`text-sm ${
                    lightMode ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  Class ID: {selectedClass.classId}
                </p>
              </div>
            </div>

            {/* Map */}
            <div className="h-64 md:h-full">
              <MapContainer
                center={selectedClass.details.location.coordinates.reverse()}
                zoom={15}
                style={{ height: "100%", borderRadius: "0.5rem" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker
                  position={selectedClass.details.location.coordinates.reverse()}
                >
                  <Popup>
                    {selectedClass?.details?.location?.streetName},{" "}
                    {selectedClass?.details?.location?.landmark}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-6 border-t ${
            lightMode ? "border-gray-200" : "border-gray-700"
          }`}
        >
          {attendanceStatus[selectedClass.classId] === "attended" ? (
            <div className="flex items-center justify-center bg-green-50 text-green-800 p-3 rounded-lg">
              <FaCheckCircle className="mr-2 text-green-500" />
              <span>You've marked your attendance for this class</span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className={`px-6 py-2 rounded-md font-medium transition-colors border ${
                  lightMode
                    ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                    : "border-gray-600 text-gray-300 hover:bg-red-700"
                }`}
              >
                Can't Attend
              </button>
              <button
  onClick={() =>
    handleAttend(selectedClass.classId, selectedClass.bookingId)
  }
  disabled={isLoading}
  className={`px-6 py-2 rounded-md font-medium transition-colors ${
    isLoading
      ? lightMode
        ? "bg-primary cursor-not-allowed text-white"
        : "bg-primary cursor-not-allowed text-gray-200"
      : lightMode
      ? "bg-primary hover:bg-third text-white"
      : "bg-third hover:bg-green-600 text-gray-100"
  }`}
>
  {isLoading ? "Processing..." : "Present"}
</button>

            </div>
          )}
        </div>
      </div>
    </div>
  )}
</div>

  );
};

export default JoinedClasses;
