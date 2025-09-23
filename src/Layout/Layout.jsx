import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import { useTheme } from "../contexts/ThemeContext";

const Layout = () => {
  const { lightMode, setLightMode } = useTheme();
  return (
    <main className={`w-full min-h-screen flex flex-col ${lightMode?"":"bg-third"}`}>
    <ScrollToTop/>
      <div className="relative flex-1 w-full ">
        <div className="fixed top-0 left-0 w-full z-20   ">
          <NavBar />
        </div>
        <div className="mt-12">
          <Outlet />
        </div>
      </div>
      <div className={`w-full `}>
        <Footer />
      </div>
    </main>
  );
};

export default Layout;
