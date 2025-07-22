import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import CustomDatePicker from "../components/CustomDatePicker";
import CustomDistanceFilter from "../components/CustomDistanceFilter";
import CustomLocationFilter from "../components/CustomLocationFilter";
import { useLocation, useParams } from "react-router-dom";
import { useLoading } from "../loader/LoaderContext";
import { CategoryApi } from "../Api/Category.api";
import moment from "moment";
import { FilterApi } from "../Api/Filteration.api";
import SubscriptionCard from "./SubscriptionCard";

const SubscriptionsPage = () => {
  const [selectedTab, setSelectedTab] = useState("classes");
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDistance, setSelectedDistance] = useState("Select Miles");
  const [selectedLocation, setSelectedLocation] = useState("");
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
  const [locationdata, setLocationsdata] = useState([]);

  const selectedLocationLabel = Array.isArray(locationdata)
    ? locationdata.find((loc) => loc.value === selectedLocation)?.label || ""
    : "";

  const getAllCategoriesById = async () => {
    handleLoading(true);
    try {
      const res = await CategoryApi.getAllCategoriesById(id);
      setClasses(res?.data?.data);
    } catch (error) {
      console.error("Error", error);
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
      console.error("Error", error);
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
      console.error("Error", error);
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
      console.error("Error", error);
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
      console.error("Error", error);
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
      console.error("Error", error);
    } finally {
      handleLoading(false);
    }
  };

  const getAllLocations = async () => {
    handleLoading(true);
    try {
      const res = await FilterApi.filterByLocations();
      setLocationsdata(res?.data?.data?.allLocationMasters || []);
    } catch (error) {
      console.error("Error", error);
      setLocationsdata([]);
    } finally {
      handleLoading(false);
    }
  };

  const getAllLocationById = async (id) => {
    handleLoading(true);
    try {
      const res = await FilterApi.filterBySubscription(id);
      setClasses(res?.data?.data);
    } catch (error) {
      console.error("Error", error);
    } finally {
      handleLoading(false);
    }
  };

  const handleLocationFilter = async (id) => {
    setSelectedLocation(id);
    await getAllLocationById(id);
  };

  const handleDateFilter = async (date) => {
    setSelectedDate(date);
    const payload = { date: [moment(date).format("YYYY-MM-DD")] };
    handleLoading(true);
    try {
      const res = await FilterApi.filterByDate(payload);
      setClasses(res.data?.data);
    } catch (err) {
      console.error(err);
    } finally {
      handleLoading(false);
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
      console.error(err);
    } finally {
      handleLoading(false);
    }
  };

  const handleLatLangFilter = async () => {
    handleLoading(true);
    const payload = { coordinates: [lng, lat], miles: 10 };
    try {
      const res = await FilterApi.filterByDistance(payload);
      setClasses(res.data?.data);
    } catch (err) {
      console.error(err);
    } finally {
      handleLoading(false);
    }
  };

  const handleFilterByTrainer = async (trainerId) => {
    handleLoading(true);
    try {
      const res = await FilterApi.filterByTrainerId(trainerId);
      setClasses(res.data?.data);
      setSelectedTab("classes");
    } catch (err) {
      console.error(err);
    } finally {
      handleLoading(false);
    }
  };

  const handleActivityToggle = async (activityId) => {
    let updatedActivities = selectedActivities.includes(activityId)
      ? []
      : [activityId];
    setSelectedActivities(updatedActivities);

    if (updatedActivities.length > 0) {
      const res = await CategoryApi.getSubscriptionBySessionId(
        updatedActivities[0]
      );
      setClasses(res.data?.data || []);
    } else {
      if (id) getAllCategoriesById();
      else getAllSubscription();
    }
  };

  const handleFilterSortBy = async (e) => {
    const value = e.target.value;
    let sortBy = value.toLowerCase();
    let order = value === "Highest Rated" ? "desc" : "asc";
    if (value === "Highest Rated") sortBy = "rating";

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

  const clearAllFilters = () => {
    setSelectedActivities([]);
    setSearchQuery("");
    setSelectedDate(null);
    setSelectedDistance("Select Miles");
    setSelectedLocation("");

    if (type === "cat") getAllCategoriesById();
    else if (type === "session") getAllSubscriptionBySessionId();
    else getAllSubscription();
  };

  useEffect(() => {
    getAllLocations();
    getAllLocationById(id);
  }, []);

  useEffect(() => {
    if (type === "cat") getAllCategoriesById();
    else if (type === "session") getAllSubscriptionBySessionId();
    else getAllSubscription();
    getAllSessionsByCategoryId();
  }, [type, id]);

  useEffect(() => {
    getAllTraniners();
  }, []);

  useEffect(() => {
    if (search) getAllSubscriptionBySearch();
  }, [search]);

  useEffect(() => {
    if (lat && lng) handleLatLangFilter();
  }, [lat, lng]);

  const filteredClasses = classes.filter((cls) => {
    if (cls.isExpired) return false;
    if (
      searchQuery &&
      !cls.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !cls.trainer?.first_name
        ?.toLowerCase()
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

  return (
    <div className="bg-primary min-h-screen overflow-x-hidden">
      {/* Your JSX rendering code continues here... */}
    </div>
  );
};

export default SubscriptionsPage;
