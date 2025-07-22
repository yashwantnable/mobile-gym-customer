import React, { useState } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { IoMdClose } from "react-icons/io";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import { loadStripe } from "@stripe/stripe-js";
import { useLoading } from "../../loader/LoaderContext";
import { BookingApi } from "../../Api/Booking.api";
import { PackagesApi } from "../../Api/Package.api";

const stripePromise = loadStripe(
  "pk_test_51RFBw1BDG3HWhnfAXp9NbZZuGFIltrnDER6H3oTwYz61DX9DWWJoP8t5LAq8PHwgNqTJRAyRGrEp369VwU9lSsqM00nt2F3c4Q"
);

const CheckoutForm = ({
  setisPaymentPage,
  bookingData,
  isPackage,
  discountAmount,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resdata, setresData] = useState({});
  const { handleLoading } = useLoading();
  const navigate = useNavigate();

  console.log("booking  data is come", bookingData.id);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setLoading(true);
    setError(null);
    handleLoading(true);

    try {
      // Create payment method with Stripe
      const { error: stripeError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(CardElement),
        });

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        handleLoading(false);
        return;
      }

      try {
        let res;
        if (isPackage) {
          // Handle package booking
          const payload = { packageId: bookingData._id };
          res = await PackagesApi.packageBooking(payload);
          toast.success("Package booking successful!");
        } else {
          // Handle class booking/subscription
          const payload = {
            subscription: bookingData._id || bookingData.id,
            discountedAmount: discountAmount,
          };

          res = await BookingApi.createSubscription(payload);
          toast.success("Payment & Subscription Successful");
        }

        sessionStorage.setItem("orderPlaced", "true");
        setresData(res?.data?.data?._id);
        navigate(
          `/order-confirmation/${res?.data?.data?._id}?type=${
            isPackage ? "package" : "subscription"
          }`
        );
        navigate(
          `/order-confirmation/${res?.data?.data?._id}?type=${
            isPackage ? "package" : "subscription"
          }`
        );
      } catch (apiErr) {
        setError(apiErr.message || "Booking failed");
        // toast.error("Booking failed. Please try again.");
        toast.error("You have already booked this subscription");
        // toast.error("Booking failed. Please try again.");
        toast.error("You have already booked this subscription");
      }
    } catch (err) {
      setError(err.message);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
      handleLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 ">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Card details
        </label>
        <div className="p-3 border border-gray-300 rounded-md shadow-sm focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500">
          <CardElement
            options={{
              hidePostalCode: true,
              style: {
                base: {
                  fontSize: "16px",
                  color: "#374151",
                  "::placeholder": {
                    color: "#9CA3AF",
                  },
                },
                invalid: {
                  color: "#EF4444",
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full cursor-pointer flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          !stripe || loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white "
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </>
        ) : (
          `Pay AED ${bookingData?.price}`
        )}
      </button>
    </form>
  );
};

// const StripePayment = ({
//   setisPaymentPage,
//   classData,
//   packageData,
//   isPackage,
// }) => {
const StripePayment = ({
  setisPaymentPage,
  classData,
  packageData,
  isPackage,
  discountAmount,
}) => {
  const bookingData = isPackage ? packageData : classData;

  return (
    <div className="relative max-w-md mx-auto p-5 rounded-lg">
      {/* Close Button */}
      <button
        className="absolute top-5 right-5 text-gray-600 hover:text-black cursor-pointer"
        onClick={() => setisPaymentPage(false)}
        disabled={false}
      >
        <IoMdClose size={20} />
      </button>

      <h2 className="text-2xl font-bold text-custom-dark mb-2">
        {isPackage ? "Package Payment" : "Class Payment"}
      </h2>
      <div className="flex justify-between pt-4 mb-2 border-t border-t-gray-300">
        <p>Payable Amount:</p>
        <p className="text-green-600">
          AED {discountAmount ? discountAmount : bookingData?.price}
        </p>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Use test card:{" "}
        <span className="font-mono bg-gray-100 px-2 py-1 rounded">
          4242 4242 4242 4242
        </span>
        , any future date, any CVC
      </p>

      <Elements stripe={stripePromise}>
        <CheckoutForm
          setisPaymentPage={setisPaymentPage}
          discountAmount={discountAmount}
          bookingData={bookingData}
          isPackage={isPackage}
        />
      </Elements>
    </div>
  );
};

StripePayment.propTypes = {
  setisPaymentPage: PropTypes.func.isRequired,
  classData: PropTypes.object,
  packageData: PropTypes.object,
  isPackage: PropTypes.bool,
};

export default StripePayment;
