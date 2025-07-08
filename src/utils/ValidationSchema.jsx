import * as Yup from "yup";

// export const userSchemaValidation = Yup.object({
//   first_name: Yup.string()
//     .matches(/^[A-Za-z\s]+$/, "Only alphabets are allowed")
//     .min(2, "First name must be at least 2 characters")
//     .max(30, "First name can't exceed 30 characters")
//     .required("First name is required"),

//   last_name: Yup.string()
//     .matches(/^[A-Za-z\s]+$/, "Only alphabets are allowed")
//     .min(2, "Last name must be at least 2 characters")
//     .max(30, "Last name can't exceed 30 characters")
//     .required("Last name is required"),
//   // fullname: Yup.string().required("Fullname is required"),
//   // phoneNumber: Yup.string().required("Phone number is required"),
//   email: Yup.string().required("Email is required"),
//   password: Yup.string()
//     .min(6, "Password must be at least 6 characters")
//     .required("Password is required"),
//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref("password"), null], "Passwords must match")
//     .required("Confirm password is required"),
//   country: Yup.string().required("Country is required"),
//   otp: Yup.number().required("OTP is required"),
// });

// src/utils/ValidationSchema.jsx

export const userSchemaValidation = Yup.object({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
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
  city: Yup.string().required("City is required"),
  fitnessGoals: Yup.array()
    .min(1, "Select at least one fitness goal")
    .required("Fitness goals are required"),
  agreedToTerms: Yup.boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("You must accept the terms and conditions"),
});

export const bookingValidationSchema = Yup.object().shape({
  date: Yup.string().required("Date is required"),
  slotTime: Yup.string().required("Slot time is required"),
  // petType: Yup.array()
  //   .of(Yup.string().required("Pet type is required"))
  //   .min(1, "At least one pet type is required"),
  petSize: Yup.string().required("Pet size is required"),
});

// Review validation schemas
export const subscriptionReviewSchema = Yup.object().shape({
  rating: Yup.number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5")
    .required("Rating is required"),
  review: Yup.string()
    .min(10, "Review must be at least 10 characters")
    .max(500, "Review cannot exceed 500 characters")
    .required("Review is required"),
});

export const trainerReviewSchema = Yup.object().shape({
  rating: Yup.number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5")
    .required("Rating is required"),
  review: Yup.string()
    .min(10, "Review must be at least 10 characters")
    .max(500, "Review cannot exceed 500 characters")
    .required("Review is required"),
});
