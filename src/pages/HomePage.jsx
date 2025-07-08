import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const HomePage = () => {
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
  const [nearMeLocation, setNearMeLocation] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [traing, setTraing] = useState([]);
  const [packdata, setPackdata] = useState([]);
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem("recentSearches");
    return saved ? JSON.parse(saved) : [];
  });
  const [showRecent, setShowRecent] = useState(false);
  const navigate = useNavigate();

  const { handleLoading } = useLoading();

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

  const getAllSubscription = async () => {
    handleLoading(true);
    try {
      const res = await CategoryApi.getAllSubscription();
      setSubscription(res?.data?.data);
    } catch (error) {
      console.log("Error", error);
    } finally {
      handleLoading(false);
    }
  };

  console.log(" this is pakage  data ", packdata);
  const getAllPakages = async () => {
    handleLoading(true);
    try {
      const res = await CategoryApi.getpackages();
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

  const getAllSessions = async () => {
    handleLoading(true);
    try {
      const res = await CategoryApi.Allsession();
      setSessions(res?.data?.data);
    } catch (error) {
      console.log("Error", error);
    } finally {
      handleLoading(false);
    }
  };

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

  useEffect(() => {
    getAllCategory();
    getAllSessions();
    getAllSubscription();
    getNearByLocation();
    getAllTraining();
    getAllPakages();
  }, []);

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
    <div className="animate-fade-in bg-primary pb-10">
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

      {/* Explore OutBox Section */}
      {category?.length > 0 && (
        <section className="bg-primary py-8 md:py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl md:text-3xl font-bold mb-6 md:mb-10 text-third">
              Explore OutBox
            </h2>
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 flex-wrap">
              {category.map((cat) => {
                let bgColorClass = "bg-sixth";
                if (cat.cName?.toLowerCase().includes("wellness"))
                  bgColorClass = "bg-fourth";
                if (cat.cName?.toLowerCase().includes("liveness"))
                  bgColorClass = "bg-fifth";

                return (
                  <Link
                    key={cat._id}
                    to={`/subscriptions/${cat._id}?name=cat`}
                    className="relative cursor-pointer hover:scale-105 transition-transform duration-300 flex-1 rounded-2xl overflow-hidden shadow-lg min-w-[300px] max-w-[400px]"
                  >
                    <img
                      src={cat.image}
                      alt={cat.alt}
                      className="w-full h-56 object-cover"
                    />
                    <div
                      className={`absolute inset-0 ${bgColorClass} bg-opacity-70`}
                    ></div>
                    <div className="absolute bottom-0 left-0 p-6 z-10">
                      <span className="text-white text-2xl font-bold drop-shadow-lg">
                        {cat.cName}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* My Sessions */}
      {user && traing?.length > 0 && (
        <section className="bg-primary pb-10 md:pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-left mb-8 md:mb-12">
              <h2 className="text-xl md:text-3xl font-bold mb-6 md:mb-8 capitalize text-third">
                My Training Logs
              </h2>
            </div>
            <HorizontalScroll
              items={traing}
              renderItem={(item, idx) => {
                const sub = item.subscription || {};
                const address = sub.Address || {};
                const country = address.country?.name || "";
                const city = address.city?.name || "";
                const landmark = address.landmark || "";
                const street = address.streetName || "";
                const trainer = sub.trainer || {};
                const sessionType = sub.sessionType || {};
                const category = sub.categoryId || {};
                const dates = Array.isArray(sub.date) ? sub.date : [];
                return (
                  <div
                    key={item._id || idx}
                    className="bg-white rounded-xl shadow-lg overflow-hidden w-80 flex-shrink-0 transition-all duration-200 hover:shadow-2xl border border-third/20 flex flex-col cursor-pointer"
                    onClick={() =>
                      navigate(`/history-details/${item._id || item.id}`, {
                        state: { details: item },
                      })
                    }
                  >
                    <img
                      src={sub.media}
                      alt={sub.name}
                      className="w-full h-44 object-cover object-center"
                    />
                    <div className="p-4 flex flex-col gap-2 flex-1 justify-between">
                      <div className="flex justify-between items-center mb-1">
                        <span className="uppercase text-xs font-bold tracking-widest text-white bg-third px-2 py-0.5 rounded-full">
                          {category.cName}
                        </span>
                        <span className="text-xs font-semibold text-white bg-fourth px-2 py-0.5 rounded-full">
                          {sessionType.sessionName}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg mb-1 capitalize text-third line-clamp-1">
                        {sub.name}
                      </h3>
                      <div className="text-xs text-third mb-1 flex items-center gap-4">
                        <span className="font-semibold">
                          {trainer.first_name} {trainer.last_name}
                        </span>
                        <span className="flex items-center gap-1 ml-auto">
                          <IoLocationOutline className="mr-1" />
                          {city ? city : "Location"}
                        </span>
                      </div>
                      {/* Dates, Time, Price Row */}
                      <div className="flex items-center text-xs text-third mb-1 gap-2">
                        {/* Dates */}
                        <span>
                          {dates
                            .map((date) =>
                              new Date(date).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            )
                            .join(", ")}
                        </span>
                        {/* Time */}
                        <span className="ml-3">
                          {sub.startTime} - {sub.endTime}
                        </span>
                        {/* Price */}
                        <span className="ml-auto font-semibold text-fourth">
                          AED{sub.price}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-third mb-1 gap-2">
                        {item.rating && (
                          <span className="flex items-center">
                            <FaStar className="text-yellow-400 mr-1" />
                            {item.rating}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }}
              itemClass="mr-4 md:mr-6"
            />
          </div>
        </section>
      )}

      {/* Top Sessions Section */}
      {sessionData?.length > 0 && (
        <section className="bg-primary py-10 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl md:text-3xl font-bold mb-6 md:mb-8 capitalize text-third text-start">
              Top fitness Sessions
            </h2>
            <HorizontalScroll
              items={sessionData}
              renderItem={(cat) => (
                <Link
                  to={`/subscriptions/${cat?._id}?name=session`}
                  className="w-40 h-40 md:w-56 md:h-56 hover:opacity-90 cursor-pointer flex items-center justify-center rounded-full bg-center bg-cover text-lg md:text-2xl font-semibold text-white shadow-md"
                  style={{
                    backgroundImage: `url(${cat.image})`,
                  }}
                >
                  <div className="bg-third bg-opacity-70 rounded-full px-4 py-2 text-center">
                    {cat.sessionName}
                  </div>
                </Link>
              )}
            />
          </div>
        </section>
      )}

      {/* Featured Sessions */}
      {subscription?.length > 0 && (
        <section className="bg-primary py-10 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-2 md:gap-0">
              <h2 className="text-xl md:text-3xl font-bold capitalize text-third">
                Find your new favorite classes
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

      {/* your Pakages   */}

      <section className=" py-10 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-2 md:gap-0">
            <h2 className="text-xl md:text-3xl font-bold capitalize text-third">
              All Packages
            </h2>
            <Link
              to="/subscriptions"
              className="text-primary-600 font-semibold flex items-center gap-1"
            >
              Show all ({Array.isArray(packdata) ? packdata.length : 0}){" "}
              <span>&rarr;</span>
            </Link>
          </div>
          <HorizontalScroll
            items={Array.isArray(packdata) ? packdata : []}
            renderItem={(pkg) => (
              <PackageCard
                key={pkg?._id || pkg?.id || Math.random()}
                image={pkg?.image || "/default-image.png"}
                name={pkg?.name || "No Name"}
                price={pkg?.price || 0}
                numberOfClasses={pkg?.numberOfClasses || 0}
                duration={pkg?.duration || "N/A"}
              />
            )}
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
