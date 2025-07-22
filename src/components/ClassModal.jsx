import React, { useState } from "react";
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
import { ClassesApi } from "../Api/Classes.api";
import toast from "react-hot-toast";
import { useLoading } from "../loader/LoaderContext";
import { useNavigate } from "react-router-dom";

const ClassModal = ({ classData, onClose, selectedPackage }) => {
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [remaining, setRemaining] = useState(selectedPackage?.remaining || 0);
  const [buying, setBuying] = useState(false);
  const { handleLoading } = useLoading();
  const navigate = useNavigate();

  if (!classData || classData.isExpired) return null;

  console.log(classData);

  const packageId = localStorage.getItem("packageId");
  const classId = classData && classData?.id;

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
    } catch (err) {
      console.log(err);
    } finally {
      handleLoading(false);
    }
  };

  // Buy class logic (mock)
  const handleBuy = () => {
    if (classData.isExpired) {
      setError("This class has expired and cannot be purchased.");
      return;
    }
    navigate("/checkout", { state: { classData } });
  };

  // Example price (could be dynamic)
  const classPrice = classData.price || 20;

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
          {selectedPackage && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sixth">Using Package:</span>
                <span className="font-medium">{selectedPackage.name}</span>
              </div>
              <div className="text-xs text-gray-700">
                {selectedPackage.description}
              </div>
              <div className="text-xs text-sixth font-semibold">
                {selectedPackage.type === "class"
                  ? `${remaining} of ${selectedPackage.total} classes left`
                  : `${remaining} of ${selectedPackage.total} days left`}
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

          {/* Show price if no package is selected */}
          {!selectedPackage && !classData.isExpired && (
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
          {/* Show Join or Buy button depending on package selection */}
          {selectedPackage ? (
            <button
              onClick={handleJoin}
              disabled={classData.isExpired}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors shadow ${
                !classData.isExpired
                  ? "bg-sixth hover:bg-sixth"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {joined ? "Joined" : "Join"}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassModal;
