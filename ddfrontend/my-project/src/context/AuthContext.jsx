import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [courseToEnroll, setCourseToEnroll] = useState(null);
  const [selectedCourseForSubjects, setSelectedCourseForSubjects] =
    useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [highlightQuestionId, setHighlightQuestionId] = useState(null);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("dd_theme") || "light"
  );
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState(new Set());

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        const response = await api.get("/courses");
        setCourses(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setCourses([]);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("dd_theme", theme);
  }, [theme]);

  useEffect(() => {
    let interval;

    const fetchNotifications = async () => {
      if (!loggedInUser?.email) return;
      try {
        const response = await api.get(
          `/notifications?email=${loggedInUser.email}`
        );
        setNotifications(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    if (loggedInUser?.email) {
      fetchNotifications();
      interval = setInterval(fetchNotifications, 10000);
    } else {
      setNotifications([]);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loggedInUser]);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (loggedInUser && loggedInUser.role === "student") {
        try {
          const response = await api.get(
            `/students/courses?email=${loggedInUser.email}`
          );
          setEnrolledCourses(
            new Set(response.data.map((course) => course.title))
          );
        } catch (error) {
          console.error("Failed to fetch enrolled courses:", error);
        }
      } else {
        setEnrolledCourses(new Set());
      }
    };
    fetchEnrolledCourses();
  }, [loggedInUser]);

  const addNotification = async (
    recipientEmail,
    questionId,
    message,
    type = "solution"
  ) => {
    try {
      await api.post("/notifications", {
        recipientEmail,
        questionId,
        message,
        type,
      });
      if (loggedInUser?.email === recipientEmail) {
        const response = await api.get(
          `/notifications?email=${recipientEmail}`
        );
        setNotifications(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Failed to add notification:", error);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.filter((notif) => notif.notificationId !== notificationId)
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const clearNotifications = async () => {
    if (!loggedInUser?.email) {
      setNotifications([]);
      return;
    }

    try {
      await api.delete(`/notifications?email=${loggedInUser.email}`);
      setNotifications([]);
    } catch (error) {
      console.error("Failed to clear notifications:", error);
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleEnrollClick = (courseName) => {
    setCourseToEnroll(courseName);
  };

  const handleEnrollSuccess = (newlyEnrolledCourse) => {
    setEnrolledCourses(
      (prevEnrolledCourses) =>
        new Set([...prevEnrolledCourses, newlyEnrolledCourse])
    );
  };

  const value = {
    courseToEnroll,
    setCourseToEnroll,
    selectedCourseForSubjects,
    setSelectedCourseForSubjects,
    loggedInUser,
    setLoggedInUser,
    notifications,
    setNotifications,
    highlightQuestionId,
    setHighlightQuestionId,
    theme,
    toggleTheme,
    courses,
    loadingCourses,
    enrolledCourses,
    addNotification,
    markNotificationAsRead,
    clearNotifications,
    handleEnrollClick,
    handleEnrollSuccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
