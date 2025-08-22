import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Edit2, Save, Mail, Phone, User, Camera } from "lucide-react";
import { AuthApi } from "../Api/Auth.api";
import { useLoading } from "../loader/LoaderContext";

const ProfilePage = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  // console.log("user:", user);
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [profileImage, setProfileImage] = useState(user?.profile_image || null);
  const [countryData, setCountryData] = useState([]);
  const [imagePreview, setImagePreview] = useState(user?.profile_image || null);
  const [userdata, setUserdata] = useState({});
  const [logdata, setLogdata] = useState({});
  const fileInputRef = useRef(null);
  const { handleLoading } = useLoading();
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone_number: logdata.phone_number || "",
    address: user?.address || "",
    country: user?.country?._id || user?.country || "",
    birthday: user?.birthday || "",
    gender: user?.gender || "",
    profile_image: user?.profile_image || null,
    emirates_id: user?.emirates_id || "",
  });

  const [isLoading, setIsLoading] = useState(false);

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

  const getProfile = async () => {
    handleLoading(true);
    try {
      const userId = user?._id || user?.id;
      const res = await AuthApi.getuserProfile(userId);
      setLogdata(res?.data?.data);
    } catch (error) {
      console.log("Error", error);
    } finally {
      handleLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    setFormData({
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      phone_number: user?.phone_number || "",
      address: user?.address || "",
      country: user?.country?._id || user?.country || "",
      birthday: user?.birthday || "",
      gender: user?.gender || "",
      profile_image: user?.profile_image || null,
      emirates_id: user?.emirates_id || "",
    });
    setImagePreview(user?.profile_image || null);
    setProfileImage(user?.profile_image || null);
  }, [user]);

  // Mapping function: maps profile data to update payload
  const mapProfileToUpdatePayload = (profile) => ({
    first_name: profile.first_name,
    last_name: profile.last_name,
    email: profile.email,
    phone_number: profile.phone_number,
    address: profile.address,
    country: profile.country?._id || profile.country,
    birthday: profile.birthday,
    gender: profile.gender,
    profile_image: profile.profile_image,
    emirates_id: profile.emirates_id,
  });

  const getupdateuser = async (value) => {
    handleLoading(true);
    try {
      console.log("Calling updateProfile with:", value); // Debug log
      const res = await AuthApi.updateProfile(value);
      console.log("API response:", res); // Debug log
      setUserdata(res?.data?.data);
      getProfile();
      return res?.data; // Return the updated user data
    } catch (error) {
      console.log("Error", error);
      return null;
    } finally {
      handleLoading(false);
    }
  };

  // const getupdateuser = async () => {
  //   handleLoading(true);
  //   try {
  //     const userId = user?._id || user?.id; // Get user id from redux
  //     const res = await AuthApi.updateProfile(userId); // Pass id to API
  //     setLogdata(res?.data?.data);
  //   } catch (error) {
  //     console.log("Error", error);
  //   } finally {
  //     handleLoading(false);
  //   }
  // };

  const countryOptions = countryData.map((item) => ({
    value: item?._id,
    label: item?.name || "",
  }));

  const [states, setStates] = useState({
    US: [
      { code: "CA", name: "California" },
      { code: "NY", name: "New York" },
      { code: "TX", name: "Texas" },
    ],
    IN: [
      { code: "TN", name: "Tamil Nadu" },
      { code: "MH", name: "Maharashtra" },
      { code: "DL", name: "Delhi" },
    ],
    CA: [
      { code: "ON", name: "Ontario" },
      { code: "BC", name: "British Columbia" },
      { code: "QC", name: "Quebec" },
    ],
  });

  const [availableStates, setAvailableStates] = useState([]);

  useEffect(() => {
    console.log(user);
    if (formData.country) {
      setAvailableStates(states[formData.country] || []);
    } else {
      setAvailableStates([]);
    }
  }, [formData.country, states]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBirthdayChange = (e) => {
    const { name, value } = e.target;
    let [year, month, day] = formData.birthday
      ? formData.birthday.split("-")
      : ["", "", ""];
    if (name === "year") year = value;
    if (name === "month") month = value;
    if (name === "day") day = value;
    // Only set if all are present, else keep partial
    let birthday = "";
    if (year && month && day) {
      birthday = `${year}-${month}-${day}`;
    } else {
      birthday = `${year}-${month}-${day}`.replace(/(^-+|-+$)/g, "");
    }
    setFormData((prev) => ({
      ...prev,
      birthday,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      setIsLoading(true);
      try {
        const form = new FormData();
        form.append("profile_image", file); // Use only 'profile_image' as key
        const updated = await AuthApi.updateProfile(form);
        if (updated && updated.data) {
          // Use the correct field name from backend
          const newImage =
            updated.data.profile_image ||
            updated.data.profileImage ||
            reader.result;
          setImagePreview(newImage);
          setProfileImage(newImage);
          setFormData((prev) => ({
            ...prev,
            profile_image: newImage,
          }));
          if (dispatch && updated.data) {
            dispatch({
              type: "auth/updateUser",
              payload: { ...user, ...updated.data, profile_image: newImage },
            });
          }
        }
      } catch (error) {
        console.error("Image upload error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleImageEdit = () => {
    fileInputRef.current.click();
  };

  // Refactored handleSubmit to accept section argument
  const handleSubmit = async (e, section) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      let payload = {};
      if (section === "personal") {
        payload = {
          birthday: formData.birthday,
          gender: formData.gender,
          profile_image: formData.profile_image,
          emirates_id: formData.emirates_id,
        };
        // If profileImage is updated and is a file, handle multipart upload
        if (profileImage && typeof profileImage !== "string") {
          const form = new FormData();
          for (const key in payload) {
            if (key !== "profile_image") {
              form.append(key, payload[key]);
            }
          }
          form.append("profile_image", profileImage); // Only use 'profile_image' as key for file
          const updated = await AuthApi.updateProfile(form);
          if (updated && updated.data) {
            setUserdata(updated.data);
            setImagePreview(updated.data.profileImage || imagePreview);
            setFormData((prev) => ({ ...prev, ...updated.data }));
            if (dispatch && updated.data) {
              dispatch({ type: "auth/updateUser", payload: updated.data });
            }
            setIsEditing(false);
            setActiveSection(null);
          }
          setIsLoading(false);
          return;
        }
      } else if (section === "contact") {
        payload = {
          address: formData.address,
          country: formData.country,
          phone_number: formData.phone_number,
        };
      }
      // Always use formData for update
      const updated = await getupdateuser({ ...payload });
      if (updated && updated.data) {
        setUserdata(updated.data);
        setImagePreview(updated.data.profileImage || imagePreview);
        setFormData((prev) => ({ ...prev, ...updated.data }));
        if (dispatch && updated.data) {
          dispatch({ type: "auth/updateUser", payload: updated.data });
        }
        setIsEditing(false);
        setActiveSection(null);
      }
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refactored handleCancel to accept section argument
  const handleCancel = (section) => {
    if (section === "personal") {
      setFormData((prev) => ({
        ...prev,
        birthday: user?.birthday || "",
        gender: user?.gender || "",
      }));
      setImagePreview(user?.profile_image || null);
      setProfileImage(user?.profile_image || null);
    } else if (section === "contact") {
      setFormData((prev) => ({
        ...prev,
        address: user?.address || "",
        country: user?.country || "",
        phone_number: user?.phone_number || "",
      }));
    }
    setIsEditing(false);
    setActiveSection(null);
  };

  const openEditSection = (section) => {
    setIsEditing(true);
    setActiveSection(section);
  };

  const formatEmiratesId = (id) => {
    if (!id) return "Not specified";
    const digits = id.replace(/\D/g, ""); // remove non-digits

    // Expected format: 784-1234-1234567-1
    if (digits.length !== 15) return id; // fallback if not 15 digits

    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(
      7,
      14
    )}-${digits.slice(14)}`;
  };

  const formatDate = (birthday) => {
    if (!birthday) return "Not specified";
    // Handle both ISO and YYYY-MM-DD
    const datePart = birthday.split("T")[0]; // "1968-02-11"
    const [year, month, day] = datePart.split("-");
    if (!year || !month || !day) return "Not specified";
    return `${year} - ${month} - ${day}`;
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center p-8 max-w-md mx-auto">
          <div className="bg-gray-100 p-4 rounded-full inline-block mb-4">
            <User className="h-8 w-8 text-gray-500 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Profile Locked
          </h2>
          <p className="text-gray-600 mb-6">
            Please sign in to view your profile
          </p>
          <button className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-10 flex flex-col items-center bg-primary">
      {/* Profile Image & Name */}
      <div className="flex flex-col items-center mb-8 w-full">
        <div className="relative group mb-4">
          <div className="h-28 w-28 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg overflow-hidden">
            {imagePreview ||
            formData.profile_image ||
            user.profile_image ||
            user.profile_image ? (
              <img
                src={
                  imagePreview ||
                  formData.profile_image ||
                  user.profile_image ||
                  user.profile_image
                }
                alt="Profile Preview"
                className="object-cover h-full w-full rounded-full"
              />
            ) : (
              <User className="h-12 w-12 text-third" />
            )}
            <button
              type="button"
              onClick={handleImageEdit}
              className="absolute bottom-2 right-2  bg-white p-1 rounded-full shadow hover:bg-gray-100 transition-all border border-gray-200"
              title="Edit profile image"
            >
              <Camera className="h-5 w-5 text-gray-700" />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {user.first_name} {user.last_name}
        </h1>
        <p className="text-gray-500 flex items-center gap-1 mb-2">
          <Mail className="h-4 w-4" />
          {user.email}
        </p>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Account Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Account Information
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <p className="text-sm text-gray-500">First Name</p>
              <p className="font-medium">{user.first_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Name</p>
              <p className="font-medium">{user.last_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium break-words text-sm sm:text-base max-w-full">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Personal Information
            </h2>
            {isEditing && activeSection === "personal" ? (
              <div className="flex gap-2">
                <button
                  onClick={() => handleCancel("personal")}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => handleSubmit(e, "personal")}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-third rounded-lg flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            ) : (
              <button
                onClick={() => openEditSection("personal")}
                disabled={isEditing && activeSection !== "personal"}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  isEditing && activeSection !== "personal"
                    ? "bg-gray-100 text-third cursor-not-allowed"
                    : "bg-primary hover:bg-primary-dark text-third"
                }`}
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </button>
            )}
          </div>
          {isEditing && activeSection === "personal" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birthday
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {/* Month */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Month
                    </label>
                    <select
                      name="month"
                      value={
                        formData.birthday
                          ? formData.birthday.split("-")[1] || ""
                          : ""
                      }
                      onChange={handleBirthdayChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    >
                      <option value="">MM</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option
                          key={i + 1}
                          value={(i + 1).toString().padStart(2, "0")}
                        >
                          {(i + 1).toString().padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Day */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Day
                    </label>
                    <select
                      name="day"
                      value={
                        formData.birthday
                          ? (formData.birthday.split("-")[2] || "").substring(
                              0,
                              2
                            )
                          : ""
                      }
                      onChange={handleBirthdayChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    >
                      <option value="">DD</option>
                      {Array.from({ length: 31 }, (_, i) => (
                        <option
                          key={i + 1}
                          value={(i + 1).toString().padStart(2, "0")}
                        >
                          {(i + 1).toString().padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Year */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Year
                    </label>
                    <select
                      name="year"
                      value={
                        formData.birthday
                          ? formData.birthday.split("-")[0] || ""
                          : ""
                      }
                      onChange={handleBirthdayChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    >
                      <option value="">YYYY</option>
                      {Array.from({ length: 100 }, (_, i) => (
                        <option key={2023 - i} value={2023 - i}>
                          {2023 - i}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                >
                  <option value="">Not selected</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emirates ID
                </label>
                <input
                  type="text"
                  name="emirates_id"
                  value={formData.emirates_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Enter Emirates ID"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm text-gray-500">Birthday</p>
                <p className="font-medium">{formatDate(user.birthday)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium">{user.gender || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Emirates ID</p>
                <p className="font-medium">
                  {formatEmiratesId(user.emirates_id)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Contact Information
            </h2>
            {isEditing && activeSection === "contact" ? (
              <div className="flex gap-2">
                <button
                  type="submit"
                  onClick={() => handleCancel("contact")}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={(e) => handleSubmit(e, "contact")}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-third rounded-lg flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            ) : (
              <button
                onClick={() => openEditSection("contact")}
                disabled={isEditing && activeSection !== "contact"}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  isEditing && activeSection !== "contact"
                    ? "bg-gray-100 text-third cursor-not-allowed"
                    : "bg-primary hover:bg-primary-dark text-third"
                }`}
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </button>
            )}
          </div>
          {isEditing && activeSection === "contact" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
              </div>
              <div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 sm:py-3 text-xs sm:text-sm border outline-none rounded-lg "
                  >
                    <option value="">Select country</option>
                    {countryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{user.address || "Not specified"}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Country</p>
                  <p className="font-medium">
                    {logdata?.country?.name ||
                      (typeof user.country === "object" &&
                        user.country?.name) ||
                      (typeof user.country === "string" && user.country) ||
                      "Not specified"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {(() => {
                    // Try all possible locations and types for phone_number number
                    const phone_number =
                      user.phone_number ??
                      user.phone_number ??
                      (user.contact &&
                        (user.contact.phone_number ||
                          user.contact.phone_number));
                    if (phone_number && String(phone_number).trim() !== "") {
                      return phone_number;
                    }
                    return "Not specified";
                  })()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
