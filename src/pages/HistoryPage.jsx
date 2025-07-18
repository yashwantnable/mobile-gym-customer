import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  User,
  Filter,
  Search,
  Download,
  MessageCircle,
} from "lucide-react";
import { format } from "date-fns";
import { useLoading } from "../loader/LoaderContext";
import { BookingApi } from "../Api/Booking.api";
import { useNavigate } from "react-router-dom";

const HistoryPage = () => {
  const [activeTab, setActiveTab] = useState("sessions");
  const [searchTerm, setSearchTerm] = useState("");
  const [sessionHistory, setsessionHistory] = useState([]);
  const [search, Setsearch] = useState("");
  const [subscriptionHistory] = useState([]);
  const [expired, setExpired] = useState([]);
  const { handleLoading } = useLoading();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");

  const getAllSubscription = async () => {
    handleLoading(true);
    try {
      const res = await BookingApi.getBookingHistory();
      console.log("book ka history hai", res?.data?.data);
      setsessionHistory(res?.data?.data);
    } catch (error) {
      console.log("Error", error);
    } finally {
      handleLoading(false);
    }
  };

  const getAllSearch = async (term) => {
    handleLoading(true);
    try {
      const res = await BookingApi.getSearchHistory(term);
      console.log("SEARCH API RESPONSE", res?.data?.data);
      setsessionHistory(res?.data?.data || []);
    } catch (error) {
      console.log("Error", error);
    } finally {
      handleLoading(false);
    }
  };

  const getAllExpired = async () => {
    handleLoading(true);
    try {
      const res = await BookingApi.getExpiredSubscription();
      console.log("EXPIRED SUBSCRIPTIONS RESPONSE", res?.data?.data);
      setExpired(res?.data?.data || []);
    } catch (error) {
      console.log("Error", error);
    } finally {
      handleLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "confirmed":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  useEffect(() => {
    getAllSubscription();
    getAllExpired();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      getAllSearch(searchTerm);
    } else {
      getAllSubscription();
    }
  }, [searchTerm]);

  // Helper function to format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Subscriptions Bookings
          </h1>
          <p className="text-gray-600">View your sessions, bookings</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("sessions")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "sessions"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Subscription
            </button>
            <button
              onClick={() => setActiveTab("subscriptions")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "subscriptions"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Expired
            </button>
          </nav>
        </div>

        {/* Session History Tab */}
        {activeTab === "sessions" && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search sessions or trainers..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setSearchTerm(inputValue);
                        }
                      }}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300  rounded-lg outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sessions List */}
            <div className="space-y-4">
              {sessionHistory && sessionHistory.length > 0 ? (
                sessionHistory.map((session) => {
                  const subscription = session.subscription || session;
                  const trainer = subscription.trainer || {};
                  const category = subscription.categoryId || {};
                  const sessionType = subscription.sessionType || {};
                  const address = subscription.Address || {};
                  const city = (address.city && address.city.name) || "";
                  const country =
                    (address.country && address.country.name) || "";
                  const street = address.streetName || "";
                  const landmark = address.landmark || "";
                  const fullAddress = [street, landmark, city, country]
                    .filter(Boolean)
                    .join(", ");
                  const price =
                    subscription.price !== undefined &&
                    subscription.price !== null
                      ? subscription.price
                      : "-";
                  const image =
                    subscription.media ||
                    "https://via.placeholder.com/150x150?text=No+Image";
                  const altText = subscription.name || "Session Image";
                  const dateArr = Array.isArray(subscription.date)
                    ? subscription.date
                    : [];
                  const dateStr =
                    dateArr.length > 0
                      ? format(new Date(dateArr[0]), "MMM dd, yyyy")
                      : "N/A";
                  const startTime = subscription.startTime || "N/A";
                  const endTime = subscription.endTime || "N/A";
                  const sessionName = subscription.name || "Untitled Session";
                  const categoryName = category.cName || "";
                  const sessionTypeName = sessionType.sessionName || "";
                  const trainerName =
                    `${trainer.first_name || ""}${
                      trainer.last_name || ""
                    }`.trim() || "Unknown Trainer";
                  return (
                    <div
                      key={session._id || Math.random()}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        navigate(
                          `/history-details/${session._id || session.id}`,
                          { state: { session } }
                        );
                      }}
                    >
                      <div className="md:flex">
                        <div className="md:w-48">
                          <img
                            src={image}
                            alt={altText}
                            className="w-full h-48 md:h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-2  ">
                                {sessionName.toUpperCase()}
                              </h3>
                              <div className="flex flex-wrap gap-2 mb-1">
                                {categoryName && (
                                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium">
                                    {categoryName}
                                  </span>
                                )}
                                {sessionTypeName && (
                                  <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs font-medium">
                                    {sessionTypeName}
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 flex items-center space-x-1">
                                <User className="h-4 w-4" />
                                <span>with {trainerName}</span>
                              </p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className="text-lg font-bold text-primary-600">
                                AED {price}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(session.createdAt)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>
                                {startTime} - {endTime}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 col-span-2">
                              <MapPin className="h-4 w-4" />
                              <span>{fullAddress || "N/A"}</span>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <button
                              className="flex items-center gap-2 px-4 py-2 bg-custom-dark text-white rounded-lg shadow hover:bg-primary-700 transition text-sm font-medium"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/invoice/${session._id || session.id}`
                                );
                              }}
                            >
                              View Invoice
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    No sessions found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Subscription History Tab */}
        {activeTab === "subscriptions" && (
          <div className="space-y-6">
            {/* Expired Sessions List */}
            <div className="space-y-4">
              {expired && expired.length > 0 ? (
                expired.map((session) => {
                  const subscription = session.subscription || session;
                  const trainer = subscription.trainer || {};
                  const category = subscription.categoryId || {};
                  const sessionType = subscription.sessionType || {};
                  const address = subscription.Address || {};
                  const city = (address.city && address.city.name) || "";
                  const country =
                    (address.country && address.country.name) || "";
                  const street = address.streetName || "";
                  const landmark = address.landmark || "";
                  const fullAddress = [street, landmark, city, country]
                    .filter(Boolean)
                    .join(", ");
                  const price =
                    subscription.price !== undefined &&
                    subscription.price !== null
                      ? subscription.price
                      : "-";
                  const image =
                    subscription.media ||
                    "https://via.placeholder.com/150x150?text=No+Image";
                  const altText = subscription.name || "Session Image";
                  const dateArr = Array.isArray(subscription.date)
                    ? subscription.date
                    : [];
                  const dateStr =
                    dateArr.length > 0
                      ? format(new Date(dateArr[0]), "MMM dd, yyyy")
                      : "N/A";
                  const startTime = subscription.startTime || "N/A";
                  const endTime = subscription.endTime || "N/A";
                  const sessionName = subscription.name || "Untitled Session";
                  const categoryName = category.cName || "";
                  const sessionTypeName = sessionType.sessionName || "";
                  const trainerName =
                    `${trainer.first_name || ""}${
                      trainer.last_name || ""
                    }`.trim() || "Unknown Trainer";
                  return (
                    <div
                      key={session._id || Math.random()}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer opacity-75"
                      onClick={() => {
                        navigate(
                          `/history-details/${session._id || session.id}`,
                          { state: { session } }
                        );
                      }}
                    >
                      <div className="md:flex">
                        <div className="md:w-48">
                          <img
                            src={image}
                            alt={altText}
                            className="w-full h-48 md:h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {sessionName.toUpperCase()}
                              </h3>
                              <div className="flex flex-wrap gap-2 mb-1">
                                {categoryName && (
                                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium">
                                    {categoryName}
                                  </span>
                                )}
                                {sessionTypeName && (
                                  <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs font-medium">
                                    {sessionTypeName}
                                  </span>
                                )}
                                <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-medium">
                                  Expired
                                </span>
                              </div>
                              <p className="text-gray-600 flex items-center space-x-1">
                                <User className="h-4 w-4" />
                                <span>with {trainerName}</span>
                              </p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className="text-lg font-bold text-gray-500 line-through">
                                AED {price}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{dateStr}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>
                                {startTime} - {endTime}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 col-span-2">
                              <MapPin className="h-4 w-4" />
                              <span>{fullAddress || "N/A"}</span>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <button
                              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 transition text-sm font-medium"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/invoice/${session._id || session.id}`
                                );
                              }}
                            >
                              View Invoice
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    No expired subscriptions found
                  </h3>
                  <p className="text-gray-500">
                    You don't have any expired subscriptions yet
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HistoryPage;
