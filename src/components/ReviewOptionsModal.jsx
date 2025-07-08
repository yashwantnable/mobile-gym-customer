import React from "react";
import { FiX, FiStar, FiUser } from "react-icons/fi";

const ReviewOptionsModal = ({ isOpen, onClose, onSelectOption }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Write a Review
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Choose what you'd like to review
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Options */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Subscription Review Option */}
            <button
              onClick={() => onSelectOption("subscription")}
              className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <FiStar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                    Rate Your Session
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Share your experience with this workout session
                  </p>
                </div>
              </div>
            </button>

            {/* Trainer Review Option */}
            <button
              onClick={() => onSelectOption("trainer")}
              className="w-full p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <FiUser className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                    Rate Your Trainer
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Share your experience with your trainer
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Cancel Button */}
          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewOptionsModal;
