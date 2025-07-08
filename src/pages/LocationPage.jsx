import React, { useState } from "react";
import {
  MapPin,
  Navigation,
  Clock,
  Phone,
  Star,
  Filter,
  Search,
} from "lucide-react";

const LocationPage = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const locations = [
    {
      id: 1,
      name: "Central Park Mobile Gym",
      type: "mobile",
      address: "Central Park, 5th Ave, New York, NY 10028",
      coordinates: { lat: 40.7829, lng: -73.9654 },
      status: "active",
      currentSessions: 3,
      nextAvailable: "2:00 PM",
      rating: 4.8,
      amenities: ["Cardio Equipment", "Strength Training", "Yoga Mats"],
      phone: "+1 (555) 123-4567",
      image:
        "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: 2,
      name: "Downtown Fitness Hub",
      type: "fixed",
      address: "123 Broadway, New York, NY 10001",
      coordinates: { lat: 40.7505, lng: -73.9934 },
      status: "active",
      currentSessions: 5,
      nextAvailable: "3:30 PM",
      rating: 4.9,
      amenities: ["Full Gym Equipment", "Locker Rooms", "Showers", "Parking"],
      phone: "+1 (555) 234-5678",
      image:
        "https://images.pexels.com/photos/1552108/pexels-photo-1552108.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: 3,
      name: "Riverside Park Mobile Unit",
      type: "mobile",
      address: "Riverside Park, Riverside Dr, New York, NY 10024",
      coordinates: { lat: 40.7956, lng: -73.9722 },
      status: "moving",
      currentSessions: 0,
      nextAvailable: "4:00 PM",
      rating: 4.7,
      amenities: ["Outdoor Equipment", "Yoga Space", "Functional Training"],
      phone: "+1 (555) 345-6789",
      image:
        "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: 4,
      name: "Brooklyn Bridge Mobile Gym",
      type: "mobile",
      address: "Brooklyn Bridge Park, Brooklyn, NY 11201",
      coordinates: { lat: 40.7023, lng: -73.9969 },
      status: "maintenance",
      currentSessions: 0,
      nextAvailable: "Tomorrow 8:00 AM",
      rating: 4.6,
      amenities: ["Scenic Views", "Cardio Equipment", "Group Classes"],
      phone: "+1 (555) 456-7890",
      image:
        "https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: 5,
      name: "Times Square Fitness Center",
      type: "fixed",
      address: "1500 Broadway, New York, NY 10036",
      coordinates: { lat: 40.758, lng: -73.9855 },
      status: "active",
      currentSessions: 8,
      nextAvailable: "1:00 PM",
      rating: 4.5,
      amenities: [
        "24/7 Access",
        "Premium Equipment",
        "Personal Training",
        "Spa",
      ],
      phone: "+1 (555) 567-8901",
      image:
        "https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
  ];

  const filteredLocations = locations.filter((location) => {
    const matchesType = filterType === "all" || location.type === filterType;
    const matchesSearch =
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "moving":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Active";
      case "moving":
        return "En Route";
      case "maintenance":
        return "Maintenance";
      default:
        return "Unknown";
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gym Locations
          </h1>
          <p className="text-gray-600">
            Find mobile gyms and fitness centers near you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Filters and Location List */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Locations</option>
                    <option value="mobile">Mobile Gyms</option>
                    <option value="fixed">Fixed Centers</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location List */}
            <div className="space-y-4">
              {filteredLocations.map((location) => (
                <div
                  key={location.id}
                  onClick={() => setSelectedLocation(location)}
                  className={`bg-white rounded-lg shadow-sm border-2 cursor-pointer transition-all hover:shadow-md ${
                    selectedLocation?.id === location.id
                      ? "border-primary-500"
                      : "border-gray-200"
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {location.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          location.status
                        )}`}
                      >
                        {getStatusText(location.status)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 flex items-start space-x-1">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{location.address}</span>
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            {location.nextAvailable}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-gray-600">
                            {location.rating}
                          </span>
                        </div>
                      </div>
                      <span className="text-primary-600 font-medium">
                        {location.currentSessions} active
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map Placeholder */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-96 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center relative">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Interactive Map
                  </h3>
                  <p className="text-gray-500">
                    Real-time location tracking would be displayed here
                  </p>
                </div>

                {/* Mock location pins */}
                <div className="absolute top-20 left-32 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                <div className="absolute top-40 right-40 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
                <div className="absolute bottom-32 left-20 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
              </div>
            </div>

            {/* Location Details */}
            {selectedLocation && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={selectedLocation.image}
                    alt={selectedLocation.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        selectedLocation.status
                      )}`}
                    >
                      {getStatusText(selectedLocation.status)}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        {selectedLocation.name}
                      </h2>
                      <p className="text-gray-600 flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{selectedLocation.address}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="text-lg font-semibold">
                          {selectedLocation.rating}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">Rating</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <Clock className="h-5 w-5 text-primary-600" />
                        <span className="font-medium text-gray-900">
                          Next Available
                        </span>
                      </div>
                      <p className="text-gray-600">
                        {selectedLocation.nextAvailable}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <Phone className="h-5 w-5 text-primary-600" />
                        <span className="font-medium text-gray-900">
                          Contact
                        </span>
                      </div>
                      <p className="text-gray-600">{selectedLocation.phone}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Amenities
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedLocation.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                      <Navigation className="h-5 w-5" />
                      <span>Get Directions</span>
                    </button>
                    <button className="flex-1 bg-secondary-600 hover:bg-secondary-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                      Book Session Here
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!selectedLocation && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Select a location
                </h3>
                <p className="text-gray-500">
                  Choose a gym location from the list to view details and get
                  directions
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* New Section: Our Happy Customers Image */}
      <div className="max-w-4xl mx-auto my-12 p-6 bg-white rounded-lg shadow flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Our Happy Customers
        </h2>
        <img
          src="/BookingImage.jpg"
          alt="Happy Customers"
          className="rounded-lg shadow-lg w-full max-w-3xl object-contain"
        />
      </div>
    </>
  );
};

export default LocationPage;
