import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { NotificationApi } from "../Api/Notification.api";
import toast from "react-hot-toast";
import { useLoading } from "../loader/LoaderContext";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notificationData, setNotificationData] = useState([]);
  const { showLoading, hideLoading } = useLoading();

  const getAllNotification = useCallback(async () => {
    try {
      showLoading();
      const res = await NotificationApi.getAllNotification();
      setNotificationData(res?.data?.data || []);
    } catch (error) {
      toast.error("Error fetching notifications");
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  const updateNotification = useCallback(
    async (id) => {
      try {
        showLoading();
        await NotificationApi.updateNotification(id, { isRead: true });
        setNotificationData((prev) =>
          prev.map((n) =>
            n._id === id ? { ...n, isRead: true } : n
          )
        );
      } catch (error) {
        toast.error("Failed to mark notification as read.");
      } finally {
        hideLoading();
      }
    },
    [showLoading, hideLoading]
  );

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      showLoading();
      await NotificationApi.updateAllNotification();
      setNotificationData((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    } catch (error) {
      toast.error("Failed to mark all as read.");
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  const value = useMemo(
    () => ({
      notificationData,
      setNotificationData,
      getAllNotification,
      updateNotification,
      handleMarkAllAsRead,
    }),
    [
      notificationData,
      getAllNotification,
      updateNotification,
      handleMarkAllAsRead,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === null) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
