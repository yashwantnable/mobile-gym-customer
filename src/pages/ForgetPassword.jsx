import { useFormik } from "formik";
import * as Yup from "yup";
// import Input from "../Components/Inputs/Input";
// import { userSchemaValidation } from "../utils/ValidationSchema";
import { Link, useNavigate } from "react-router-dom";
// import { CommonButton } from "../Components/Button";
// import InputField from "../Components/InputField";
// import sideImage from "../Assets/login_optimized_250.jpg";
// import { AuthApi } from "../Api/Auth.api";
// import { useLoading } from "../contexts/LoadingContext";
import toast from "react-hot-toast";
import InputField from "../components/InputField";
import { CommonButton } from "../components/Button";
import gola from "../../public/gola.jpg";
import { useLoading } from "../context/LoadingContext";
import { userSchemaValidation } from "../utils/ValidationSchema";

const forgetPasswordSchema = userSchemaValidation.pick(["email"]);

const ForgetPassword = () => {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgetPasswordSchema,
    onSubmit: async (values) => {
      showLoading();
      try {
        await AuthApi.generateOTP({ emailOrPhone: values.email });
        toast.success("An OTP have sent to your email");
        navigate("/generate-otp", { state: { emailOrPhone: values.email } });
      } catch (error) {
        console.log(error);
      } finally {
        hideLoading();
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
        {/* Left Side with Image */}
        <div className="hidden md:block md:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-blue-500/20"></div>
          <img src={gola} alt="Login" className="w-full h-full object-cover" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <h3 className="text-2xl font-bold mb-2">Welcome Back!</h3>
            <p className="text-blue-100">
              Trouble accessing your account? Reset you password to access your
              personalized dashboard and continue your journey with us.
            </p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-full flex flex-col justify-center md:w-1/2 p-8 md:p-10 bg-white">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
            <p className="text-gray-500 text-sm mt-1">
              Enter your eamil to reset your password
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <InputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="example@email.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && formik.errors.email}
              isRequired
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              }
            />

            <CommonButton
              text="Get OTP"
              type="submit"
              className="w-full py-3 bg-custom-coral text-white rounded-lg transition transform hover:scale-[1.01] shadow-lg"
            />
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-500 hover:text-blue-600"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
