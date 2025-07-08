import { ErrorMessage, Field, Form, Formik } from "formik";
import { AlertCircle, Eye, EyeOff, Mail, Phone, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import gym_register from "../../public/gym_register.jpg";
import { AuthApi } from "../Api/Auth.api.js";
import InputField from "../components/InputField.jsx";
import { useLoading } from "../loader/LoaderContext";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countryData, setCountryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {handleLoading} = useLoading()

  const fitnessGoalOptions = [
    "Weight Loss",
    "Muscle Building",
    "Cardio Fitness",
    "Flexibility",
    "Strength Training",
    "Sports Performance",
    "General Health",
    "Stress Relief",
  ];

  const registerSchema = Yup.object({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    phone_number: Yup.string().required("Phone number is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    age: Yup.number()
      .positive("Age must be positive")
      .integer("Age must be an integer")
      .required("Age is required"),
    gender: Yup.string().required("Gender is required"),
    address: Yup.string().required("Address is required"),
    country: Yup.string().required("Country is required"),
    fitnessGoals: Yup.array()
      .min(1, "Select at least one fitness goal")
      .required("Fitness goals are required"),
    agreedToTerms: Yup.boolean()
      .oneOf([true], "You must accept the terms and conditions")
      .required("You must accept the terms and conditions"),
  });

  const handleSubmit = async (values, { setErrors, setStatus }) => {
    handleLoading(true);
    try {
      const registrationData = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone_number: values.phone_number,
        password: values.password,
        user_role: 3,
        age: values.age,
        gender: values.gender,
        address: values.address,
        profile_image: "https://example.com/profile.jpg",
        country: values.country,
        fitness_goals: values.fitnessGoals.join(", "),
      };

      const response = await AuthApi.register(registrationData);

      if (response?.status === 201 || response?.data?.success) {
        toast.success("User Created Successfully")
        navigate("/login", {
          state: {
            registrationSuccess: true,
            message: "Registration successful! Please login.",
          },
        });
      } else {
        setStatus("Registration failed. Please try again.");
        toast.error("Registration failed. Please try again.")
        if (response?.data?.errors) {
          const apiErrors = {};
          Object.entries(response.data.errors).forEach(([field, messages]) => {
            apiErrors[field] = Array.isArray(messages) ? messages.join(" ") : messages;
          });
          setErrors(apiErrors);
        }
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "An error occurred. Please try again.";

      setStatus(errorMessage);

      if (error?.response?.data?.errors) {
        const apiErrors = {};
        Object.entries(error.response.data.errors).forEach(([field, messages]) => {
          apiErrors[field] = Array.isArray(messages) ? messages.join(" ") : messages;
        });
        setErrors(apiErrors);
      }
    } finally {
      handleLoading(false);
    }
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await AuthApi.country();
        setCountryData(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch countries:", err);
      }
    };
    fetchCountries();
  }, []);

  const countryOptions = countryData.map((item) => ({
    value: item?._id,
    label: item?.name || "",
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center py-4 sm:py-8 px-4 sm:px-6 lg:px-8 2xl:px-12">
      <div className="w-full max-w-7xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden">
        <div className="hidden md:flex md:w-1/2 lg:w-2/5 xl:w-1/2 relative">
          <img
            src={gym_register}
            alt="Fitness motivation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 flex items-end p-6 sm:p-8">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4">
                Join Our Fitness Community
              </h2>
              <p className="text-gray-200 text-sm sm:text-base lg:text-lg max-w-md">
                Start your journey to a healthier, stronger you with personalized training and expert guidance.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 lg:w-3/5 xl:w-1/2 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
              Join OutBox
            </h2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
              Create your account and start your journey
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 w-full">
            <Formik
              initialValues={{
                first_name: "",
                last_name: "",
                email: "",
                user_role: 3,
                phone_number: "",
                password: "",
                confirmPassword: "",
                age: "",
                gender: "",
                address: "",
                country: "",
                fitnessGoals: [],
                agreedToTerms: false,
              }}
              validationSchema={registerSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, setFieldValue, values, status }) => (
                <Form className="w-full space-y-4 sm:space-y-6">
                  {(errors.general || status) && (
                    <div className="mb-4 sm:mb-6 bg-red-50  outline-none border outline-none-red-200 rounded-lg p-3 sm:p-4 flex items-center space-x-2 text-sm sm:text-base text-red-700">
                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>{errors.general || status}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="group">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        First Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        </div>
                        <Field
                          type="text"
                          name="first_name"
                          as={InputField}
                          className="block w-full pl-2 sm:pl-2 pr-3 py-2 sm:py-3 text-xs sm:text-sm border outline-none rounded-lg "
                          placeholder="First name"
                        />
                      </div>
                      <ErrorMessage name="first_name">
                        {(msg) => <p className="mt-1 text-xs sm:text-sm text-red-600">{msg}</p>}
                      </ErrorMessage>
                    </div>

                    <div className="group">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Last Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        </div>
                        <Field
                          type="text"
                          name="last_name"
                          as={InputField}
                          className="block w-full pl-2 sm:pl-2 pr-3 py-2 sm:py-3 text-xs sm:text-sm border outline-none rounded-lg "
                          placeholder="Last name"
                        />
                      </div>
                      <ErrorMessage name="last_name">
                        {(msg) => <p className="mt-1 text-xs sm:text-sm text-red-600">{msg}</p>}
                      </ErrorMessage>
                    </div>

                    <div className="group">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        </div>
                        <Field
                          type="tel"
                          name="phone_number"
                          as={InputField}
                          className="block w-full pl-2 sm:pl-2 pr-3 py-2 sm:py-3 text-xs sm:text-sm border outline-none rounded-lg "
                          placeholder="Phone number"
                        />
                      </div>
                      <ErrorMessage name="phone_number">
                        {(msg) => <p className="mt-1 text-xs sm:text-sm text-red-600">{msg}</p>}
                      </ErrorMessage>
                    </div>

                    <div className="group">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        </div>
                        <Field
                          type="email"
                          name="email"
                          as={InputField}
                          className="block w-full pl-2 sm:pl-2 pr-3 py-2 sm:py-3 text-xs sm:text-sm border outline-none rounded-lg "
                          placeholder="Email"
                        />
                      </div>
                      <ErrorMessage name="email">
                        {(msg) => <p className="mt-1 text-xs sm:text-sm text-red-600">{msg}</p>}
                      </ErrorMessage>
                    </div>

                    <div className="group">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Age
                      </label>
                      <Field
                        type="number"
                        name="age"
                        min="1"
                        as={InputField}
                        className="block w-full px-3 py-2 sm:py-3 text-xs sm:text-sm border outline-none rounded-lg "
                        placeholder="Age"
                      />
                      <ErrorMessage name="age">
                        {(msg) => <p className="mt-1 text-xs sm:text-sm text-red-600">{msg}</p>}
                      </ErrorMessage>
                    </div>

                    <div className="group">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Gender
                      </label>
                      <Field
                        as="select"
                        name="gender"
                        className="block w-full px-3 py-2 sm:py-3 text-xs sm:text-sm border outline-none rounded-lg "
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Field>
                      <ErrorMessage name="gender">
                        {(msg) => <p className="mt-1 text-xs sm:text-sm text-red-600">{msg}</p>}
                      </ErrorMessage>
                    </div>

                    <div className="group">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Field
                          type={showPassword ? "text" : "password"}
                          name="password"
                          className="block w-full pl-3 pr-9 sm:pr-10 py-2 sm:py-3 text-xs sm:text-sm border outline-none rounded-lg "
                          placeholder="Password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <ErrorMessage name="password">
                        {(msg) => <p className="mt-1 text-xs sm:text-sm text-red-600">{msg}</p>}
                      </ErrorMessage>
                    </div>

                    <div className="group">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Field
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          className="block w-full pl-3 pr-9 sm:pr-10 py-2 sm:py-3 text-xs sm:text-sm border outline-none rounded-lg "
                          placeholder="Confirm password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <ErrorMessage name="confirmPassword">
                        {(msg) => <p className="mt-1 text-xs sm:text-sm text-red-600">{msg}</p>}
                      </ErrorMessage>
                    </div>

                    <div className="group">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Country
                      </label>
                      <Field
                        as="select"
                        name="country"
                        className="block w-full px-3 py-2 sm:py-3 text-xs sm:text-sm border outline-none rounded-lg "
                      >
                        <option value="">Select country</option>
                        {countryOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="country">
                        {(msg) => <p className="mt-1 text-xs sm:text-sm text-red-600">{msg}</p>}
                      </ErrorMessage>
                    </div>

                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Address
                      </label>
                      <Field
                        as="textarea"
                        name="address"
                        className="w-full px-3 py-2 sm:py-3 text-xs sm:text-sm border outline-none rounded-lg  h-24 sm:h-32"
                        placeholder="Full address"
                      />
                      <ErrorMessage name="address">
                        {(msg) => <p className="mt-1 text-xs sm:text-sm text-red-600">{msg}</p>}
                      </ErrorMessage>
                    </div>

                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Fitness Goals (Select at least one)
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {fitnessGoalOptions.map((goal) => (
                          <label key={goal} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={values.fitnessGoals.includes(goal)}
                              onChange={() => {
                                const currentGoals = values.fitnessGoals;
                                const newGoals = currentGoals.includes(goal)
                                  ? currentGoals.filter((g) => g !== goal)
                                  : [...currentGoals, goal];
                                setFieldValue("fitnessGoals", newGoals);
                              }}
                              className="h-4 w-4"
                            />
                            <span className="text-xs sm:text-sm text-gray-700">{goal}</span>
                          </label>
                        ))}
                      </div>
                      <ErrorMessage name="fitnessGoals">
                        {(msg) => <p className="mt-1 text-xs sm:text-sm text-red-600">{msg}</p>}
                      </ErrorMessage>
                    </div>

                    <div className="md:col-span-2 lg:col-span-3 mt-4 sm:mt-6">
                      <div className="flex items-center">
                        <Field
                          id="terms"
                          name="agreedToTerms"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 border outline-none-gray-300 rounded"
                        />
                        <label htmlFor="terms" className="ml-2 text-xs sm:text-sm text-gray-700">
                          I agree to the{" "}
                          <a href="#" className="text-blue-600">
                            Terms of services
                          </a>{" "}
                          and{" "}
                          <a href="#" className="text-blue-600">
                            privacy Policy
                          </a>
                        </label>
                      </div>
                      <ErrorMessage name="agreedToTerms">
                        {(msg) => <p className="mt-1 text-xs sm:text-sm text-red-600">{msg}</p>}
                      </ErrorMessage>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-4 sm:mt-6 bg-custom-coral text-white py-3 px-6 rounded-lg text-sm sm:text-base font-medium  disabled:opacity-70"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border outline-none-b-2 outline-none-white"></div>
                            <span>Creating account...</span>
                          </div>
                        ) : (
                          "Create Account"
                        )}
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          <div className="text-center mt-4 sm:mt-6">
            <p className="text-xs sm:text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;