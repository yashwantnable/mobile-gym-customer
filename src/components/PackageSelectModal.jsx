import { useState } from "react";
import { CheckCircle, X } from "lucide-react";
import HorizontalScroll from "./HorizontalScroll";
import { useBrandColor } from "../contexts/BrandColorContext";
const PackageSelectModal = ({
  packages,
  selectedCatName,
  activePackageId,
  onActivate,
  onClose,
}) => {
  const [activating, setActivating] = useState("");
  const { brandColor } = useBrandColor();
  const handleActivate = (pkgId) => {
    console.log(pkgId);
    setActivating(pkgId);
    setTimeout(() => {
      onActivate(pkgId);
      setActivating("");
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-blue-100 p-0">
        {/* Header */}
        <div
          className={`flex items-center justify-between px-8 py-6 border-b border-gray-100 rounded-t-2xl bg-${brandColor}`}
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
        <div className="px-8 py-8">
          <HorizontalScroll
            items={packages}
            renderItem={(pkg) => {
              const isActive = pkg.id === activePackageId;
              return (
                <div
                  key={pkg.id}
                  onClick={() => handleActivate(pkg?.originalData?._id)}
                  className={`relative flex flex-col items-center hover:bg-primary bg-white rounded-xl border-2 ${
                    isActive ? "border-sixth shadow-lg" : "border-gray-200"
                  } p-6 transition-all duration-200 cursor-pointer w-72`}
                >
                  <div className="w-16 h-16 mb-3 flex items-center justify-center rounded-full bg-gray-50 overflow-hidden border border-gray-200">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="object-contain w-full"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1 text-center">
                    {pkg.name}
                  </h3>
                  <div className="text-xs text-gray-500 mb-2 text-center">
                    {pkg.description}
                  </div>
                  <div className="text-xs text-sixth font-semibold mb-2">
                    {pkg.duration}
                  </div>
                  <ul className="mb-4 space-y-1 w-full">
                    {pkg.features.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-center text-xs text-gray-700"
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
