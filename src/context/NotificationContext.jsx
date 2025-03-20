import React, { createContext, useState, useEffect } from "react";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return JSON.parse(localStorage.getItem("notificationsEnabled")) || false;
  });

  useEffect(() => {
    localStorage.setItem("notificationsEnabled", JSON.stringify(notificationsEnabled));
    if (notificationsEnabled) {
      requestNotificationPermission();
    }
  }, [notificationsEnabled]);

  const toggleNotifications = () => {
    setNotificationsEnabled((prev) => !prev);
  };

  const requestNotificationPermission = () => {
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        }
      });
    }
  };

  const scheduleNotification = (task) => {
    if (!notificationsEnabled || !task.notificationTime || !task.dueDate) return;

    const dueDate = new Date(task.dueDate);
    const notifyTime = dueDate.getTime() - task.notificationTime * 60 * 60 * 1000;
    const now = Date.now();

    if (notifyTime > now) {
      const timeUntilNotification = notifyTime - now;
      setTimeout(() => {
        if (Notification.permission === "granted" && notificationsEnabled) {
          new Notification(`Task Reminder: ${task.title}`, {
            body: `Due on ${dueDate.toLocaleString()}`,
          });
        }
      }, timeUntilNotification);
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notificationsEnabled, toggleNotifications, scheduleNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;