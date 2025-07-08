import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import CustomDatePicker from "../components/CustomDatePicker";
import CustomDistanceFilter from "../components/CustomDistanceFilter";
import { Link, useLocation, useParams } from "react-router-dom";
import { useLoading } from "../loader/LoaderContext";
import { CategoryApi } from "../Api/Category.api";
import moment from "moment";
import { FilterApi } from "../Api/Filteration.api";
import PackageCard from "../components/PackageCard";

const SubscriptionsPage = () => {
  const [selectedTab, setSelectedTab] = useState("classes");
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDistance, setSelectedDistance] = useState("Select Miles");
  const [classPage, setClassPage] = useState(1);
  const [instructorPage, setInstructorPage] = useState(1);
  const classesPerPage = 6;
  const instructorsPerPage = 6;
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("name");
  const search = queryParams.get("search");
  const lat = queryParams.get("lat");
  const lng = queryParams.get("lng");
  const { handleLoading } = useLoading();
  const [classes, setClasses] = useState([]);
  const [activities, setActivities] = useState([]);
  const [trainers, setTrainers] = useState([]);

  const getAllCategoriesById = async () => {
    handleLoading(true);
    try {
      const res = await CategoryApi.getAllCategoriesById(id);
      setClasses(res?.data?.data);
    } catch (error) {
      console.log("Error", error);
    } finally {
      handleLoading(false);
    }
  };

  const getAllSubscription = async () => {
    handleLoading(true);
    try {
      const res = await CategoryApi.getAllSubscription();
      setClasses(res?.data?.data);
    } catch (error) {
      console.log("Error", error);
    } finally {
      handleLoading(false);
    }
  };

  const getAllSubscriptionBySessionId = async () => {
    handleLoading(true);
    try {
      const res = await CategoryApi.getSubscriptionBySessionId(id);
      setClasses(res?.data?.data);
    } catch (error) {
      console.log("Error", error);
    } finally {
      handleLoading(false);
    }
  };

  const getAllSessionsByCategoryId = async () => {
    handleLoading(true);
    try {
      const res = id
        ? await CategoryApi.getAllSessionByCategoryId(id)
        : await CategoryApi.Allsession();
      setActivities(res?.data?.data);
    } catch (error) {
      console.log("Error", error);
    } finally {
      handleLoading(false);
    }
  };

  const getAllTraniners = async () => {
    handleLoading(true);
    try {
      const res = await CategoryApi.getAllTrainers();
      setTrainers(res.data?.data);
    } catch (error) {
      console.log("Error", error);
    } finally {
      handleLoading(false);
    }
  };

  const getAllSubscriptionBySearch = async () => {
    handleLoading(true);
    try {
      const res = await FilterApi.filterBySearch(search);
      setClasses(res.data?.data);
    } catch (error) {
      console.log("Error", error);
    } finally {
      handleLoading(false);
    }
  };

  useEffect(() => {
    if (type === "cat") {
      getAllCategoriesById();
    } else if (type === "session") {
      getAllSubscriptionBySessionId();
    } else {
      getAllSubscription();
    }
    getAllSessionsByCategoryId();
  }, [type, id]);

  useEffect(() => {
    getAllTraniners();
  }, []);

  useEffect(() => {
    if (search) {
      getAllSubscriptionBySearch();
    }
  }, [search]);

  const filteredClasses = classes.filter((classItem) => {
    if (
      searchQuery &&
      !classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !classItem.trainer.first_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const paginatedClasses = filteredClasses.slice(
    (classPage - 1) * classesPerPage,
    classPage * classesPerPage
  );
  const totalClassPages = Math.ceil(filteredClasses.length / classesPerPage);

  const paginatedInstructors = trainers.slice(
    (instructorPage - 1) * instructorsPerPage,
    instructorPage * instructorsPerPage
  );
  const totalInstructorPages = Math.ceil(trainers.length / instructorsPerPage);

  const formatDate = (date) => {
    const res = moment(date).format("YYYY-MM-DD");
    return res;
  };

  const handleDateFilter = async (date) => {
    setSelectedDate(date);
    const payload = {
      date: [formatDate(date)],
    };
    handleLoading(true);
    try {
      const res = await FilterApi.filterByDate(payload);
      setClasses(res.data?.data);
    } catch (err) {
      console.log(err);
    } finally {
      handleLoading(false);
    }
  };

  const clearAllFilters = () => {
    setSelectedActivities([]);
    setSearchQuery("");
    setSelectedDate(null);
    setSelectedDistance("Select Miles");
    if (type === "cat") {
      getAllCategoriesById();
    } else if (type === "session") {
      getAllSubscriptionBySessionId();
    } else {
      getAllSubscription();
    }
  };

  const handleFilterByTrainer = async (trainerId) => {
    handleLoading(true);
    try {
      const res = await FilterApi.filterByTrainerId(trainerId);
      setClasses(res.data?.data);
      setSelectedTab("classes");
    } catch (err) {
      console.log(err);
    } finally {
      handleLoading(false);
    }
  };

  const handleActivityToggle = async (activityId) => {
    let updatedActivities;
    if (selectedActivities.includes(activityId)) {
      updatedActivities = [];
    } else {
      updatedActivities = [activityId];
    }
    setSelectedActivities(updatedActivities);

    if (updatedActivities.length > 0) {
      const res = await CategoryApi.getSubscriptionBySessionId(
        updatedActivities[0]
      );
      setClasses(res.data?.data || []);
    } else if (id) {
      getAllCategoriesById();
    } else {
      getAllSubscription();
    }
  };

  const handleDistanceFilter = async (dis) => {
    handleLoading(true);
    setSelectedDistance(dis);
    const lati = localStorage.getItem("latitude");
    const longi = localStorage.getItem("longitude");
    const payload = {
      coordinates: [longi, lati],
      miles: parseFloat(dis),
    };

    try {
      const res = await FilterApi.filterByDistance(payload);
      setClasses(res.data?.data);
    } catch (err) {
      console.log(err);
    } finally {
      handleLoading(false);
    }
  };
  const handleLatLangFilter = async () => {
    handleLoading(true);
    const payload = {
      coordinates: [lng, lat],
      miles: 10,
    };
    try {
      const res = await FilterApi.filterByDistance(payload);
      setClasses(res.data?.data);
    } catch (err) {
      console.log(err);
    } finally {
      handleLoading(false);
    }
  };

  useEffect(() => {
    console.log(lat, lng);
    if (lat && lng) {
      handleLatLangFilter();
    }
  }, [lat, lng]);

  const handleFilterSortBy = async (e) => {
    const value = e.target.value;

    let sortBy;
    let order = "asc";

    if (value === "Highest Rated") {
      sortBy = "rating";
      order = "desc";
    } else {
      sortBy = value.toLowerCase();
    }

    const payload = {
      sortBy,
      order,
      ...(type === "cat" && { categoryId: id }),
      ...(type === "session" && { sessionId: id }),
    };

    handleLoading(true);

    try {
      const res = await FilterApi.filterBySortBy(payload);
      setClasses(res.data?.data?.subscriptions);
    } catch (err) {
      console.error("Filter sort error:", err);
    } finally {
      handleLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Top bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center gap-4 mb-4 md:mb-0 flex-wrap">
            <button
              className={`px-4 py-2 rounded-full font-semibold text-sm ${
                selectedTab === "classes"
                  ? "bg-gray-200"
                  : "bg-transparent text-gray-500"
              }`}
              onClick={() => setSelectedTab("classes")}
            >
              CLASSES
            </button>
            <button
              className={`px-4 py-2 rounded-full font-semibold text-sm ${
                selectedTab === "instructors"
                  ? "bg-gray-200"
                  : "bg-transparent text-gray-500"
              }`}
              onClick={() => setSelectedTab("instructors")}
            >
              INSTRUCTORS
            </button>
            {/* Date Filter */}
            {selectedTab === "classes" && (
              <div className="flex items-center gap-2 ml-2">
                <CustomDatePicker
                  selected={selectedDate}
                  onChange={(date) => handleDateFilter(date)}
                />
              </div>
            )}
            {/* Distance Filter */}
            {selectedTab === "classes" && (
              <div className="flex items-center gap-2 ml-2">
                <CustomDistanceFilter
                  value={selectedDistance}
                  onChange={(dis) => handleDistanceFilter(dis)}
                  options={[
                    "25 miles",
                    "1 mile",
                    "5 miles",
                    "10 miles",
                    "15 miles",
                    "50 miles",
                    "50+ miles",
                  ]}
                />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">
              Home / Fitness /{" "}
              {selectedTab === "classes" ? "Classes" : "Instructors"} /
            </span>
            <span className="text-gray-700 font-semibold text-sm">
              {selectedTab === "classes"
                ? `${(classPage - 1) * classesPerPage + 1}-${Math.min(
                    classPage * classesPerPage,
                    filteredClasses.length
                  )} results of ${filteredClasses.length}`
                : `${Math.min(
                    instructorPage * instructorsPerPage,
                    trainers.length
                  )} results of ${trainers.length}`}
            </span>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Best {selectedTab === "classes" ? "Classes" : "Instructors"} in United
          Arab Emirates
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          {selectedTab === "classes" && (
            <aside className="w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-lg">FILTERS</span>
                  <button
                    className="text-sm text-primary-600 font-semibold"
                    onClick={clearAllFilters}
                  >
                    Clear all
                  </button>
                </div>

                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full p-2 border border-gray-300 rounded-lg pl-8 outline-none"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <svg
                      className="absolute left-2 top-3 h-4 w-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                {activities.length > 0 && (
                  <div className="mb-6">
                    <div className="font-semibold text-gray-800 mb-2">
                      Activities
                    </div>
                    {activities.map((activity) => (
                      <label
                        key={activity?._id}
                        className="flex items-center gap-2 mb-1 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedActivities.includes(activity._id)}
                          onChange={() => handleActivityToggle(activity._id)}
                          className="accent-primary-600"
                        />
                        <span className="text-gray-700">
                          {activity?.sessionName}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          )}

          {/* Main Content */}
          <main className="flex-1 mb-10">
            {selectedTab === "classes" ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <div className="text-gray-700">
                    {filteredClasses.length} classes found
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm">Sort By</span>
                    <select
                      className="border border-gray-300 font-bold outline-none cursor-pointer rounded px-2 py-1 w-48 text-sm"
                      onChange={(e) => handleFilterSortBy(e)}
                    >
                      <option>Price</option>
                      <option>Highest Rated</option>
                      <option>Distance</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedClasses.map((classItem, index) => (
                    <PackageCard
                      key={index}
                      image={classItem.media}
                      name={classItem.name}
                      price={classItem.price}
                      numberOfClasses={classItem.numberOfClasses || 1}
                      duration={
                        classItem.duration ||
                        (classItem.date
                          ? `${formatDate(classItem?.date?.[0])} - ${formatDate(
                              classItem?.date?.[1]
                            )}`
                          : "")
                      }
                    />
                  ))}
                </div>
                <Pagination
                  currentPage={classPage}
                  totalPages={totalClassPages}
                  onPageChange={setClassPage}
                />
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedInstructors.map((inst, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 bg-white rounded-xl shadow p-4 cursor-pointer"
                      onClick={() => handleFilterByTrainer(inst._id)}
                    >
                      <img
                        src={inst.profile_image}
                        alt={`${inst.first_name} ${inst.last_name}`}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-bold text-lg">
                          {inst.first_name} {inst.last_name}
                        </div>
                        <div className="uppercase text-xs font-semibold text-gray-600">
                          {inst.specialization}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {inst.city?.name}
                          {inst.city?.name && inst.country?.name ? ", " : ""}
                          {inst.country?.name}
                        </div>
                        <div className="text-gray-500 text-xs mt-1">
                          Experience: {inst.experienceYear} years
                        </div>
                        <div className="text-green-600 text-xs font-semibold">
                          {inst.userStatus}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination
                  currentPage={instructorPage}
                  totalPages={totalInstructorPages}
                  onPageChange={setInstructorPage}
                />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
