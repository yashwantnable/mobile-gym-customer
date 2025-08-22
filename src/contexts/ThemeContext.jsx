import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [lightMode, setLightMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem("theme", lightMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", lightMode); // for Tailwind dark mode
  }, [lightMode]);

  return (
    <ThemeContext.Provider value={{ lightMode, setLightMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
