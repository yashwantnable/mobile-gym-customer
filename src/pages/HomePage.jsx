import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { IoLocationOutline } from "react-icons/io5";
import { FaStar, FaApple } from "react-icons/fa";
import { DiAndroid } from "react-icons/di";
import HorizontalScroll from "../components/HorizontalScroll";
import SubscriptionCards from "../components/SubscriptionCards";
import { useSelector } from "react-redux";
import { CategoryApi } from "../Api/Category.api";
import { useLoading } from "../loader/LoaderContext";
import { FilterApi } from "../Api/Filteration.api";
import { BookingApi } from "../Api/Booking.api";
import PackageCard from "../components/PackageCard";
import { PackagesApi } from "../Api/Package.api";
import Classes from "./Classes";
import Tooltip from "../components/Tooltip";
import { useTheme } from "../contexts/ThemeContext";

const HomePage = () => {
  const { lightMode } = useTheme();
  const { _id } = useParams();
  const user = useSelector((state) => state.auth.user);
  const [location, setLocation] = useState("Select location");
  const [locationDropdown, setLocationDropdown] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState("");
  const locationRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [category, setCategory] = useState([]);
  const [sessionData, setSessions] = useState([]);
  const [subscription, setSubscription] = useState([]);
  const [singleClassSubscriptions, setSingleClassSubscriptions] = useState([]);
  const [nearMeLocation, setNearMeLocation] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [traing, setTraing] = useState([]);
  const [packdata, setPackdata] = useState([]);
  const [userPackage, setUserPackage] = useState([]);
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem("recentSearches");
    return saved ? JSON.parse(saved) : [];
  });
  const [showRecent, setShowRecent] = useState(false);
  const navigate = useNavigate();

  const { hash } = useLocation();
  // console.log("_id:", _id);
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 400);
    }
  }, [hash]);

  const { handleLoading } = useLoading();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getAllCategory = async () => {
    handleLoading(true);
    try {
      const res = await CategoryApi.Allcategory();
      setCategory(res?.data?.data);
    } catch (error) {
      console.log("Error", error);
    } finally {
      handleLoading(false);
    }
  };

  const getCategoryById = async (id) => {
    handleLoading(true);
    try {
      const res = await CategoryApi.getAllSessionByCategoryId(id);
      setSessions(res?.data?.data);
      // console.log("getAllSessionByCategoryId:", res?.data?.data);
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
      setSubscription(res?.data?.data);
      setSingleClassSubscriptions(
        res?.data?.data.filter((item) => item.isSingleClass === true)
      );
    } catch (error) {
      console.log("Error", error);
    } finally {
      handleLoading(false);
    }
  };

  const getSubscriptionByID = async (id) => {
    handleLoading(true);
    try {
      const res = await CategoryApi.getAllCategoriesById(id);
      setSubscription(res?.data?.data);
      setSingleClassSubscriptions(
        res?.data?.data.filter((item) => item.isSingleClass === true)
      );
    } catch (error) {
      console.log("Error", error);
    } finally {
      handleLoading(false);
    }
  };

  const getAllPakages = async () => {
    handleLoading(true);
    try {
      const res = await PackagesApi.getpackages();
      // Ensure packdata is always an array
      const packages = Array.isArray(res?.data?.data)
        ? res.data.data
        : res?.data?.data?.packages || [];
      setPackdata(packages);
    } catch (error) {
      console.log("Error", error);
    } finally {
      handleLoading(false);
    }
  };

  const getUserPakage = async () => {
    const userId = user?._id;
    handleLoading(true);

    try {
      const res = await PackagesApi.getUserPackage(userId);
      // Ensure packdata is always an array
      const packages = Array.isArray(res?.data?.data)
        ? res.data.data
        : res?.data?.data?.packages || [];
      setUserPackage(packages);
    } catch (error) {
      console.log("Error", error);
    } finally {
      handleLoading(false);
    }
  };

  const getNearByLocation = async () => {
    const lat = localStorage.getItem("latitude");
    const lang = localStorage.getItem("longitude");
    const payload = {
      coordinates: [lang, lat],
      miles: 25,
    };
    handleLoading(true);
    try {
      const res = await FilterApi.filterByDistance(payload);
      setNearMeLocation(res?.data?.data);
    } catch (error) {
      console.log("Error", error);
    } finally {
      handleLoading(false);
    }
  };

  // const getAllSessions = async () => {
  //   handleLoading(true);
  //   try {
  //     const res = await CategoryApi.Allsession();
  //     setSessions(res?.data?.data);
  //   } catch (error) {
  //     console.log("Error", error);
  //   } finally {
  //     handleLoading(false);
  //   }
  // };

  const getAllTraining = async () => {
    handleLoading(true);
    try {
      const res = await BookingApi.getBookingHistory();
      setTraing(res?.data?.data);
    } catch (error) {
      console.log("Error", error);
    } finally {
      handleLoading(false);
    }
  };

  const { pathname } = useLocation();

  // Force scroll to top when component mounts or pathname changes
  useEffect(() => {
    // Prevent browser from restoring scroll position
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // Force scroll to top immediately
    window.scrollTo(0, 0);

    // Also try scrolling after a small delay to ensure it works
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    getAllCategory();
    // getAllSessions();
    getAllSubscription();
    getNearByLocation();
    getAllTraining();
    getAllPakages();
    if (user?._id) {
      getUserPakage();
    }
  }, [pathname, user?._id]);

  useEffect(() => {
    getCategoryById(_id);
    getSubscriptionByID(_id);
  }, [_id]);
  // useEffect(() => {
  //   getAllCategory();
  //   getAllSessions();
  //   getAllSubscription();
  //   getNearByLocation();
  //   getAllTraining();
  //   getAllPakages();
  // }, []);

  const handleSearchSubmit = (term) => {
    if (!term.trim()) return;
    let updated = [term, ...recentSearches.filter((s) => s !== term)].slice(
      0,
      5
    );
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
    setShowRecent(false);
    setSearchTerm("");
    navigate(`/subscriptions?search=${encodeURIComponent(term)}`);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setLocationDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUseCurrentLocation = () => {
    setLocLoading(true);
    setLocError("");

    if (!navigator.geolocation) {
      setLocError("Geolocation is not supported by your browser");
      setLocLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          navigate(`/subscriptions?lat=${latitude}&lng=${longitude}`);

          if (!response.ok) {
            throw new Error("Failed to fetch location data");
          }

          const data = await response.json();
          const address = data.address || {};

          let locationParts = [
            address.city || address.town || address.village,
            address.state,
            address.country,
          ].filter(Boolean);

          setLocation(locationParts.join(", ") || "Current Location");
        } catch (error) {
          setLocError("Could not determine your location");
          console.error("Geolocation error:", error);
        } finally {
          setLocLoading(false);
          setLocationDropdown(false);
        }
      },
      (error) => {
        setLocLoading(false);
        setLocError(
          "Please enable location permissions in your browser settings"
        );
        console.error("Geolocation permission error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className={`animate-fade-in ${lightMode ? "bg-white text-gray-900" : "bg-gray-900 text-gray-100"} pb-10`}>
      {/* Hero Section */}
      <section
        className="relative text-gray-900"
        style={{
          backgroundImage: `url('https://www.mindbodyonline.com/explore/static/media/hero.9d2f31ee.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "30rem",
          height: "25rem",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-third bg-opacity-70 z-0"></div>
        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 flex flex-col items-center justify-center min-h-[400px] md:min-h-[600px]">
          {/* Main Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-center animate-slide-up text-white">
            Discover the best in fitness & wellness
          </h1>
          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 max-w-xl md:max-w-2xl mx-auto text-center animate-slide-up text-primary">
            Your next workout, wellness class, or live session is just a click
            away
          </p>
          {/* Search Bar with Location - Side by Side */}
          <div className="w-full max-w-lg sm:max-w-3xl mx-auto mb-6 md:mb-8 animate-slide-up flex flex-col sm:flex-row gap-2 bg-white rounded-lg shadow-lg">
            <div className="flex-1 relative flex items-center px-4">
              <span className="text-third mr-2">
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-search"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowRecent(true)}
                onBlur={() => setTimeout(() => setShowRecent(false), 200)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearchSubmit(searchTerm);
                }}
                placeholder="Search for anything"
                className="w-full px-2 py-3 md:py-4 border-0 focus:outline-none text-third bg-transparent text-sm md:text-base"
              />
              {showRecent && recentSearches.length > 0 && (
                <div className="absolute left-0 top-full mt-2 w-full bg-white shadow-lg border border-third/20 z-20">
                  <div className="px-4 py-2 text-xs font-semibold text-third">
                    Recent Searches
                  </div>
                  {recentSearches.map((item, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2 cursor-pointer hover:bg-primary/10 text-third"
                      onMouseDown={() => handleSearchSubmit(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Location Dropdown */}
            <div
              className="w-full sm:w-96 relative flex items-center px-4 border-t sm:border-t-0 sm:border-l border-third/20"
              ref={locationRef}
            >
              <span className="text-third mr-2">
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-map-pin"
                >
                  <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1 1 18 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <div
                className="w-full px-2 py-3 md:py-4 border-0 focus:outline-none text-third font-semibold bg-transparent cursor-pointer text-sm md:text-base"
                onClick={() => {
                  setLocationDropdown(!locationDropdown);
                }}
              >
                {location}
              </div>

              {locationDropdown && (
                <div className="absolute left-0 top-full mt-2 w-full bg-white shadow-lg border border-third/20 z-20">
                  <button
                    className="w-full flex items-center gap-2 px-6 py-4 hover:bg-primary/10 text-left text-third font-medium"
                    onClick={handleUseCurrentLocation}
                    disabled={locLoading}
                  >
                    <svg
                      width="30"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-navigation"
                    >
                      <polygon points="3 11 22 2 13 21 11 13 3 11" />
                    </svg>
                    {locLoading ? "Detecting..." : "Use Current Location"}
                  </button>
                  {locError && (
                    <div className="text-fourth px-6 pb-3 text-sm">
                      {locError}
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              className="bg-fourth hover:bg-fourth-dark text-white px-4 md:px-6 flex items-center justify-center min-h-[48px]"
              onClick={() => handleSearchSubmit(searchTerm)}
              type="button"
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-search"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
          </div>
          {/* App CTA */}
          <div className="flex items-center gap-2 animate-slide-up">
            <FaApple className="text-xl md:text-2xl text-white" />
            <DiAndroid className="text-xl md:text-2xl text-white" />
            <span className="text-white font-semibold text-sm md:text-base">
              Get the app today
            </span>
          </div>
        </div>
      </section>

      {/* Top Sessions Section */}
      {sessionData?.length > 0 && (
        <section className="bg-primary py-10 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl md:text-3xl font-bold mb-6 md:mb-8 capitalize text-third text-start">
              Top fitness Sessions
            </h2>

            {/* Make wrapper allow overflow */}
            <div
              style={{ position: "relative", overflow: "visible", zIndex: 1 }}
            >
              <HorizontalScroll
                items={sessionData}
                renderItem={(cat) => (
                  <div
                    className="group flex flex-col items-center"
                    style={{
                      position: "relative",
                      overflow: "visible",
                      zIndex: 1,
                    }}
                  >
                    <Link
                      to={`/subscriptions/${cat?._id}?name=session`}
                      className="w-40 h-40 md:w-56 md:h-56 hover:opacity-90 cursor-pointer flex items-end justify-center rounded-full bg-center bg-cover text-lg md:text-2xl font-semibold text-white shadow-md"
                      style={{
                        backgroundImage: `url(${cat.image})`,
                        position: "relative",
                        overflow: "visible",
                        zIndex: 2,
                      }}
                    >
                      {/* Gradient overlay */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: "9999px",
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                        }}
                      />
                      {/* Session name */}
                      <div style={{ position: "relative", zIndex: 3 }}>
                        <span className="text-white text-sm md:text-base font-semibold">
                          {cat?.sessionName?.toUpperCase()}
                        </span>
                      </div>
                    </Link>

                    {/* Tooltip */}
                    {cat.description && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: "50%",
                          transform: "translateX(-50%)",
                          marginTop: "8px",
                          width: "200px",
                          padding: "12px",
                          backgroundColor: "#FCD34D", // bg-third
                          color: "#111827", // text-primary
                          fontSize: "14px",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                          opacity: 0,
                          visibility: "hidden",
                          transition: "opacity 0.3s ease, visibility 0.3s ease",
                          zIndex: 99999,
                        }}
                        className="group-hover:opacity-100 group-hover:visible"
                      >
                        <p style={{ textAlign: "center" }}>{cat.description}</p>
                        {/* Arrow */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: "100%",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: 0,
                            height: 0,
                            borderLeft: "8px solid transparent",
                            borderRight: "8px solid transparent",
                            borderBottom: "8px solid #FCD34D", // same as bg
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
        </section>
      )}

      <section className="border  overflow-hidden py-10 md:py-16 mt-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-2 md:gap-0">
            <h2 className="text-xl md:text-3xl font-bold capitalize text-third">
              Today's Classes
            </h2>
            <Link
              to={`/classes/${_id}`}
              className="text-fourth font-semibold flex items-center gap-1"
            >
              Show all ({singleClassSubscriptions?.length}) <span>&rarr;</span>
            </Link>
          </div>

          <div className="">
            <Classes hide={true} />
          </div>
        </div>
      </section>
      {/* Featured Membership */}
      {subscription?.length > 0 && (
        <section className="bg-primary py-10 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-2 md:gap-0">
              <h2 className="text-xl md:text-3xl font-bold capitalize text-third">
                Top Membership
              </h2>
              <Link
                to={`/subscriptions`}
                className="text-fourth font-semibold flex items-center gap-1"
              >
                Show all ({subscription?.length}) <span>&rarr;</span>
              </Link>
            </div>
            <HorizontalScroll
              items={subscription}
              renderItem={(session) => <SubscriptionCards {...session} />}
              itemClass="mr-4 md:mr-6"
            />
          </div>
        </section>
      )}

      {/* Pakages   */}
      <section id="packages" className="py-10 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-2 md:gap-0">
            <h2 className="text-xl md:text-3xl font-bold capitalize text-third">
              Find Your New Latest Packages
            </h2>
          </div>
          <HorizontalScroll
            items={Array.isArray(packdata) ? packdata : []}
            renderItem={(pkg) => {
              // Check if user has already purchased this package
              // Try different possible field names for package ID
              const isPurchased = userPackage.some(
                (userPkg) =>
                  userPkg.packageId === pkg._id ||
                  userPkg.package?._id === pkg._id ||
                  userPkg.packageId?._id === pkg._id ||
                  userPkg._id === pkg._id
              );
              // console.log(
              //   `Package ${pkg._id} (${pkg.name}) - isPurchased:`,
              //   isPurchased,
              //   "userPackage:",
              //   userPackage
              // );

              return (
                <PackageCard
                  key={pkg?._id}
                  image={pkg?.image}
                  name={pkg?.name || "No Name"}
                  price={pkg?.price || 0}
                  numberOfClasses={pkg?.numberOfClasses || 0}
                  duration={pkg?.duration || "N/A"}
                  features={pkg?.features}
                  packageData={pkg}
                  isPurchased={isPurchased}
                />
              );
            }}
            itemClass="mr-4 md:mr-6"
          />
        </div>
      </section>

      {/* Location near you Sessions */}
      {nearMeLocation?.length > 0 && (
        <section className="bg-primary py-10 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-2 md:gap-0">
              <h2 className="text-xl md:text-3xl font-bold capitalize text-third">
                Locations near you
              </h2>
              <Link
                to="/subscriptions"
                className="text-fourth font-semibold flex items-center gap-1"
              >
                Show all ({nearMeLocation?.length}) <span>&rarr;</span>
              </Link>
            </div>
            <HorizontalScroll
              items={nearMeLocation}
              renderItem={(session) => <SubscriptionCards {...session} />}
              itemClass="mr-4 md:mr-6"
            />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section
        className="py-10 mt-20 md:py-16 bg-third relative rounded-xl mx-auto w-[calc(100%-1rem)] md:w-[calc(100%-5rem)] max-w-[1200px] px-4 sm:px-6 lg:px-8 xl:px-32 2xl:pl-[35rem]"
        data-name="Section.outBoxApp"
        style={{
          backgroundImage: `url('https://www.mindbodyonline.com/explore/static/media/mb-app-background-desktop.165fd981.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 text-third z-0"></div>
        <div className="container mx-auto relative z-10">
          <div className="lg:ml-0 lg:mr-auto lg:pl-8 xl:pl-[35rem] 2xl:pl-32">
            <h6 className="mb-0 text-xs md:text-sm font-semibold">
              OutBox Fitness
            </h6>
            <h5 className="text-lg md:text-2xl font-bold mt-2 mb-2 md:mb-4 ">
              The best in wellness is at your fingertips
            </h5>
            <p className="mb-4 md:mb-6 text-sm md:text-base ">
              Whatever you're seeking—from fitness to beauty & beyond—you'll
              find it on the OutBox app. Download to start your search.
            </p>
            <div className="w-full relative">
              <div className="flex">
                <div className="w-auto">
                  <button
                    className="bg-fourth hover:bg-fourth-dark  uppercase font-semibold py-3 px-6 rounded-md flex items-center justify-center text-sm tracking-wide"
                    type="button"
                    onClick={toggleDropdown}
                  >
                    GET THE APP
                    <span aria-hidden="true" className="ml-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path d="M12 15l-5-5h10l-5 5z" />
                      </svg>
                    </span>
                  </button>

                  {showDropdown && (
                    <div className="absolute mt-1 w-40 md:w-48 bg-white rounded-md shadow-lg z-10 border border-third/20">
                      <div className="py-1">
                        <a
                          href="#ios"
                          className="block px-4 py-2 text-xs md:text-sm text-third hover:bg-primary/10"
                        >
                          iOS App
                        </a>
                        <a
                          href="#android"
                          className="block px-4 py-2 text-xs md:text-sm text-third hover:bg-primary/10"
                        >
                          Android App
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
