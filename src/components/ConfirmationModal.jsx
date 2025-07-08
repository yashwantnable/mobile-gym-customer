import { useState, useEffect, useCallback } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiX,
  FiXCircle,
} from "react-icons/fi";
import { CommonButton } from "./Button";
import { IoWarningOutline } from "react-icons/io5";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning", // 'warning', 'danger', 'info', 'success'
  showCloseButton = true,
}) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300); // Wait for animation to finish
  }, [onClose]);

  const handleConfirm = useCallback(() => {
    onConfirm();
    handleClose();
  }, [onConfirm, handleClose]);

  if (!isOpen && !isVisible) return null;

  // Determine icon and colors based on type
  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          icon: <FiXCircle className="w-6 h-6 text-red-600" />,
          button:
            "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-red-500/50",
          iconContainer: "bg-red-100",
          headerBorder: "border-red-200",
        };
      case "info":
        return {
          icon: <FiInfo className="w-6 h-6 text-blue-600" />,
          button:
            "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-blue-500/50",
          iconContainer: "bg-blue-100",
          headerBorder: "border-blue-200",
        };
      case "success":
        return {
          icon: <FiCheckCircle className="w-6 h-6 text-green-600" />,
          button:
            "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-green-500/50",
          iconContainer: "bg-green-100",
          headerBorder: "border-green-200",
        };
      default: // warning
        return {
          icon: <IoWarningOutline className="w-6 h-6 text-yellow-600" />,
          button:
            "bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-white shadow-yellow-500/50",
          iconContainer: "bg-yellow-100",
          headerBorder: "border-yellow-200",
        };
    }
  };

  const { icon, button, iconContainer, headerBorder } = getTypeStyles();

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Darker overlay */}
      <div
        className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
        onClick={handleClose}
      ></div>

      {/* Modal container - perfectly centered */}
      <div
        className={`relative w-full max-w-md transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden mx-4">
          {/* Header with border */}
          <div className={`px-6 py-5 border-b ${headerBorder}`}>
            <div className="flex items-start">
              {/* Icon */}
              <div
                className={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg ${iconContainer}`}
              >
                {icon}
              </div>

              {/* Title and close button */}
              <div className="ml-4 flex-1">
                <h3 className="text-lg text-primary font-semibold ">{title}</h3>
                {showCloseButton && (
                  <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Message content */}
          <div className="px-6 py-5 text-center">
            <p className="text-gray-600">{message}</p>
          </div>

          {/* Modern buttons */}
          <div className="px-6 py-4 bg-gray-50 flex flex-col sm:flex-row-reverse space-y-3 sm:space-y-0 sm:space-x-3 sm:space-x-reverse">
            <CommonButton
              text={confirmText}
              variant="primary"
              onClick={handleConfirm}
              className="w-full py-1.5"
            />
            <CommonButton
              text={cancelText}
              variant="outline"
              onClick={handleClose}
              className="w-full py-1.5"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
