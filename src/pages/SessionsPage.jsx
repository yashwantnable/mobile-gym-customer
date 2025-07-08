import React, { useState } from "react";
import {
  Clock,
  Users,
  Star,
  MapPin,
  Filter,
  Search,
  Calendar,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

const SessionsPage = () => {
  const { _id } = useParams();
  console.log("category id:", _id);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDate, setSelectedDate] = useState("today");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: "all", name: "All Sessions", count: 24 },
    { id: "strength", name: "Strength Training", count: 8 },
    { id: "cardio", name: "Cardio", count: 6 },
    { id: "yoga", name: "Yoga & Flexibility", count: 5 },
    { id: "functional", name: "Functional Training", count: 5 },
  ];

  const sessions = [
    {
      id: 1,
      title: "Morning HIIT Blast",
      category: "cardio",
      subcategory: "HIIT",
      trainer: "Sarah Johnson",
      time: "7:00 AM",
      duration: "45 min",
      spots: 8,
      maxSpots: 12,
      rating: 4.9,
      price: 25,
      location: "Central Park",
      image:
        "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=400",
      difficulty: "High",
      equipment: "Minimal",
    },
    {
      id: 2,
      title: "Strength & Power",
      category: "strength",
      subcategory: "Weightlifting",
      trainer: "Mike Chen",
      time: "6:00 PM",
      duration: "60 min",
      spots: 6,
      maxSpots: 8,
      rating: 4.8,
      price: 35,
      location: "Downtown Gym",
      image:
        "https://images.pexels.com/photos/1552108/pexels-photo-1552108.jpeg?auto=compress&cs=tinysrgb&w=400",
      difficulty: "Medium",
      equipment: "Full Equipment",
    },
    {
      id: 3,
      title: "Sunset Yoga Flow",
      category: "yoga",
      subcategory: "Vinyasa",
      trainer: "Emma Davis",
      time: "7:30 PM",
      duration: "50 min",
      spots: 12,
      maxSpots: 15,
      rating: 5.0,
      price: 20,
      location: "Riverside Park",
      image:
        "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400",
      difficulty: "Low",
      equipment: "Mat Only",
    },
    {
      id: 4,
      title: "Functional CrossTraining",
      category: "functional",
      subcategory: "CrossTraining",
      trainer: "Alex Rodriguez",
      time: "8:00 AM",
      duration: "55 min",
      spots: 4,
      maxSpots: 10,
      rating: 4.7,
      price: 30,
      location: "Sports Complex",
      image:
        "https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=400",
      difficulty: "High",
      equipment: "Varied Equipment",
    },
    {
      id: 5,
      title: "Beginner Bodyweight",
      category: "strength",
      subcategory: "Bodyweight",
      trainer: "Lisa Park",
      time: "9:00 AM",
      duration: "40 min",
      spots: 15,
      maxSpots: 20,
      rating: 4.6,
      price: 18,
      location: "Community Center",
      image:
        "https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=400",
      difficulty: "Low",
      equipment: "No Equipment",
    },
    {
      id: 6,
      title: "Cardio Dance Party",
      category: "cardio",
      subcategory: "Dance",
      trainer: "Maria Santos",
      time: "6:30 PM",
      duration: "45 min",
      spots: 18,
      maxSpots: 25,
      rating: 4.9,
      price: 22,
      location: "Studio Downtown",
      image:
        "https://images.pexels.com/photos/3757376/pexels-photo-3757376.jpeg?auto=compress&cs=tinysrgb&w=400",
      difficulty: "Medium",
      equipment: "No Equipment",
    },
  ];

  const filteredSessions = sessions.filter((session) => {
    const matchesCategory =
      selectedCategory === "all" || session.category === selectedCategory;
    const matchesSearch =
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.trainer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.subcategory.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Low":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "High":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAvailabilityColor = (spots, maxSpots) => {
    const percentage = (spots / maxSpots) * 100;
    if (percentage <= 25) return "text-red-600";
    if (percentage <= 50) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 ">
            Subscriptions
          </h1>
          <p className="text-gray-600">
            Find and book your perfect workout session
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search sessions, trainers, or activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Date Filter */}
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Category Filter */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {/* Image */}
              <div className="relative h-48">
                <img
                  src={session.image}
                  alt={session.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                      session.difficulty
                    )}`}
                  >
                    {session.difficulty}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 text-sm font-semibold text-primary-600">
                  ${session.price}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {session.title}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">
                      {session.rating}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-1">with {session.trainer}</p>
                <p className="text-sm text-gray-500 mb-4">
                  {session.subcategory} • {session.equipment}
                </p>

                {/* Session Details */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{session.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{session.location}</span>
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span
                      className={`text-sm font-medium ${getAvailabilityColor(
                        session.spots,
                        session.maxSpots
                      )}`}
                    >
                      {session.spots} spots left
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {session.duration}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        ((session.maxSpots - session.spots) /
                          session.maxSpots) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>

                {/* Book Button */}
                <div className="flex justify-center">
                  <Link
                    to={`/sessions/${session.id}`}
                    className="text-center w-full bg-custom-dark hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                    disabled={session.spots === 0}
                  >
                    {session.spots === 0 ? "Fully Booked" : "Book Session"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <Calendar className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No sessions found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 ">
            Browse Sessions
          </h1>
          <p className="text-gray-600">
            Find and book your perfect workout session
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search sessions, trainers, or activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Date Filter */}
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Category Filter */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {/* Image */}
              <div className="relative h-48">
                <img
                  src={session.image}
                  alt={session.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                      session.difficulty
                    )}`}
                  >
                    {session.difficulty}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 text-sm font-semibold text-primary-600">
                  ${session.price}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {session.title}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">
                      {session.rating}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-1">with {session.trainer}</p>
                <p className="text-sm text-gray-500 mb-4">
                  {session.subcategory} • {session.equipment}
                </p>

                {/* Session Details */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{session.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{session.location}</span>
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span
                      className={`text-sm font-medium ${getAvailabilityColor(
                        session.spots,
                        session.maxSpots
                      )}`}
                    >
                      {session.spots} spots left
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {session.duration}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        ((session.maxSpots - session.spots) /
                          session.maxSpots) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>

                {/* Book Button */}
                <div className="flex justify-center">
                  <Link
                    to={`/sessions/${session.id}`}
                    className="text-center w-full bg-custom-dark hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                    disabled={session.spots === 0}
                  >
                    {session.spots === 0 ? "Fully Booked" : "Book Session"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <Calendar className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No sessions found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default SessionsPage;
