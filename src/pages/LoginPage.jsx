import { useFormik } from "formik";
import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import gola from "../../public/gola.jpg";
import InputField from "../components/InputField.jsx";
import { loginUser } from "../store/authThunks.js";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useLoading } from "../loader/LoaderContext.jsx";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode} from "jwt-decode";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {handleLoading} = useLoading()

  const loginSchema = Yup.object({
    emailOrPhone: Yup.string()
      .test("email-or-phone", "Enter a valid email or phone number", (value) => {
        if (!value) return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10,15}$/;
        return emailRegex.test(value) || phoneRegex.test(value);
      })
      .required("Email or phone is required"),
    password: Yup.string()
      .required("Password is required"),
  });

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          localStorage.setItem("latitude",latitude)
          localStorage.setItem("longitude", longitude)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch location data");
          }

        } catch (error) {
          console.error("Geolocation error:", error);
        } 
      },
      (error) => {
        console.error("Geolocation permission error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  const formik = useFormik({
    initialValues: {
      emailOrPhone: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      handleLoading(true)
      try {
        const res = await dispatch(loginUser(values)).unwrap();
        handleUseCurrentLocation()
        if (values.rememberMe) {
          localStorage.setItem("rememberedEmailOrPhone", values.emailOrPhone);
          localStorage.setItem("rememberedPassword", values.password);
        } else {
          localStorage.removeItem("rememberedEmailOrPhone");
        }
        navigate("/");
        localStorage.setItem("token", res?.token);
        localStorage.setItem("userId", res?.user?._id);
        toast.success("Welcome again to OutBox!");
      } catch (error) {
        toast.error(error || "Something went wrong!");
      }finally{
        handleLoading(false)
      }
    },
  });

  useEffect(() => {
    const rememberedEmailOrPhone = localStorage.getItem("rememberedEmailOrPhone");
    const rememberedPassword = localStorage.getItem("rememberedPassword");
    if (rememberedEmailOrPhone) {
      formik.setValues({
        ...formik.values,
        emailOrPhone: rememberedEmailOrPhone,
        password: rememberedPassword,
        rememberMe: true,
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-4 sm:py-8 px-4 sm:px-6 lg:px-8 2xl:px-12">
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="hidden md:flex md:w-1/2 lg:w-2/5 xl:w-1/2 relative">
          <img
            src={gola}
            alt="Fitness motivation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-end p-4 sm:p-6 lg:p-8">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-2 sm:mb-3">
                YOUR EXCUSES JUST GOT <span className="text-red-400">BENCH PRESSED</span>.
              </h2>
              <p className="text-gray-200 text-sm sm:text-base lg:text-lg max-w-md">
                Time to lift more than just your spirits.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 lg:w-3/5 xl:w-1/2 p-4 sm:p-6 lg:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Sign In</h2>
            <p className="text-sm sm:text-base text-gray-600">Sign in to your OutBox account</p>
          </div>

          {formik.status && (
            <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 flex items-center space-x-2 text-sm sm:text-base text-red-700">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>{formik.status}</span>
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                Email or Phone
              </label>
              <div className="relative">
                <InputField
                  type="text"
                  name="emailOrPhone"
                  value={formik.values.emailOrPhone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  leftIcon={<Mail className="h-4 w-4 sm:h-5 sm:w-5" />}
                  className={`block w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${formik.touched.emailOrPhone && formik.errors.emailOrPhone
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                    }`}
                  placeholder="Enter your email or phone"
                />
              </div>
              {formik.touched.emailOrPhone && formik.errors.emailOrPhone && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">
                  {formik.errors.emailOrPhone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`block w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${formik.touched.password && formik.errors.password
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                    }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">
                  {formik.errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <InputField
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  value={formik.values.rememberMe}
                  checked={formik.values.rememberMe}
                  onChange={formik.handleChange}
                  className="h-4 w-4 text-primary-600  focus:ring-primary-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 mb-2 block text-xs sm:text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <Link
                to="/forget-password"
                className="text-xs sm:text-sm text-blue-600 hover:text-primary-500 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-custom-coral hover:bg-primary-700 disabled:bg-primary-400 text-white py-2 sm:py-3 px-4 rounded-lg text-sm sm:text-base font-medium transition-colors outline-none "
            >
              {formik.isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex gap-3 sm:gap-4 mt-3 sm:mt-4 items-center justify-center">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  const decoded = jwtDecode(credentialResponse.credential);
                  console.log("Decoded Google User Info:", decoded);

                  // Optional: Send decoded info to backend to register/login
                  // dispatch(googleLogin(decoded)).then(...)

                  localStorage.setItem("token", credentialResponse.credential);
                  toast.success("Signed in with Google");
                  navigate("/");
                }}
                onError={() => {
                  toast.error("Google Sign In Failed");
                }}
              />
            </div>

          </form>

          <div className="text-center mt-6 sm:mt-8">
            <p className="text-xs sm:text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-600 hover:text-primary-500 font-medium"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;