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
  FaBox, // Added for package icon
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import toast from "react-hot-toast";
import { BookingApi } from "../Api/Booking.api";
import Pagination from "../components/Pagination";

const JoinedClasses = ({ myJoinedClasses }) => {
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
  console.log("myJoinedClasses:", myJoinedClasses);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
        <FaCalendarAlt className="mr-2 text-sixth" />
        My Joined Classes
      </h1>

      {myJoinedClasses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">
            You haven't joined any classes yet.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {paginatedClasses.map((classItem) => (
              <div
                key={classItem.classId}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <h2 className="text-xl font-bold text-gray-800 uppercase">
                        {classItem.className}
                      </h2>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                      {classItem?.attended ? "Attended" : "Confirmed"}
                    </span>
                  </div>

                  <div className="space-y-3 mb-5">
                    <div className="flex items-center text-gray-700">
                      <FaClock className="text-second mr-2 flex-shrink-0" />
                      <span>
                        {formatDate(classItem.details.date)} •{" "}
                        {formatTime(classItem.details.startTime)} -{" "}
                        {formatTime(classItem.details.endTime)}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-700">
                      <FaMapMarkerAlt className="text-red-500  mr-2 flex-shrink-0" />
                      <span className="truncate">
                        {classItem?.details?.location?.streetName},{" "}
                        {classItem?.details?.location?.landmark}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-700">
                      <FaUserAlt className="text-second mr-2 flex-shrink-0" />
                      <span className="font-medium">
                        {classItem.details.trainer.name}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-700">
                      <FaBox className="text-second mr-2 flex-shrink-0" />

                      <span className="ml-2 text-sm text-gray-500">
                        {classItem.packageName}
                      </span>
                    </div>
                  </div>

                  {expandedCards[classItem.classId] && (
                    <div className="mb-4">
                      <p className="text-gray-600 mb-4 pl-2 border-l-2 border-indigo-200 italic">
                        {classItem.details.description}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <button
                      onClick={() => toggleExpand(classItem.classId)}
                      className="text-sixth hover:text-fifth flex items-center text-sm"
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
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-gray-800 uppercase">
                  {selectedClass.className}
                </h2>
                <button
                  onClick={() => setSelectedClass(null)}
                  className="text-gray-500 hover:text-gray-700"
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
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Class Details
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {selectedClass.details.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-start">
                        <FaClock className="text-indigo-500 mr-2 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Date & Time</p>
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
                          <p className="font-medium">Trainer</p>
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
                          <p className="font-medium">Location</p>
                          <p>
                            {selectedClass.details?.location?.streetName},{" "}
                            {selectedClass.details?.location?.landmark}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Booking Information</h4>
                    <p className="text-sm">
                      Booking ID: {selectedClass.bookingId}
                    </p>
                    <p className="text-sm">Class ID: {selectedClass.classId}</p>
                  </div>
                </div>

                <div className="h-64 md:h-full">
                  <MapContainer
                    center={selectedClass.details.location.coordinates.reverse()} // [lat, lng]
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

            {/* Fixed footer with buttons */}
            <div className="p-6 border-t border-gray-200">
              {attendanceStatus[selectedClass.classId] === "attended" ? (
                <div className="flex items-center justify-center bg-green-50 text-green-800 p-3 rounded-lg">
                  <FaCheckCircle className="mr-2 text-green-500" />
                  <span>You've marked your attendance for this class</span>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-6 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Can't Attend
                  </button>
                  <button
                    onClick={() =>
                      handleAttend(
                        selectedClass.classId,
                        selectedClass.bookingId
                      )
                    }
                    disabled={isLoading}
                    className={`px-6 py-2 rounded-md font-medium ${
                      isLoading
                        ? "bg-primary cursor-not-allowed"
                        : "bg-primary hover:bg-third"
                    } text-third  hover:text-white transition-colors`}
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
