import React, { useState } from "react";
import { GoBell } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const NotificationProvider = () => {
  const navigate = useNavigate();

  // Dummy notifications data
  const [notificationData, setNotificationData] = useState([
    {
      _id: "1",
      title: "Project Update",
      message: "The project deadline has been extended",
      senderId: { firstName: "John", lastName: "Doe" },
      projectId: { name: "Website Redesign", priority: "high" },
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    },
    {
      _id: "2",
      title: "New Message",
      message: "You have a new message from the team",
      senderId: { firstName: "Sarah", lastName: "Smith" },
      projectId: { name: "Mobile App", priority: "medium" },
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 3600 * 3).toISOString(), // 3 hours ago
    },
    {
      _id: "3",
      title: "Task Completed",
      message: "Your task has been marked as completed",
      senderId: { firstName: "Mike", lastName: "Johnson" },
      projectId: { name: "Dashboard UI", priority: "low" },
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 3600 * 24).toISOString(), // 1 day ago
    },
  ]);

  // Dummy functions
  const handleMarkAllAsRead = () => {
    alert("Mark all as read functionality would go here");
  };

  const updateNotification = (id) => {
    alert(`Mark notification ${id} as read functionality would go here`);
  };

  const groupNotificationsByDay = (notifications) => {
    const groups = {};

    notifications.forEach((n) => {
      const date = moment(n.createdAt).format("YYYY-MM-DD");
      groups[date] = groups[date] || [];
      groups[date].push(n);
    });

    return Object.entries(groups).map(([date, notifs]) => ({
      dateLabel: moment(date).calendar(null, {
        sameDay: "[Today]",
        lastDay: "[Yesterday]",
        lastWeek: "dddd",
        sameElse: "DD MMM YYYY",
      }),
      notifications: notifs,
    }));
  };

  const unreadCount = notificationData.filter((n) => !n.isRead).length;

  return (
    <div className="relative group">
      {/* Bell Icon */}
      <div className="text-xl cursor-pointer hover:text-yellow-400 transition-all relative">
        <GoBell />
        <span
          className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center ${
            unreadCount === 0 ? "opacity-0" : ""
          }`}
        >
          {unreadCount}
        </span>
      </div>

      {/* Dropdown */}
      <div
        className={`
          absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl z-50 border 
          opacity-0 invisible group-hover:opacity-100 group-hover:visible
          transition-all duration-200 ease-out transform group-hover:translate-y-0 translate-y-1
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-slate-300 text-sm font-semibold text-third">
          <span>Notifications</span>
          <div className="space-x-2 text-xs text-blue-400">
            <button
              onClick={handleMarkAllAsRead}
              className="hover:underline cursor-pointer"
              disabled={notificationData.length === 0}
            >
              Mark all as read
            </button>
            <button
              onClick={() => navigate("/notifications")}
              className="hover:underline cursor-pointer "
            >
              View all
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="max-h-96 overflow-y-auto text-sm text-black">
          {notificationData.length > 0 ? (
            groupNotificationsByDay(notificationData)?.map((group, i) => (
              <div key={i}>
                <div className="sticky top-0 px-4 py-1 bg-gray-100  text-xs font-medium text-gray-500 z-10">
                  {group.dateLabel}
                </div>
                {group.notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`p-3  border-b border-gray-200 transition-colors duration-150 ${
                      !n.isRead
                        ? "bg-blue-50 cursor-pointer"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => !n?.isRead && updateNotification(n?._id)}
                  >
                    <div className="flex space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center bg-gray-200 text-gray-700">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        {!n.isRead && (
                          <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-medium text-gray-900">
                            {n.senderId?.firstName} {n.senderId?.lastName}
                          </p>
                          <span className="text-xs text-gray-500">
                            {moment(n.createdAt).format("h:mm A")}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mt-1">
                          {n.title}{" "}
                          {n.projectId?.name && (
                            <span className="font-semibold text-blue-600">
                              @ {n.projectId.name}
                            </span>
                          )}
                        </p>

                        {n.message && (
                          <div className="mt-2 p-2 bg-white/50 rounded text-sm text-gray-700 border border-gray-200">
                            {n.message}
                          </div>
                        )}

                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {moment(n.createdAt).fromNow()}
                          </span>
                          {n.projectId?.priority && (
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                n.projectId.priority === "high"
                                  ? "bg-red-100 text-red-800"
                                  : n.projectId.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {n.projectId.priority}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 mb-3 text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <h3 className="text-base font-medium text-gray-700">
                No notifications
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                You're all caught up! Check back later for updates.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationProvider;
