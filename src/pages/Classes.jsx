import { useState, useEffect, useMemo } from "react";
import { CloudCog, X, ChevronDown } from "lucide-react";
import SmallCalendar from "../components/SmallCalendar";
import FilterPanel from "../components/FilterPanel";
import WeekView from "../components/WeekView";
import ClassModal from "../components/ClassModal";
import PackageSelectModal from "../components/PackageSelectModal";
import { useLoading } from "../loader/LoaderContext";
import { PackagesApi } from "../Api/Package.api";
import { useSelector } from "react-redux";
import { ClassesApi } from "../Api/Classes.api";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { FaCalendarAlt, FaSearch } from "react-icons/fa";
import JoinedClasses from "./JoinedClasses";
import { CategoryApi } from "../Api/Category.api";
import { useBrandColor } from "../contexts/BrandColorContext";
import { useTheme } from "../contexts/ThemeContext";
const transformPackageData = (apiPackage) => {
  return {
    id: apiPackage.package._id,
    name: apiPackage.package.name,
    type: apiPackage.package.duration === "monthly" ? "class" : "day",
    remaining:
      apiPackage.package.numberOfClasses - apiPackage.joinClasses.length,
    total: apiPackage.package.numberOfClasses,
    description: apiPackage.package.name,
    duration:
      apiPackage.package.duration === "monthly"
        ? "Valid for 1 month"
        : apiPackage.package.duration === "weekly"
        ? "Valid for 1 week"
        : apiPackage.package.duration === "yearly"
        ? "Valid for 1 year"
        : "Valid for 1 day",
    features: apiPackage.package.features,
    image: apiPackage.package.image,
    originalData: {
      ...apiPackage,
      package: {
        ...apiPackage.package,
      },
    },
  };
};

