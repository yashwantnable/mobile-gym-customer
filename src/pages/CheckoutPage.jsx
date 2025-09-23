import { useState } from "react";
import trainer from "../Assests/trainer.jpg";
import { useLocation } from "react-router-dom";
import StripePayment from "./Payment/StripePayment";
import Description from "../components/Description";
import { useLoading } from "../loader/LoaderContext";
import { BookingApi } from "../Api/Booking.api";
import { useTheme } from "../contexts/ThemeContext";

function formatTimeTo12Hour(time24) {
  if (!time24) return "";
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${minute} ${ampm}`;
}

export default function CheckoutPage() {
  const { handleLoading } = useLoading();
  const location = useLocation();
  const [isPaymentPage, setisPaymentPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discountDetails, setDiscountDetails] = useState("");
  const classData = location.state?.classData || {};
  const packageData = location.state?.packageData || {};
  const isPackage = Object.keys(packageData).length > 0;
  const data = isPackage ? packageData : classData;
  const [error, setError] = useState("");
  const { lightMode } = useTheme();

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    handleLoading(true);
    setLoading(true);
    setError("");
    try {
      const payload = {
        subscriptionId: data._id,
        promoCode: promoCode.trim(),
      };
      const response = await BookingApi.applyPromoCodeToSubscription(payload);
      setDiscountDetails(response.data?.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to apply promo code");
      setDiscountDetails(null);
    } finally {
      handleLoading(false);
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen ${
        lightMode ? "bg-white text-gray-900" : "bg-gray-900 text-gray-100"
      } flex flex-col items-center py-8`}
    >
      <div className="w-full max-w-6xl flex mt-5 flex-col md:flex-row justify-center gap-8">
        {/* Left: section */}
        <div className="w-full md:w-1/2">
          <img
            src={data?.media || data?.image || trainer}
            alt={data?.name || (isPackage ? "Package Image" : "Session Image")}
            className="w-full h-72 object-cover object-center rounded mb-4"
          />

          <div
            className={`text-lg tracking-widest mb-1 ${
              lightMode ? "text-gray-600" : "text-gray-300"
            }`}
          >
            {isPackage
              ? "PACKAGE"
              : data?.sessionType?.sessionName?.toUpperCase() ||
                classData.sessionType.toUpperCase()}
          </div>

          <div
            className={`text-xl font-medium mb-1 capitalize ${
              lightMode ? "text-gray-900" : "text-white"
            }`}
          >
            {data?.name || (isPackage ? "Package Title" : "Session Title")}
          </div>

          <div
            className={`text-xs font-medium mb-1 capitalize ${
              lightMode ? "text-gray-600" : "text-gray-300"
            }`}
          >
            <Description description={data?.description} />
          </div>

          <div
            className={`text-md mb-2 ${
              lightMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {isPackage ? (
              <>
                <div className="font-semibold">Package Details:</div>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  {data?.features?.map((feature, index) => (
                    <li key={index} className="text-sm">
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-3">
                  <span className="font-semibold">Duration:</span>{" "}
                  {data?.duration || "N/A"}
                </div>
                <div>
                  <span className="font-semibold">Number of Classes:</span>{" "}
                  {data?.numberOfClasses || "N/A"}
                </div>
              </>
            ) : (
              <>
                {data?.date?.length > 0 && (
                  <>
                    <div>
                      {new Date(data.date[0]).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      {data?.date?.[1] && (
                        <>
                          {" "}
                          -{" "}
                          {new Date(data.date[1]).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </>
                      )}
                    </div>
                    <div>
                      {data.startTime && formatTimeTo12Hour(data.startTime)}
                      {data.startTime &&
                        data.endTime &&
                        ` - ${formatTimeTo12Hour(data.endTime)}`}
                      {classData?.duration && `  ${classData.duration}`}
                    </div>
                  </>
                )}

                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={
                      data?.trainer?.profile_image ||
                      classData.trainer?.profile_image ||
                      "https://randomuser.me/api/portraits/men/32.jpg"
                    }
                    alt="Instructor"
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div
                      className={`text-[10px] uppercase ${
                        lightMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Instructor
                    </div>
                    <div
                      className={`text-xs ${
                        lightMode ? "text-gray-800" : "text-white"
                      }`}
                    >
                      {data?.trainer?.first_name || classData?.trainer}{" "}
                      {data?.trainer?.last_name}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <hr className="mt-5 mb-5" />
        </div>

        {/* Right: section */}
        <div
          className={`w-full md:w-1/2 rounded p-6 shadow-sm flex flex-col gap-6 ${
            lightMode ? "bg-white text-gray-900" : "bg-gray-800 text-gray-100"
          }`}
        >
          <h3 className="ml-5 text-xl font-bold">Order Summary</h3>
          <div
            className={`rounded-lg shadow-sm p-4 border ${
              lightMode
                ? "bg-[#fafbfc] border-gray-100"
                : "bg-gray-700 border-gray-600"
            }`}
          >
            <div className="flex justify-between text-sm mb-2">
              <span>Subtotal</span>
              <span>AED {data?.price}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>VAT</span>
              <span className="font-medium">0</span>
            </div>
            <div className="border-t border-gray-400 my-2"></div>
            <div
              className={`flex justify-between font-medium ${
                discountDetails ? "text-sm" : "text-lg"
              }`}
            >
              <span>Total:</span>
              <span>AED {data?.price}</span>
            </div>
            {discountDetails && (
              <div className="flex justify-between font-medium text-sm">
                <span>Discount:</span>{" "}
                <span>AED {discountDetails?.breakdown?.discountAmount}</span>
              </div>
            )}
            {discountDetails && (
              <div className="text-green-500 flex justify-between font-medium text-lg border-t">
                <span>Final Total:</span>{" "}
                <span>AED {discountDetails?.breakdown?.finalPrice}</span>
              </div>
            )}
            <hr className="mt-3" />
          </div>

          <div
            className={`rounded-lg shadow-sm p-4 mb-4 border ${
              lightMode
                ? "bg-[#fafbfc] border-gray-100"
                : "bg-gray-700 border-gray-600"
            }`}
          >
            <div
              className={`flex items-center mb-2 text-sm ${
                lightMode ? "text-gray-700" : "text-gray-300"
              }`}
            >
              <span className="material-icons text-base mr-2 text-blue-500">
                local_offer
              </span>
              Have a promo code?
            </div>
            <div className="space-y-3">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  className={`border px-4 py-2 rounded w-full pr-10 ${
                    lightMode
                      ? "border-gray-300 text-gray-900 bg-white"
                      : "border-gray-600 text-gray-100 bg-gray-800"
                  }`}
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={!!discountDetails}
                />
                {discountDetails && (
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 focus:outline-none"
                    onClick={() => {
                      setPromoCode("");
                      setDiscountDetails("");
                      setError("");
                    }}
                    aria-label="Remove promo code"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>

              <button
                className={`${
                  discountDetails ? "bg-green-600" : "bg-custom-dark"
                }  text-white px-5 py-2 rounded font-medium text-sm`}
                onClick={handleApplyPromo}
                disabled={loading || !!discountDetails}
              >
                {discountDetails ? "Applied" : "Apply"}
              </button>

              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <button
              className="w-full bg-custom-dark text-white py-3 rounded font-semibold text-lg mt-4"
              onClick={() => setisPaymentPage(true)}
            >
              Pay Now
            </button>
          </div>

          {isPaymentPage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
              <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 relative">
                <StripePayment
                  setisPaymentPage={setisPaymentPage}
                  discountAmount={discountDetails?.breakdown?.finalPrice}
                  classData={classData}
                  packageData={packageData}
                  isPackage={isPackage}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Location Section - Only show for classData */}
      {!isPackage && (
        <div className="mt-10 md:mt-12 w-full max-w-6xl mx-auto">
          <h3
            className={`text-xl sm:text-3xl font-semibold mb-3 sm:mb-4 ${
              lightMode ? "text-gray-900" : "text-white"
            }`}
          >
            Location
          </h3>
          <div className="flex flex-col gap-1 sm:gap-2 mb-3 sm:mb-4 mt-6 sm:mt-10">
            <div
              className={`flex items-center gap-1 sm:gap-2 text-sm sm:text-base ${
                lightMode ? "text-gray-700" : "text-gray-300"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5 inline-block"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.52l.3 1.2a2 2 0 01-.45 1.95l-1.1 1.1a16.06 16.06 0 006.36 6.36l1.1-1.1a2 2 0 011.95-.45l1.2.3A2 2 0 0121 16.72V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V5z"
                />
              </svg>
              {data?.trainer?.phone_number || "(503) 729-0349"}
            </div>
            <div
              className={`text-sm sm:text-base ${
                lightMode ? "text-gray-800" : "text-gray-100"
              }`}
            >
              {data?.streetName ||
                "10121 Southwest Nimbus Avenue Suite C2, Tigard, OR 97223"}
            </div>
            <div
              className={`text-sm sm:text-base ${
                lightMode ? "text-gray-600" : "text-gray-400"
              }`}
            >
              {data?.city?.name || "Metzger"}
            </div>
          </div>
          <div className="w-full h-40 xs:h-52 sm:h-64 md:h-72 rounded-lg overflow-hidden border mt-6 sm:mt-10">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps?q=10121+Southwest+Nimbus+Avenue+Suite+C2,+Tigard,+OR+97223&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
