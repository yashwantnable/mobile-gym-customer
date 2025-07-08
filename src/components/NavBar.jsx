import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Calendar, MapPin, User, Menu, X } from "lucide-react";
import logo from "../../public/Logos/main-logo-dark-01.png"
import { useSelector, useDispatch } from "react-redux";
import ConfirmationModal from "./ConfirmationModal";
import { AuthApi } from "../Api/Auth.api";
import { logout } from "../store/authSlice";
import toast from "react-hot-toast";

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

  const navItems = [
    // { path: "/", label: "Home", icon: Home },
    { path: "/subscriptions", label: "DEALS", icon: Calendar },
    { path: "/explore", label: "EXPLORE", icon: MapPin },
  ];

  const userMenuItems = [
    { path: "/profile", label: "Profile" },
    { path: "/my-sessions", label: "My Sessions" },
    { path: "/history", label: "History" },
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

  return (
    <>
      <nav className="bg-primary text-third px-4 sm:px-6 py-3 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={logo}
              alt="Logo"
              className="h-11 sm:h-11 object-contain transition-transform hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 lg:space-x-8 ">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === path
                    ? "bg-white/20 text-third"
                    : "text-third/80 hover:text-third hover:bg-white/10"
                  }`}
              >
                {/* <Icon size={18} /> */}
                <span>{label}</span>
                {/* <span>{path}</span> */}
              </Link>
            ))}
            {/* {JSON.stringify(navItems)} */}
            {/* User actions - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="relative" ref={dropdownRef}>
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
                        <p className="text-sm font-medium">Hello, {user.name}</p>
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
        className={`md:hidden fixed inset-0 bg-primary z-40 transform transition-all duration-300 ease-in-out ${mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        style={{ top: "64px" }}
      >
        <div className="px-6 py-4">
          <div className="flex flex-col space-y-4">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium ${location.pathname === path
                    ? "bg-white/20 text-third"
                    : "text-third/90 hover:text-third hover:bg-white/10"
                  }`}
              >
                <Icon size={20} />
                <span>{label}</span>
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
                    className="w-full text-left px-4 py-3 text-lg font-medium text-red-300 hover:text-red-100 hover:bg-white/10 rounded-xl"
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
