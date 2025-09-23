import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaDumbbell, FaHeartbeat, FaRunning } from "react-icons/fa";
import moment from "moment";
import { BookingApi } from "../../Api/Booking.api";
import { useLoading } from "../../loader/LoaderContext";
import favicon2 from "../../Assests/favicon2.png";
import { PackagesApi } from "../../Api/Package.api";

export default function OrderConfirmation() {
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();
  const { handleLoading } = useLoading();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [showConfetti, setShowConfetti] = useState(true);
  const orderPlaced = sessionStorage.getItem("orderPlaced");
  const { id } = useParams();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");
  const [data, setData] = useState(null);

  const getOrderDetails = async () => {
    handleLoading(true);
    try {
      const res =
        type === "package"
          ? await PackagesApi.getPackageById(id)
          : await BookingApi.getSubscriptionDetailsById(id);
      if (type === "package") {
        setOrderDetails(res?.data?.data?.package || null);
      } else {
        setOrderDetails(res?.data?.data || null);
        setData(res?.data?.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      handleLoading(false);
    }
  };

  useEffect(() => {
    getOrderDetails();
  }, [id]);

  useEffect(() => {
    handleLoading(false);
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleLoading]);

  const handleNavigation = (path) => {
    sessionStorage.removeItem("orderPlaced");
    navigate(path);
  };

  useEffect(() => {
    if (orderPlaced !== "true") {
      navigate("/");
    }
  }, [orderPlaced, navigate]);

  const floatVariants = {
    float: {
      y: [0, -15, 0],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Generate fitness icon positions
  const fitnessIcons = useMemo(() => {
    const icons = [FaDumbbell, FaHeartbeat, FaRunning];
    return [...Array(6)].map(() => ({
      Icon: icons[Math.floor(Math.random() * icons.length)],
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      fontSize: `${Math.random() * 20 + 10}px`,
      color: Math.random() > 0.5 ? "#FE5D55" : "#21C8B1",
    }));
  }, []);

  // Format time to AM/PM
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (!orderDetails) return null;

  // console.log("this sdifdsoopfbhds", orderDetails?.subscription.name);
  console.log("this sdifdsoopfbhds", orderDetails);

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden flex items-center justify-center py-8">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          colors={["#21C8B1", "#FE5D55", "#AD8654"]}
          gravity={0.2}
        />
      )}

      {/* Floating fitness icons */}
      {fitnessIcons.map(({ Icon, ...style }, i) => (
        <motion.div
          key={i}
          variants={floatVariants}
          animate="float"
          style={{
            position: "absolute",
            ...style,
          }}
          className="z-0"
        >
          <Icon />
        </motion.div>
      ))}

      <div className="relative z-10 flex flex-col md:flex-row gap-10 w-full max-w-5xl mx-auto">
        {/* Left: Confirmation message and buttons */}
        <div className="flex-1 bg-white rounded-xl shadow-xl p-10 flex flex-col justify-center items-start min-w-[320px] max-w-lg">
          <img src={favicon2} alt="Logo" className="w-14 h-14 mb-6" />
          <h1 className="text-3xl font-extrabold mb-2 text-gray-800">
            Booking confirmed successfully! {}
          </h1>
          <p className="text-gray-500 mb-8">
            Thank you for choosing to subscribe with OutBox. Your reservation is
            confirmed. If there's anything you need before your arrival, please
            don't hesitate to reach out to your host!
          </p>
          <div className="flex gap-4 w-full">
            <button
              className="bg-fourth text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-custom-dark transition flex-1"
              onClick={() => handleNavigation("/my-sessions")}
            >
              View class details
            </button>
            <button
              className="bg-white border border-gray-300 px-6 py-3 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition flex-1"
              onClick={() => handleNavigation("/")}
            >
              Go back to home
            </button>
          </div>
        </div>

        {/* Right: Payment summary and details */}
        <div className="flex-1 flex flex-col gap-6 min-w-[320px] max-w-lg">
          {/* Price and checkmark */}
          <div className="bg-white rounded-xl shadow p-8 flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">
                AED {orderDetails?.price}
              </div>
              <div className="text-gray-500 text-sm mt-1">Payment success!</div>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          {/* Payment details */}
          <div className="bg-white rounded-xl shadow p-8">
            <h2 className="font-bold text-lg mb-4">Payment details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Service:</span>
                <span>
                  {orderDetails?.name ||
                    orderDetails?.subscription?.name ||
                    "Strength Training"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Dates:</span>
                <span className="text-right">
                  {orderDetails?.date && Array.isArray(orderDetails.date)
                    ? orderDetails.date.map((d, idx) => (
                        <span key={d}>
                          {moment(d).format("MMMM Do YYYY")}
                          {idx < orderDetails.date.length - 1 ? ", " : ""}
                        </span>
                      ))
                    : ""}{" "}
                  {moment(orderDetails?.createdAt).format("MMMM Do YYYY")}
                </span>
              </div>
              {orderDetails?.startTime && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Time Slot:</span>
                  <span>
                    {orderDetails?.startTime && orderDetails?.endTime
                      ? `${formatTime(orderDetails?.startTime)} - ${formatTime(
                          orderDetails?.endTime
                        )}`
                      : "-" ||
                        (orderDetails?.subscription?.startTime &&
                          orderDetails?.subscription?.endTime)
                      ? `${formatTime(
                          orderDetails?.subscription?.startTime
                        )} - ${formatTime(orderDetails?.subscription?.endTime)}`
                      : "-"}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Price:</span>
                <span>
                  AED{" "}
                  {orderDetails?.price ||
                    orderDetails?.subscription?.price ||
                    500}
                </span>
              </div>

              {orderDetails.numberOfClasses && (
                <div className="flex justify-between">
                  <span className="text-gray-500">No. of Classes:</span>
                  <span>{orderDetails.numberOfClasses}</span>
                </div>
              )}

              {orderDetails.duration && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration:</span>
                  <span>
                    {{
                      daily: "for a day",
                      weekly: "for a week",
                      monthly: "for a month",
                    }[orderDetails.duration] || orderDetails.duration}
                  </span>
                </div>
              )}

              {orderDetails?.streetName && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Address:</span>
                  <span className="text-right">
                    {orderDetails?.streetName ||
                      orderDetails?.subscription?.Address.landmark +
                        ", " +
                        orderDetails?.subscription?.Address.streetName +
                        ", " +
                        orderDetails?.subscription?.Address.city.name +
                        ", " +
                        orderDetails?.subscription?.Address.country.name ||
                      "Dubai Jewel Park, 5 36a St - Port Saeed - Dubai - United Arab Emirates"}
                  </span>
                </div>
              )}
              {orderDetails?.paymentMethod && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Method:</span>
                  <span>{orderDetails?.paymentMethod}</span>
                </div>
              )}
              {orderDetails?.paymentStatus && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Status:</span>
                  <span>{orderDetails.paymentStatus}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
