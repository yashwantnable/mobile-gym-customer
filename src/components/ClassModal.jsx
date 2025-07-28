import React, { useEffect, useState } from "react";
import {
  X,
  Clock,
  MapPin,
  User,
  Tag,
  Users,
  FileText,
  Calendar,
  CheckCircle,
} from "lucide-react";
// import { ClassesApi } from "../Api/Classes.api";
import toast from "react-hot-toast";
import { useLoading } from "../loader/LoaderContext";
import { useNavigate } from "react-router-dom";
import Classes from "../pages/Classes";
import { ClassesApi } from "../Api/Classes.api";
import { BookingApi } from "../Api/Booking.api";

const ClassModal = ({ classData, onClose, selectedPackage }) => {
  const [joined, setJoined] = useState(classData?.joined || false);
  const [joinedPackage, setJoinedPackage] = useState(selectedPackage || null);
  const [bought, setBought] = useState(false); // <-- add bought state

  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState("");
  // const [bookingClasses, setBookingClasses] = useState([]);
  const [success, setSuccess] = useState("");
  const [remaining, setRemaining] = useState(selectedPackage?.remaining || 0);
  const [buying, setBuying] = useState(false);
  const { handleLoading } = useLoading();
  const navigate = useNavigate();
  console.log("classData:", classData);
  if (!classData || classData.isExpired) return null;

  console.log(classData);

  const packageId = localStorage.getItem("packageId");
  const classId = classData && classData?.id;

  console.log("this is the class data", classData);

  // Function to check if the current class is already purchased/joined
  const isClassAlreadyPurchased = () => {
    if (!sessions || sessions.length === 0 || !classData) return false;

    console.log("Checking if class is already purchased:", {
      classData: classData,
      sessionsCount: sessions.length,
      sessions: sessions,
    });

    const isPurchased = sessions.some((session) => {
      const subscription = session.subscription || session;
      console.log("this is the subscription", session.subscription._id);
      // Compare by class ID if available
      if (classData.id && subscription._id === classData.id) {
        console.log("Match found by ID:", classData.id);
        return true;
      }

      // Compare by class name and date
      if (subscription.name && classData.name) {
        const sessionName = subscription.name.toLowerCase().trim();
        const classDataName = classData.name.toLowerCase().trim();

        if (sessionName === classDataName) {
          // Also check date if available
          if (classData.date && subscription.date) {
            const classDate = new Date(classData.date).toDateString();
            const sessionDate = new Date(subscription.date).toDateString();
            const dateMatch = classDate === sessionDate;
            console.log("Name match found, date comparison:", {
              sessionName,
              classDataName,
              classDate,
              sessionDate,
              dateMatch,
            });
            return dateMatch;
          }

          // If no date comparison possible, just check name
          console.log("Name match found (no date comparison):", {
            sessionName,
            classDataName,
          });
          return true;
        }
      }

      return false;
    });

    console.log("Final result - isClassAlreadyPurchased:", isPurchased);
    return isPurchased;
  };

  useEffect(() => {
    setJoined(classData?.joined || false);
    fetchSessions();
  }, [classData]);

  const handleJoin = async () => {
    if (!selectedPackage) {
      setError("Please select a package to join this class.");
      return;
    }
    const payload = {
      subscriptionId: classId,
      packageId: packageId,
    };

    handleLoading(true);

    try {
      const res = await ClassesApi.joinClass(payload);
      console.log(res.data?.data);
      setSuccess("Successfully joined the class!");
      toast.success("Congrulation you successfully joined the class");
      setJoined(true);
      setJoinedPackage(selectedPackage); // <-- set joinedPackage here
    } catch (err) {
      console.log(err);
    } finally {
      handleLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      handleLoading(true);
      setError(null);
      const response = await BookingApi.getBookingHistory();

      if (response.data && response.data.success) {
        const allSessions = response.data.data || [];
        setSessions(allSessions);
        // setSessions([]);
        console.log("this is all sessions", allSessions);
        setTotalPages(Math.ceil(allSessions.length / itemsPerPage));
        // setTotalPages(1);
      } else {
        setError("Failed to fetch sessions");
      }
    } catch (err) {
      console.error("Error fetching sessions:", err);
      // setError("Failed to load sessions. Please try again later.");
    } finally {
      handleLoading(false);
    }
  };

  // Buy class logic (mock)
  // const handleBuy = () => {
  //   if (classData.isExpired) {
  //     setError("This class has expired and cannot be purchased.");
  //     return;
  //   }
  //   setBought(true);
  //   navigate("/checkout", { state: { classData } });
  // };

  const handleBuy = async () => {
    if (classData.isExpired) {
      setError("This class has expired and cannot be purchased.");
      return;
    }
    setBuying(true); // Show loading state
    setBought(true); // Hide the button
    // Optionally wait a moment to show the change
    setTimeout(() => {
      navigate("/checkout", { state: { classData } });
    }, 500); // 0.5 second delay to see the button disappear
  };

  // Example price (could be dynamic)
  const classPrice = classData.price || 20;

  console.log("this is pakage  name data ", classData);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full  border border-sixth/40">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-sixth flex items-center gap-2">
            <Calendar className="h-6 w-6 text-sixth" /> Class Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Class Name */}
          {classData.isExpired && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 font-medium">
              This class has expired and is no longer available for joining or
              purchase.
            </div>
          )}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {classData.name.toUpperCase()}
            </h3>
            {classData.description && (
              <p className="text-gray-600 text-sm mb-2">
                {classData.description}
              </p>
            )}
          </div>

          {/* Class Details Grid */}
          <div className="grid grid-cols-1 gap-4">
            {/* Date & Time */}
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-sixth" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Date & Time
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(classData.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  at {classData.time}
                </div>
              </div>
            </div>
            {/* Duration */}
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-sixth" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Duration
                </div>
                <div className="text-sm text-gray-600">
                  {classData.duration}
                </div>
              </div>
            </div>
            {/* Location */}
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-sixth" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Location
                </div>
                <div className="text-sm text-gray-600">
                  {classData.location}
                </div>
              </div>
            </div>
            {/* Trainer */}
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-sixth" />
              <div>
                <div className="text-sm font-medium text-gray-900">Trainer</div>
                <div className="text-sm text-gray-600">{classData.trainer}</div>
              </div>
            </div>
            {/* Category */}
            <div className="flex items-center space-x-3">
              <Tag className="h-5 w-5 text-sixth" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Category
                </div>
                <div className="text-sm text-gray-600">
                  {classData.category}
                </div>
              </div>
            </div>
            {/* Session Type */}
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-sixth" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Session Type
                </div>
                <div className="text-sm text-gray-600">
                  {classData.sessionType}
                </div>
              </div>
            </div>
            {/* Additional Info */}
            {classData.additionalInfo && (
              <div className="flex items-start space-x-3">
                <FileText className="h-6 w-6 text-sixth" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Additional Information
                  </div>
                  <div className="text-sm text-gray-600">
                    {classData.additionalInfo}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Package Info */}
          {(joinedPackage || selectedPackage) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sixth">Using Package:</span>
                <span className="font-medium">
                  {(joinedPackage || selectedPackage).name}
                </span>
              </div>
              <div className="text-xs text-gray-700">
                {(joinedPackage || selectedPackage).description}
              </div>
              <div className="text-xs text-sixth font-semibold">
                {(joinedPackage || selectedPackage).type === "class"
                  ? `${remaining} of ${
                      (joinedPackage || selectedPackage).total
                    } classes left`
                  : `${remaining} of ${
                      (joinedPackage || selectedPackage).total
                    } days left`}
              </div>
            </div>
          )}
          {/* Error/Success */}
          {error && (
            <div className="text-red-500 text-sm font-medium">{error}</div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
              <CheckCircle className="h-5 w-5" /> {success}
            </div>
          )}
          {/* Already Purchased Indicator */}
          {isClassAlreadyPurchased() && (
            <div className="flex items-center gap-2 text-blue-600 text-sm font-semibold bg-blue-50 border border-blue-200 rounded-lg p-3">
              <CheckCircle className="h-5 w-5" /> You have already purchased
              this class
            </div>
          )}

          {/* Show package name above price only after join */}
          {classData.packageName && (
            <div className="flex items-center gap-2 text-base font-semibold text-sixth mt-2">
              Package:{" "}
              <span className="text-gray-900">
                {bookingClasses.packageName}
              </span>
            </div>
          )}
          {!classData.isExpired && (
            <div className="flex items-center gap-2 text-lg font-bold text-sixth mt-2">
              Price: <span className="text-gray-900">AED {classPrice}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          {/* Hide Buy/Join buttons if class is already joined, bought, or isBought from backend */}
          {!(
            joined ||
            bought ||
            classData?.isJoined ||
            classData?.isBought ||
            isClassAlreadyPurchased()
          ) &&
            (selectedPackage ? (
              <button
                onClick={handleJoin}
                disabled={classData.isExpired}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors shadow ${
                  !classData.isExpired
                    ? "bg-sixth hover:bg-sixth"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Join
              </button>
            ) : (
              <button
                onClick={handleBuy}
                disabled={buying || classData.isExpired}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors shadow ${
                  !classData.isExpired
                    ? "bg-sixth hover:bg-sixth"
                    : "bg-gray-300 cursor-not-allowed"
                } ${buying ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {buying ? "Buying..." : "Buy Class"}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ClassModal;
