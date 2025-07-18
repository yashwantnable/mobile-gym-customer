// SessionCards.jsx
import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { BookingApi } from "../Api/Booking.api";
import Pagination from "../components/Pagination";
import { useLoading } from "../loader/LoaderContext";

const MySessionPage = () => {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;
  const { handleLoading } = useLoading();

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

  // Calculate paginated sessions
  const getPaginatedSessions = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sessions.slice(startIndex, endIndex);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Function to get status color
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
    <>
      <div className="rounded-xl p-6 w-full mx-auto max-w-7xl min-h-screen">
        <h2 className="text-2xl font-bold mb-6 text-center">My Sessions</h2>

        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No sessions found</p>
            <p className="text-gray-500">
              You haven't booked any sessions yet.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap justify-center gap-6">
              {paginatedSessions.map((session, index) => {
                const sub = session.subscription || {};
                const dates = Array.isArray(sub.date) ? sub.date : [];
                const numberOfClasses = dates.length;
                const startDate =
                  dates.length > 0
                    ? new Date(dates[0]).toISOString().slice(0, 10)
                    : "";
                const endDate =
                  dates.length > 1
                    ? new Date(dates[dates.length - 1])
                        .toISOString()
                        .slice(0, 10)
                    : startDate;
                const dateRange =
                  startDate && endDate ? `${startDate} - ${endDate}` : "TBD";

                return (
                  <Link
                    key={session._id || index}
                    to={`/history-details/${session._id || session.id}`}
                    // onClick={() => {
                    //   navigate(
                    //     `/history-details/${session._id || session.id}`,
                    //     { state: { session } }
                    //   );
                    // }}
                    className="bg-[#f6ede7] rounded-xl shadow-sm overflow-hidden w-full sm:w-[48%] lg:w-[30%] hover:shadow-md transition-shadow"
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
                      {/* Logo overlay */}
                      <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 px-3 py-1 rounded shadow">
                        <span className="text-xs font-semibold text-gray-700">
                          JEWEL YOGA
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                          {dateRange}
                        </span>
                        <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-semibold">
                          {numberOfClasses} Classes
                        </span>
                      </div>
                      <div className="flex gap-20">
                        <h3 className="font-semibold text-lg text-gray-800 mb-2">
                          {sub.name || "Session"}
                        </h3>

                        <span className="text-sm text-gray-600">
                          {sub.startTime || "--"} - {sub.endTime || "--"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <div className="flex flex-col text-sm text-gray-600">
                          {/* <span>
                            🕒 {sub.startTime || "--"} - {sub.endTime || "--"}
                          </span> */}
                          <span>
                            <IoLocationOutline className="inline" />{" "}
                            {/* {sub.Address?.streetName || ""},{" "} */}
                            {sub.Address?.city?.name || ""},{" "}
                            {sub.Address?.country?.name || ""}
                          </span>
                        </div>
                        <span className="text-lg font-semibold text-gray-800">
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
    </>
  );
};

export default MySessionPage;
