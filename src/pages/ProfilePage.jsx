import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Edit2,  Save, Mail, Phone, User, Camera } from "lucide-react";
import { AuthApi } from "../Api/Auth.api";

const ProfilePage = () => {
  const user = useSelector((state) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [countryData, setCountryData] = useState([]);
  const [imagePreview, setImagePreview] = useState(user?.profileImage || null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    country: user?.country || "",
    birthday: {
      month: user?.birthday?.month || "",
      day: user?.birthday?.day || "",
      year: user?.birthday?.year || "",
    },
    gender: user?.gender || "",
  });

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
    setFormData((prev) => ({
      ...prev,
      birthday: { ...prev.birthday, [name]: value },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageEdit = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: Add API call to update user profile and image
      setIsEditing(false);
      setActiveSection(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      country: user?.country || "",
      birthday: {
        month: user?.birthday?.month || "",
        day: user?.birthday?.day || "",
        year: user?.birthday?.year || "",
      },
      gender: user?.gender || "",
    });
    setImagePreview(user?.profileImage || null);
    setProfileImage(user?.profileImage || null);
    setIsEditing(false);
    setActiveSection(null);
  };

  const openEditSection = (section) => {
    setIsEditing(true);
    setActiveSection(section);
  };

  const formatDate = (birthday) => {
    if (!birthday?.month || !birthday?.day || !birthday?.year) return "Not specified";
    return `${birthday.month}/${birthday.day}/${birthday.year}`;
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
    <div className="mx-auto px-4 py-10 flex flex-col items-center">
      {/* Profile Image & Name */}
      <div className="flex flex-col items-center mb-8 w-full">
        <div className="relative group mb-4">
          <div className="h-28 w-28 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg overflow-hidden">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="object-cover h-full w-full rounded-full"
              />
            ) : (
              <User className="h-12 w-12 text-white" />
            )}
            <button
              type="button"
              onClick={handleImageEdit}
              className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow hover:bg-gray-100 transition-all border border-gray-200"
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
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h1>
        <p className="text-gray-500 flex items-center gap-1 mb-2">
          <Mail className="h-4 w-4" />
          {user.email}
        </p>
      </div>

      <div className="w-full flex gap-10">
        {/* Account Information */}
        <div className="bg-white w-1/2 rounded-xl shadow-sm border border-gray-200 mb-6 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white w-full rounded-xl shadow-sm border border-gray-200 mb-6 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
            {isEditing && activeSection === 'personal' ? (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            ) : (
              <button
                onClick={() => openEditSection('personal')}
                disabled={isEditing && activeSection !== 'personal'}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${isEditing && activeSection !== 'personal'
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-dark text-white'
                  }`}
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </button>
            )}
          </div>
          {isEditing && activeSection === 'personal' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
                <div className="grid grid-cols-3 gap-4">
                  <select
                    name="month"
                    value={formData.birthday.month}
                    onChange={handleBirthdayChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  >
                    <option value="">MM</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                        {(i + 1).toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  <select
                    name="day"
                    value={formData.birthday.day}
                    onChange={handleBirthdayChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  >
                    <option value="">DD</option>
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                        {(i + 1).toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  <select
                    name="year"
                    value={formData.birthday.year}
                    onChange={handleBirthdayChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
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
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm text-gray-500">Birthday</p>
                <p className="font-medium">{formatDate(user.birthday)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium">{user.gender || "Not selected"}</p>
              </div>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="bg-white w-full rounded-xl shadow-sm border border-gray-200 mb-6 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Contact Information</h2>
            {isEditing && activeSection === 'contact' ? (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            ) : (
              <button
                onClick={() => openEditSection('contact')}
                disabled={isEditing && activeSection !== 'contact'}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${isEditing && activeSection !== 'contact'
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-dark text-white'
                  }`}
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </button>
            )}
          </div>
          {isEditing && activeSection === 'contact' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
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
                  {/* <p className="font-medium">
                    {countries.find(c => c.code === user.country)?.name || "Not specified"}
                  </p> */}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {user.phone || "Not specified"}
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