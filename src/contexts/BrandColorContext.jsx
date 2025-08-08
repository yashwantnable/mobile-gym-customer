import { createContext, useState, useContext, useEffect } from "react";

const BrandColorContext = createContext();

export const BrandColorProvider = ({ children }) => {
  const [brandColor, setBrandColor] = useState(() => {
    // Load from localStorage or default to "fourth"
    return localStorage.getItem("brandColor") || "fourth";
  });

  // Save to localStorage whenever brandColor changes
  useEffect(() => {
    localStorage.setItem("brandColor", brandColor);
  }, [brandColor]);

  return (
    <BrandColorContext.Provider value={{ brandColor, setBrandColor }}>
      {children}
    </BrandColorContext.Provider>
  );
};

export const useBrandColor = () => useContext(BrandColorContext);
