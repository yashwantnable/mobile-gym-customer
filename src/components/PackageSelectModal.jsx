import { useState } from "react";
import { CheckCircle, X } from "lucide-react";
import HorizontalScroll from "./HorizontalScroll";
import { useBrandColor } from "../contexts/BrandColorContext";
import { useTheme } from "../contexts/ThemeContext";

const PackageSelectModal = ({
  packages,
  selectedCatName,
  activePackageId,
  onActivate,
  onClose,
}) => {
  const [activating, setActivating] = useState("");
  const { lightMode } = useTheme(); 

  const handleActivate = (pkgId) => {
    console.log(pkgId);
    setActivating(pkgId);
    setTimeout(() => {
      onActivate(pkgId);
      setActivating("");
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border p-0 transition-colors
        ${lightMode 
          ? 'bg-white border-blue-100' 
          : 'bg-gray-900 border-gray-700' 
        }`}>
        {/* Header */}
        <div
          className={`flex items-center justify-between px-8 py-6 border-b rounded-t-2xl transition-colors
            ${lightMode 
              ? 'border-gray-100 bg-gradient-to-r bg-second'
              : 'border-gray-800 bg-gradient-to-r from-gray-700 to-gray-800' 
            }`}
        >
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Select Your Package
            </h2>
            <p className="text-white text-sm opacity-90">
              Choose a package to activate for booking classes
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="h-7 w-7" />
          </button>
        </div>
        {/* Packages Carousel */}
        <div className={`px-8 py-8 transition-colors
          ${lightMode 
            ? 'bg-white' // Light mode
            : 'bg-gray-900' // Dark mode
          }`}>
          <HorizontalScroll
            items={packages}
            renderItem={(pkg) => {
              const isActive = pkg.id === activePackageId;
              return (
                <div
                  key={pkg.id}
                  onClick={() => handleActivate(pkg?.originalData?._id)}
                  className={`relative flex flex-col items-center hover:bg-primary rounded-xl border-2 p-6 transition-all duration-200 cursor-pointer w-72
                    ${lightMode 
                      ? 'bg-white border-gray-200 text-gray-800' // Light mode card
                      : 'bg-gray-800 border-gray-600 text-white' // Dark mode card
                    }
                    ${isActive 
                      ? 'border-sixth shadow-lg' // Active state (overrides border)
                      : ''
                    }`}
                >
                  <div className={`w-16 h-16 mb-3 flex items-center justify-center rounded-full overflow-hidden border transition-colors
                    ${lightMode 
                      ? 'bg-gray-50 border-gray-200' // Light mode image bg
                      : 'bg-gray-700 border-gray-600' // Dark mode image bg
                    }`}>
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="object-contain w-full"
                    />
                  </div>
                  <h3 className="text-lg font-bold mb-1 text-center">
                    {pkg.name}
                  </h3>
                  <div className={`text-xs mb-2 text-center transition-colors
                    ${lightMode 
                      ? 'text-gray-500' // Light mode description
                      : 'text-gray-400' // Dark mode description
                    }`}>
                    {pkg.description}
                  </div>
                  <div className="text-xs font-semibold mb-2">
                    {pkg.duration}
                  </div>
                  <ul className="mb-4 space-y-1 w-full">
                    {pkg.features.map((f, i) => (
                      <li
                        key={i}
                        className={`flex items-center text-xs transition-colors
                          ${lightMode 
                            ? 'text-gray-700' // Light mode feature text
                            : 'text-gray-300' // Dark mode feature text
                          }`}
                      >
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }}
            itemClass=""
          />
        </div>
      </div>
    </div>
  );
};

export default PackageSelectModal;