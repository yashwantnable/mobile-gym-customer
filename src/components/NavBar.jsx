import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Calendar, MapPin, User, Menu, X } from "lucide-react";
import logo from "../../public/Logos/main-logo-dark-01.png";
import fitness from "../../public/Logos/fitness-logo.png";
import wellness from "../../public/Logos/wellness-main-logo.png";
import liveness from "../../public/Logos/liveness-logo-red.png";
import { useSelector, useDispatch } from "react-redux";
import ConfirmationModal from "./ConfirmationModal";
import { AuthApi } from "../Api/Auth.api";
import { logout } from "../store/authSlice";
import toast from "react-hot-toast";
import { useLoading } from "../loader/LoaderContext";
import { FilterApi } from "../Api/Filteration.api";
import { GoBell } from "react-icons/go";
import NotificationProvider from "./NotificationSocket";
import { CategoryApi } from "../Api/Category.api";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { id } = useParams();
  const { handleLoading } = useLoading();
  const [cat, setCat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);

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
  console.log("category:", category);

  const handleFilterSortBy = async (e) => {
    handleLoading(true);
    try {
      const res = await FilterApi.filterBySortBy({ categoryId: id });
      setCat(res.data?.data?.subscriptions?.[0]?.categoryId?.cName);
    } catch (err) {
      console.error("Filter sort error:", err);
    } finally {
      handleLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      handleFilterSortBy();
    } else {
      setCat(null);
    }
  }, [id]);

  // const navItems = [
  //   { path: "/subscriptions", label: "DEALS", icon: Calendar },
  //   { path: "/explore", label: "EXPLORE", icon: MapPin },
  //   { path: "/classes", label: "CLASSES", icon: MapPin },
  //   // { path: "/notification", label: "NOTIFICATIONS", icon: GoBell },
  //   // { path: "/notification", name: "Notifications", icon: <GoBell /> },
  // ];
  // const navItems = [
  //   { path: "/fitness", label: "Fitness", icon: Calendar },
  //   { path: "/classes", label: "Wellness", icon: MapPin },
  //   { path: "/subscriptions", label: "Liveness", icon: MapPin },
  // ];

  const userMenuItems = [
    { path: "/profile", label: "Profile" },
    { path: "/my-sessions", label: "My Sessions" },
    { path: "/history", label: "History" },
    { path: "/promocode", label: "Promo Codes" },
  ];

  const handleLogout = async () => {
    try {
      (await AuthApi.logout) && AuthApi.logout();
      dispatch(logout());
      toast.success("Logout Successfully");
      navigate("/login");
    } catch (error) {
      console.log("error", error);
    }
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(".mobile-menu-button")
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    getAllCategory();
  }, []);

  return (
    <>
      <nav className="bg-primary text-third px-4 sm:px-6 py-3 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img
              src={logo}
              alt="Logo"
              className={`h-11 sm:h-11 object-contain transition-transform ${
                cat === "fitness" || cat === "wellness" || cat === "liveness"
                  ? "absolute opacity-0 group-hover:opacity-100 group-hover:scale-105"
                  : "block hover:scale-105"
              }`}
            />
            {(cat === "fitness" ||
              cat === "wellness" ||
              cat === "liveness") && (
              <img
                src={
                  cat === "fitness"
                    ? fitness
                    : cat === "wellness"
                    ? wellness
                    : liveness
                }
                alt="Category Logo"
                className="h-11 sm:h-11 object-contain transition-transform group-hover:opacity-0"
              />
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 lg:space-x-8">
            {category.map((cat) => (
              <Link
                key={cat?._id}
                to={
                  cat?.cName?.toLowerCase() === "liveness"
                    ? "/comingsoon"
                    : `catagory/${cat?._id}`
                }
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                  location.pathname === `/catagory/${cat._id}`
                    ? "text-third font-semibold"
                    : "text-third/80 hover:text-third"
                }`}
              >
                <span>
                  {cat?.cName &&
                    cat.cName[0].toUpperCase() + cat.cName.slice(1)}
                </span>
              </Link>
            ))}

            {/* Notification bell moved here, after nav items and before user icon */}
            <div className="mt-2">
              {user && <NotificationProvider userId={user?._id} />}
            </div>
            {/* User actions - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  {/* Notifications dropdown removed from here */}

                  <button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex items-center space-x-1 focus:outline-none"
                  >
                    <div className="w-9 h-9 rounded-full bg-third/40 flex items-center justify-center overflow-hidden">
                      {user?.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : user?.name ? (
                        <span className="text-third text-lg font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      ) : (
                        <User className="w-5 h-5 text-third" />
                      )}
                    </div>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-xl py-2 z-50 border border-third-100">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium">
                          Hello, {user.name}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-gray-50 transition-colors border-t border-gray-100"
                        // className="w-full text-left px-4 py-3 text-lg font-medium text-third hover:text-red-100 hover:bg-white/10 rounded-xl"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex gap-3 items-center">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-white/10 transition-colors"
                  >
                    LOG IN
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-third hover:bg-primary-light transition-all duration-300 text-primary px-4 py-2 rounded-lg text-sm font-medium shadow-sm"
                  >
                    SIGN UP
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg focus:outline-none hover:bg-white/10 mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`md:hidden fixed inset-0 bg-primary z-40 transform transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ top: "64px" }}
      >
        <div className="px-6 py-4">
          <div className="flex flex-col space-y-4">
            {category.map((cat) => (
              <Link
                key={cat._id}
                to={cat._id}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium ${
                  location.pathname === `/catagory/${cat._id}`
                    ? "bg-white/20 text-third"
                    : "text-third/90 hover:text-third hover:bg-white/10"
                }`}
              >
                {/* Optional icon/image */}
                {/* You can use cat.image if needed */}
                {/* Example: <img src={cat.image} alt={cat.cName} className="w-5 h-5 rounded-full" /> */}

                <span>{cat.cName}</span>
              </Link>
            ))}

            <div className="pt-4 border-t border-white/20">
              {user ? (
                <>
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-third/90">
                      Hello, {user.name}
                    </p>
                  </div>
                  {userMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 text-third/90 hover:text-third hover:bg-white/10 rounded-xl text-lg font-medium"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => setIsModalOpen(true)}
                    // className="w-full text-left px-4 py-3 text-lg font-bold text-white bg-red-600"
                    className="hidden md:block text-white bg-red-600 px-4 py-2 rounded"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-6 py-3 text-center bg-white/10 hover:bg-white/20 text-third rounded-xl text-lg font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-6 py-3 text-center bg-white text-primary hover:bg-primary-light rounded-xl text-lg font-medium shadow-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLogout}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
      />
    </>
  );
};

export default NavBar;