const Classes = ({ hide, category }) => {
  const { lightMode } = useTheme();
  const { _id } = useParams();
  const { brandColor, setBrandColor } = useBrandColor();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCatName, setSelectedCatName] = useState("Select Category");
  const [activeTab, setActiveTab] = useState("joinNew");
  const [myJoinedClasses, setMyJoinedClasses] = useState([]);
  const [categories, setCategory] = useState([]);
  const [selected, setSelected] = useState(_id || "");
  const [userPackages, setUserPackages] = useState([]);
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const packageId = localStorage.getItem("packageId");
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [activePackageId, setActivePackageId] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [bookingClasses, setBookingClasses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [filters, setFilters] = useState({
    location: [],
    category: [],
    sessionType: [],
  });

  const getClassesSubByUser = async () => {
    handleLoading(true);
    try {
      const res = await ClassesApi.getClassesSubByUser();
      setMyJoinedClasses(res.data?.data);
    } catch (err) {
      console.log(err);
    } finally {
      handleLoading(false);
    }
  };

  useEffect(() => {
    if (categories.length > 0) {
      if (_id) {
        setSelected(_id); // from URL params
      } else {
        setSelected(categories[0]._id); // default to first category
      }
    }
  }, [categories, _id]);

  const getAllBookingclasess = async () => {
    handleLoading(true);

    try {
      const res = await ClassesApi.getClassesSubByUser();
      setBookingClasses(res?.data?.data);
    } catch (error) {
      console.log("Error", error);
    } finally {
      handleLoading(false);
    }
  };

  useEffect(() => {
    getAllBookingclasess();
  }, []);

  useEffect(() => {
    setActivePackageId(packageId);
  }, [packageId]);

  useEffect(() => {
    if (location.state && location.state.tab) {
      setActiveTab(location.state.tab);
      getClassesSubByUser();
    }
  }, [location.state]);

  const { handleLoading } = useLoading();
  const user = useSelector((state) => state.auth.user);

  const handleGetUserPackages = async () => {
    const userId = user?._id;
    handleLoading(true);
    try {
      const res = await PackagesApi.getUserPackage(userId);
      const transformedPackages = res.data?.data.map((pkg) =>
        transformPackageData(pkg)
      );
      setUserPackages(transformedPackages);
    } catch (err) {
      console.log(err);
    } finally {
      handleLoading(false);
    }
  };

  useEffect(() => {
    getClassesSubByUser();
  }, []);

  const getAllClasses = async (categoryId) => {
    handleLoading(true);
    try {
      const payload = { isSingleClass: true };
      if (categoryId) payload.categoryId = categoryId;

      const res = await ClassesApi.getAllClasses(payload);
      const apiClasses = res?.data?.data?.subscriptions || [];

      const transformedClasses = apiClasses.map((cls) => ({
        id: cls._id,
        name: cls.name,
        description: cls.description,
        date: cls.date[0],
        time: cls.startTime,
        duration: `${cls.startTime} - ${cls.endTime}`,
        location: cls.Address?.streetName || "Unknown location",
        locationId: cls.Address?._id,
        category: cls.categoryId?.cName || "General",
        categoryId: cls.categoryId?._id,
        sessionType: cls.sessionType?.sessionName || "Regular",
        sessionTypeId: cls.sessionType?._id,
        trainer: cls.trainer
          ? `${cls.trainer.first_name} ${cls.trainer.last_name}`
          : "Unknown trainer",
        price: cls.price,
        additionalInfo: cls.description,
        image: cls.media,
        features: cls.features,
        isExpired: cls.isExpired,
      }));

      setClasses(transformedClasses);
      setFilteredClasses(transformedClasses);
    } catch (err) {
      console.error("Error fetching classes:", err);
    } finally {
      handleLoading(false);
    }
  };

  const getCategoryClass = (catName) => {
    const name = catName?.toLowerCase();
    if (name === "wellness") return "border-b-2 border-fourth text-fourth";
    if (name === "liveness") return "border-b-2 border-fifth text-fifth";
    if (name === "fitness") return "border-b-2 border-sixth text-sixth";
    return "";
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  useEffect(() => {
    if (selected) {
      getAllClasses(selected);
    }
  }, [selected]);

  // useEffect(() => {
  //   getAllCategory();
  // }, [selected]);

  // Debug effect to log filter changes
  useEffect(() => {
  }, [filters]);

  useEffect(() => {
    handleGetUserPackages();
  }, [user]);

  useEffect(() => {
    setSelectedPackage(
      userPackages.find((pkg) => pkg?.originalData?._id === activePackageId) ||
        null
    );
  }, [activePackageId, userPackages]);

  // When a package is activated, set as active and selected, close modal, reset class selection
  const handleActivatePackage = (pkgId) => {
    localStorage.setItem("packageId", pkgId);
    setSelectedPackageId(pkgId);
    setShowPackageModal(false);
    setSelectedClass(null);
    setShowModal(false);
  };

  // When opening the modal, ensure selectedClass has isJoined property
  const handleClassClick = (classItem) => {
    setSelectedClass(classItem);
    setShowModal(true);
  };

  // ✅ Memoized joined class IDs
  const joinedClassIds = useMemo(() => {
    return new Set(bookingClasses.map((jc) => jc.classId));
  }, [bookingClasses]);

  // ✅ Memoized classesWithJoined
  const classesWithJoined = useMemo(() => {
    return classes.map((cls) => ({
      ...cls,
      isJoined: joinedClassIds.has(cls.id),
    }));
  }, [classes, joinedClassIds]);

  // ✅ Filter effect — now stable
  useEffect(() => {
    const filtered = classesWithJoined.filter((cls) => {
      const classDate = new Date(cls.date);
      const isSameDate =
        classDate.toDateString() === selectedDate.toDateString();

      const matchesLocation =
        !filters.location.length || filters.location.includes(cls.locationId);
      const matchesCategory =
        !filters.category.length || filters.category.includes(cls.categoryId);
      const matchesSessionType =
        !filters.sessionType.length ||
        filters.sessionType.includes(cls.sessionTypeId);

      return (
        isSameDate && matchesLocation && matchesCategory && matchesSessionType
      );
    });

    setFilteredClasses(filtered);
  }, [selectedDate, filters, classesWithJoined]);

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedClass(null);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const resetFilters = () => {
    setFilters({
      location: [],
      category: [],
      sessionType: [],
    });
  };

  const getAllCategory = async () => {
    handleLoading(true);
    try {
      const res = await CategoryApi.Allcategory();
      const fetchedCategories = res?.data?.data || [];
      setCategory(fetchedCategories);

      // If params id exists → use it, else use first category's _id
      if (_id) {
        setSelected(_id);
      } else if (fetchedCategories.length > 0) {
        setSelected(fetchedCategories[0]._id);
        setSelectedCatName(fetchedCategories[0].cName);
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      handleLoading(false);
    }
  };

  const activeCategoryName =
    selectedCatName || categories.find((cat) => cat._id === _id)?.cName || "";
  const getUniqueValues = (field) => {
    const values = [...new Set(classes.map((cls) => cls[field]))].filter(
      Boolean
    );
    // console.log(`Unique ${field} values:`, values);
    return values;
  };

  const getUniqueOptions = (nameField, idField) => {
    const unique = new Map();
    classes.forEach((item) => {
      const name = item[nameField];
      const id = item[idField];
      if (name && id && !unique.has(id)) {
        unique.set(id, name);
      }
    });
    return Array.from(unique.entries()).map(([id, name]) => ({ id, name }));
  };

  return (
   <div
  className={`${!hide 
    ? lightMode 
      ? "border bg-white"   
      : "border bg-gray-800" 
    : filteredClasses.length > 0 
      ? "min-h-screen" 
      : "h-60"
  }`}
>

      {/* Package Select Modal (always open if no active package or when user clicks button) */}
      {showPackageModal && (
        <PackageSelectModal
          packages={userPackages}
          selectedCatName={selectedCatName}
          activePackageId={activePackageId}
          onActivate={handleActivatePackage}
          onClose={() => setShowPackageModal(false)}
        />
      )}
      {!hide && (
       <div
      className={`flex border-b pt-10 ml-[5.5%] mr-[5.5%] transition-colors ${
        lightMode ? 'border-gray-200' : 'border-gray-700'
      }`}
    >
      <button
        onClick={() => setActiveTab('joinNew')}
        className={`flex items-center py-4 px-6 font-medium text-sm focus:outline-none transition-colors ${
          activeTab === 'joinNew'
            ? `border-b-2 border-${brandColor} text-${brandColor}`
            : lightMode
              ? 'text-gray-500 hover:text-gray-700'
              : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        <FaSearch className="mr-2" />
        Join New Classes
      </button>
      <button
        onClick={() => setActiveTab('myClasses')}
        className={`flex items-center py-4 px-6 font-medium text-sm focus:outline-none transition-colors ${
          activeTab === 'myClasses'
            ? `border-b-2 border-${brandColor} text-${brandColor}`
            : lightMode
              ? 'text-gray-500 hover:text-gray-700'
              : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        <FaCalendarAlt className="mr-2" />
        My Classes
      </button>
    </div>
      )}
      {activeTab === "myClasses" && (
        <div>
          <JoinedClasses myJoinedClasses={myJoinedClasses} />
        </div>
      )}
      {activeTab === "joinNew" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Package Info and Button */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
              {selectedPackage ? (
                <>
                  <div className="relative flex-1 flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-xs bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                      <span className="font-semibold text-gray-800">
                        {selectedPackage.name}
                      </span>
                      <span className="text-gray-600">
                        {selectedPackage.description}
                      </span>
                      <span
                        className={`font-medium ${
                          selectedPackage.remaining / selectedPackage.total <
                          0.3
                            ? "text-red-500"
                            : "text-sixth"
                        }`}
                      >
                        {selectedPackage.type === "class"
                          ? `${selectedPackage.remaining} of ${selectedPackage.total} classes remaining`
                          : `${selectedPackage.remaining} of ${selectedPackage.total} days remaining`}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedPackage(null);
                        localStorage.setItem("packageId", "");
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                      aria-label="Remove package"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-600"
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
                  </div>
                  <button
                    className="px-4 py-2.5 rounded-lg bg-sixth text-white font-semibold text-sm shadow-md hover:bg-sixth/90 transition-colors focus:ring-2 focus:ring-sixth/50 focus:outline-none"
                    onClick={() => setShowPackageModal(true)}
                  >
                    Change Package
                  </button>
                </>
              ) : (
                <>
                  <div className="flex-1 text-sm text-gray-500 font-medium px-2">
                    No active package{" "}
                    {userPackages.length > 0 ? "selected" : ""}
                  </div>
                  {userPackages.length > 0 ? (
                    <button
                      className={`bg-${brandColor} px-4 py-2.5 rounded-lg text-white font-semibold text-sm shadow-md hover:opacity-90 transition-colors focus:ring-2 focus:ring-offset-1 focus:outline-none`}
                      onClick={() => setShowPackageModal(true)}
                    >
                      Choose Package
                    </button>
                  ) : (
                    <button
                      className={`${
                        selectedCatName?.toLowerCase() === "wellness"
                          ? "bg-fourth"
                          : selectedCatName?.toLowerCase() === "liveness"
                          ? "bg-fifth"
                          : "bg-sixth"
                      } px-4 py-2.5 rounded-lg text-white font-semibold text-sm shadow-md hover:opacity-90 transition-colors focus:ring-2 focus:outline-none`}
                      onClick={() => navigate(`/catagory/${_id}#packages`)}
                    >
                      Buy Packages
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <div
            className={!hide ? `grid grid-cols-1 lg:grid-cols-12 gap-6` : ``}
          >
            {/* Left Sidebar - Header, Small Calendar + Filter Panel */}
            {!hide && (
              <div className="lg:col-span-3 flex flex-col gap-6">
                {/* Sidebar Header and Description */}
                <div className="mb-2">
                  <h2 className={`text-2xl font-bold ${lightMode?"text-gray-900":"text-gray-200"} mb-1`}>
                    {/* {JSON.stringify(classes?.[0]?.category)} */}
                    <span>
                      {/* {JSON.stringify(classes[0]?.category)} */}
                      {`${
                        classes?.[0]?.category ? classes[0].category + " " : ""
                      }Class Schedule`}
                    </span>
                  </h2>
                  <p className={`text-sm ${lightMode?"text-gray-500":"text-gray-200"}`}>
                    Browse and filter available classes. Select a class to view
                    details, buy, or join using your package.
                  </p>
                </div>

                <div className="w-full">
                  <select
                    value={selected}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const selectedCategory = categories.find(
                        (cat) => cat._id === selectedId
                      );

                      setSelected(selectedId);
                      setSelectedCatName(selectedCategory?.cName || "");

                      // ⬅️ update brand color based on cName
                      if (
                        selectedCategory?.cName?.toLowerCase() === "wellness"
                      ) {
                        setBrandColor("fourth");
                      } else if (
                        selectedCategory?.cName?.toLowerCase() === "liveness"
                      ) {
                        setBrandColor("fifth");
                      } else if (
                        selectedCategory?.cName?.toLowerCase() === "fitness"
                      ) {
                        setBrandColor("sixth");
                      }
                    }}
                    className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {categories?.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.cName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={`${lightMode?"bg-white border-gray-200" : "bg-gray-900 border-gray-700 "} border-gray-200 rounded-lg shadow-sm border  overflow-hidden`}>
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">
                      Calendar
                    </h2>
                  </div>
                  <div className="p-4">
                    <SmallCalendar
                      lightMode={lightMode}
                      selectedDate={selectedDate}
                      selectedCatName={selectedCatName}
                      onDateSelect={handleDateSelect}
                      classesData={classesWithJoined}
                    />
                  </div>
                </div>

                <FilterPanel
                  lightMode={lightMode}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onReset={resetFilters}
                  locations={getUniqueOptions("location", "locationId")}
                  categories={getUniqueOptions("category", "categoryId")}
                  sessionTypes={getUniqueOptions(
                    "sessionType",
                    "sessionTypeId"
                  )}
                />
              </div>
            )}
            {/* Main Content - Week View */}
            <div className="lg:col-span-9">
              {/* Mobile Filters */}
              {showFilters && (
                <div className="lg:hidden mb-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">
                      Filters
                    </h2>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="p-4">
                    <FilterPanel
                      filters={filters}
                      lightMode={lightMode}
                      onFilterChange={handleFilterChange}
                      onReset={resetFilters}
                      locations={getUniqueValues("location")}
                      categories={getUniqueValues("category")}
                      sessionTypes={getUniqueValues("sessionType")}
                    />
                  </div>
                </div>
              )}
              {/* Week View */}
              <div className={`${lightMode?"bg-white":"bg-gray-900 border-gray-500"} rounded-lg shadow-sm border border-gray-200 overflow-hidden h-[100vh]`}>
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg  text-gray-900 font-bold">
                      Schedule for{" "}
                      {selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </h2>
                    <div className="text-sm text-gray-500">
                      {filteredClasses.length} classes found
                    </div>
                  </div>
                </div>
                <div className="overflow-hidden">
                  <WeekView
                  lightMode={lightMode}
                    classes={filteredClasses}
                    selectedDate={selectedDate}
                    onClassClick={handleClassClick}
                    selectedPackage={selectedPackage}
                    joinedClassIds={Array.from(joinedClassIds)}
                    joinedClasses={myJoinedClasses}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Class Details Modal */}
      {showModal && selectedClass && (
        <ClassModal
          classData={selectedClass}
          onClose={handleCloseModal}
          selectedPackage={selectedPackage}
        />
      )}
    </div>
  );
};

export default Classes;
