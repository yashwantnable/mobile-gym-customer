import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { BookingApi } from "../Api/Booking.api";
import Pagination from "../components/Pagination";
import { useLoading } from "../loader/LoaderContext";
import mygym from "../Assests/mygym.png";
import { CiClock1 } from "react-icons/ci";
import { useTheme } from "../contexts/ThemeContext";
import { format, isSameDay,parse } from 'date-fns';

const MySessionPage = () => {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("oneDay");
  const itemsPerPage = 6;
  const { handleLoading } = useLoading();
  const navigate = useNavigate();
  const { lightMode } = useTheme();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      handleLoading(true);
      setError(null);
      const response = await BookingApi.getBookingHistory();

      if (response.data && response.data.success) {
        const allSessions = response.data.data || [];
        setSessions(allSessions);
        console.log(allSessions);
        setTotalPages(Math.ceil(allSessions.length / itemsPerPage));
      } else {
        setError("Failed to fetch sessions");
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError("Failed to load sessions. Please try again later.");
    } finally {
      handleLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "activated":
        return "bg-green-100 text-green-700";
      case "expired":
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatTime = (timeString) => {
  if (!timeString) return "--";
  try {
    const parsed = parse(timeString, "HH:mm", new Date());
    return format(parsed, "hh:mm a"); // e.g., 04:00 PM
  } catch {
    return timeString;
  }
};

  const isTodayInRange = (dates) => {
    if (!Array.isArray(dates) || dates.length === 0) return false;
    const today = new Date();
    return dates.some(dateStr => {
      const sessionDate = new Date(dateStr);
      return isSameDay(today, sessionDate);
    });
  };

  const filteredSessions = sessions.filter((session) =>
    activeTab === "oneDay"
      ? session.subscription?.isSingleClass === true
      : session.subscription?.isSingleClass === false
  );

  const getPaginatedSessions = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredSessions.slice(startIndex, endIndex);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setTotalPages(Math.ceil(filteredSessions.length / itemsPerPage));
    setCurrentPage(1);
  }, [activeTab, filteredSessions.length]);

  if (error) {
    return (
      <div className="rounded-xl p-6 w-full mx-auto max-w-7xl h-[100vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchSessions}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const paginatedSessions = getPaginatedSessions();

  return (
    <div className={`rounded-xl p-6 w-full mx-auto max-w-7xl min-h-screen ${lightMode ? "text-third" : "text-primary bg-third"}`}>
      <h2 className="text-2xl font-bold mb-6 text-center">My Sessions</h2>

      <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 mx-2 rounded-lg font-semibold transition-colors duration-200 ${
            activeTab === "oneDay"
              ? lightMode
                ? "bg-primary text-third"
                : "bg-primary text-third border border-primary"
              : lightMode
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-gray-700 text-white border border-gray-500 hover:bg-gray-600"
          }`}
          onClick={() => setActiveTab("oneDay")}
        >
          One Day Classes
        </button>
        <button
          className={`px-4 py-2 mx-2 rounded-lg font-semibold transition-colors duration-200 ${
            activeTab === "session"
              ? lightMode
                ? "bg-primary text-third"
                : "bg-primary text-third border border-primary"
              : lightMode
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-gray-700 text-white border border-gray-500 hover:bg-gray-600"
          }`}
          onClick={() => setActiveTab("session")}
        >
          Session Classes
        </button>
      </div>

      {filteredSessions.length === 0 ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-gray-100 p-5 rounded-full">
              <img src={mygym} alt="gym" className="h-32 w-32" />
            </div>
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No {activeTab === "oneDay" ? "One Day Classes" : "Session Classes"} found
          </h3>
          <p className="text-gray-500 max-w-md mb-6">
            You haven't booked any {activeTab === "oneDay" ? "one day classes" : "session classes"} yet. Start booking to see your sessions here.
          </p>
          <button
            className="px-5 py-2.5 bg-primary hover:bg-custom-dark text-third hover:text-white font-medium rounded-lg transition-colors duration-200"
            onClick={() => navigate("/subscriptions")}
          >
            Book a Session
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap justify-center gap-6">
            {paginatedSessions.map((session, index) => {
              const sub = session.subscription || {};
              const dates = Array.isArray(sub.date) ? sub.date : [];
              const numberOfClasses = dates.length;
              const isSingleClass = sub.isSingleClass === true;
              const startDate =
                dates.length > 0
                  ? format(new Date(dates[0]), 'yyyy-MM-dd')
                  : "";
              const endDate =
                dates.length > 1
                  ? format(new Date(dates[dates.length - 1]), 'yyyy-MM-dd')
                  : startDate;
              const dateDisplay = isSingleClass ? startDate : startDate && endDate ? `${startDate} - ${endDate}` : "TBD";

              return (
                <Link
                  key={session._id || index}
                  to={`/history-details/${session._id || session.id}`}
                  className={`${lightMode ? "bg-[#f6ede7]" : "bg-white/50"} rounded-xl shadow-sm overflow-hidden w-full sm:w-[48%] lg:w-[30%] hover:shadow-md transition-shadow`}
                >
                  <div className="relative">
                    <img
                      src={
                        sub.media ||
                        "https://images.pexels.com/photos/7688863/pexels-photo-7688863.jpeg?auto=compress&cs=tinysrgb&w=1260"
                      }
                      alt={sub.name || "Session"}
                      className="h-48 w-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://images.pexels.com/photos/7688863/pexels-photo-7688863.jpeg?auto=compress&cs=tinysrgb&w=1260";
                      }}
                    />
                    <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 px-3 py-1 rounded shadow">
                      <span className="text-xs font-semibold text-gray-700">
                        JEWEL YOGA
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-sm ${lightMode ? "text-gray-600" : "text-white"}`}>
                        {dateDisplay}
                      </span>
                      {isTodayInRange(dates) && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold ml-2">
                          Today's batch
                        </span>
                      )}
                      <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-semibold">
                        {numberOfClasses} Classes
                      </span>
                    </div>
                    <div className="flex gap-20">
                      <h3 className={`font-semibold text-lg ${lightMode ? "text-gray-800" : "text-white"} mb-2`}>
                        {sub.name || "Session"}
                      </h3>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className={`flex flex-col text-sm ${lightMode ? "text-gray-600" : "text-white"}`}>
                        <span>
                          <CiClock1 className="inline" /> {formatTime(sub.startTime)} - {formatTime(sub.endTime)}


                        </span>
                        <span>
                          <IoLocationOutline className="inline" />{" "}
                          {sub.Address?.city?.name || ""}, {sub.Address?.country?.name || ""}
                        </span>
                      </div>
                      <span className={`text-lg font-semibold ${lightMode ? "text-gray-800" : "text-white"}`}>
                        {sub.price ? `AED ${sub.price}` : "TBD"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default MySessionPage;