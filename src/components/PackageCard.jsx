import React from "react";

const PackageCard = ({ image, name, price, numberOfClasses, duration }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden w-80 flex-shrink-0 transition-all duration-200 hover:shadow-2xl border border-gray-100 flex flex-col cursor-pointer">
    <img
      src={image}
      alt={name}
      className="w-full h-44 object-cover object-center"
    />
    <div className="p-4 flex flex-col gap-2 flex-1 justify-between">
      <div className="flex justify-between items-center mb-1">
        <span className="uppercase text-xs font-bold tracking-widest text-primary bg-primary-50 px-2 py-0.5 rounded-full">
          {duration}
        </span>
        <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
          {numberOfClasses} Classes
        </span>
      </div>
      <h3 className="font-semibold text-lg mb-1 capitalize text-gray-800 line-clamp-1">
        {name}
      </h3>
      <div className="flex items-center text-xs text-gray-500 mb-1 gap-2">
        <span className="ml-auto font-semibold text-primary">AED{price}</span>
      </div>
    </div>
  </div>
);

export default PackageCard;
