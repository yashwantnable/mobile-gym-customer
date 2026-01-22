// ForgetPassword.jsx
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import InputField from "../components/InputField";
import gola from "../../public/gola.jpg";
import { AuthApi } from "../Api/Auth.api";

// ─── Schemas ────────────────────────────────────────────────
const emailSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),
});

const resetSchema = Yup.object({
  otp: Yup.string()
    .trim()
    .length(6, "OTP must be 6 digits")
    .required("OTP is required"),
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
  // .matches(...)  ← add complexity rules if needed
});

// ─── Main Component ─────────────────────────────────────────
const ForgetPassword = () => {
  const [step, setStep] = useState("email"); // "email" | "otp-reset"
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [showModal, setShowModal] = useState(false);

  // ─── Step 1: Send OTP ─────────────────────────────────────
  const emailFormik = useFormik({
    initialValues: { email: "" },
    validationSchema: emailSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const email = values.email.trim();
        await AuthApi.generateOTP({ emailOrPhone: email });

        toast.success("OTP sent to your email");
        setEmailOrPhone(email);
        setShowModal(true);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to send OTP");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // ─── Step 2: Verify OTP + Reset Password ──────────────────
  const resetFormik = useFormik({
    initialValues: {
      otp: "",
      newPassword: "",
    },
    validationSchema: resetSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // 1. Verify OTP
        const verifyRes = await AuthApi.verifyOTP({
          emailOrPhone,
          otp: values.otp.trim(),
        });

        if (!verifyRes.data?.success) {
          throw new Error("OTP verification failed");
        }

        toast.success("OTP verified!");

        // 2. Reset password
        await AuthApi.resetPassword({
          emailOrPhone,
          newPassword: values.newPassword,
        });

        toast.success("Password reset successful! Please login.");
        setShowModal(false);
        setStep("email"); // or redirect to login
        emailFormik.resetForm();
        resetFormik.resetForm();
      } catch (err) {
        toast.error(
          err?.response?.data?.message ||
            err.message ||
            "Something went wrong"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleCloseModal = () => {
    setShowModal(false);
    resetFormik.resetForm();
    // Optionally allow resend → don't reset email step
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        {/* Left - Image */}
        <div className="hidden md:block md:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-blue-500/20" />
          <img src={gola} alt="Reset Password" className="w-full h-full object-cover" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <h3 className="text-2xl font-bold mb-2">Welcome Back!</h3>
            <p className="text-blue-100">
              Trouble accessing your account? Reset your password to continue.
            </p>
          </div>
        </div>

        {/* Right - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
            <p className="text-gray-500 text-sm mt-1">
              Enter your email to receive an OTP
            </p>
          </div>

          <form onSubmit={emailFormik.handleSubmit} className="space-y-5">
            <InputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="example@email.com"
              value={emailFormik.values.email}
              onChange={emailFormik.handleChange}
              onBlur={emailFormik.handleBlur}
              error={emailFormik.touched.email && emailFormik.errors.email}
              isRequired
            />

            <button
              type="submit"
              disabled={emailFormik.isSubmitting || !emailFormik.isValid}
              className={`w-full py-3 rounded-lg font-semibold transition-all ${
                emailFormik.isSubmitting || !emailFormik.isValid
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed blur-[1px]"
                  : "bg-custom-coral text-white hover:scale-[1.01]"
              }`}
            >
              {emailFormik.isSubmitting ? "Sending OTP..." : "Get OTP"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-blue-500 hover:text-blue-600">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* ─── OTP + Password Reset Modal ──────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-5 text-gray-500 hover:text-gray-800 text-2xl"
            >
              ×
            </button>

            <h3 className="text-2xl font-bold text-center mb-2">Verify OTP</h3>
            <p className="text-center text-gray-600 mb-8">
              Enter the 6-digit code sent to <br />
              <strong>{emailOrPhone}</strong>
            </p>

            <form onSubmit={resetFormik.handleSubmit} className="space-y-6">
              <InputField
                label="OTP"
                name="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                value={resetFormik.values.otp}
                onChange={resetFormik.handleChange}
                onBlur={resetFormik.handleBlur}
                error={resetFormik.touched.otp && resetFormik.errors.otp}
                isRequired
              />

              <InputField
                label="New Password"
                name="newPassword"
                type="password"
                placeholder="••••••••"
                value={resetFormik.values.newPassword}
                onChange={resetFormik.handleChange}
                onBlur={resetFormik.handleBlur}
                error={resetFormik.touched.newPassword && resetFormik.errors.newPassword}
                isRequired
              />

              <button
                type="submit"
                disabled={resetFormik.isSubmitting || !resetFormik.isValid}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  resetFormik.isSubmitting || !resetFormik.isValid
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {resetFormik.isSubmitting ? "Resetting..." : "Reset Password"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Didn't receive OTP?{" "}
              <button
                type="button"
                onClick={() => {
                  emailFormik.handleSubmit();
                }}
                className="text-blue-600 hover:underline font-medium"
              >
                Resend
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgetPassword;