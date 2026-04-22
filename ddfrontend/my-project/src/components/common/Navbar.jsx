import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // AuthContext ইম্পোর্ট করুন

const Navbar = () => {
  const {
    loggedInUser,
    setLoggedInUser,
    notifications,
    markNotificationAsRead,
    clearNotifications,
    setHighlightQuestionId,
  } = useContext(AuthContext); // useContext ব্যবহার করে state গুলো নিন
  const [isOpen, setIsOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const joinRef = useRef(null);
  const notificationsRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const unreadNotificationsCount = notifications.filter(
    (notif) => !notif.read && notif.recipientEmail === loggedInUser?.email
  ).length;

  const scrollToCourses = (e) => {
    e.preventDefault();
    setIsOpen(false);
    setIsJoinOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document
          .getElementById("courses-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document
        .getElementById("courses-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNotificationItemClick = (notification) => {
    markNotificationAsRead(notification.id);
    setHighlightQuestionId(notification.questionId);

    if (loggedInUser.role === "student") {
      navigate("/student/question-history");
    } else if (loggedInUser.role === "teacher") {
      navigate("/teacher/dashboard");
    }
    setIsNotificationsOpen(false);
    setIsOpen(false);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    clearNotifications();
    navigate("/");
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (joinRef.current && !joinRef.current.contains(event.target)) {
        setIsJoinOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [joinRef, notificationsRef]);

  const getDashboardPage = () => {
    if (!loggedInUser) return "/";
    switch (loggedInUser.role) {
      case "student":
        return "/student/dashboard";
      case "teacher":
        return "/teacher/dashboard";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/";
    }
  };

  const getProfilePage = () => {
    if (!loggedInUser) return "/";
    switch (loggedInUser.role) {
      case "student":
        return "/student/profile";
      case "teacher":
        return "/teacher/profile";
      case "admin":
        return "/admin/profile";
      default:
        return "/";
    }
  };

  const isTeacherDashboard = loggedInUser && loggedInUser.role === "teacher";
  const isStudentDashboard = loggedInUser && loggedInUser.role === "student";

  const getLinkClassName = (path) => {
    return `text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-blue-50 ${
      location.pathname === path ? "bg-blue-50 text-blue-600" : ""
    }`;
  };

  const getMobileLinkClassName = (path) => {
    return `text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-lg text-base font-medium hover:bg-blue-50 ${
      location.pathname === path ? "bg-blue-50 text-blue-600" : ""
    }`;
  };

  return (
    <nav className="bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link
            to={loggedInUser ? getDashboardPage() : "/"}
            className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity duration-200"
          >
            <img
              src="/logo.png"
              alt="DoubtDesk Logo"
              className="h-12 w-12"
            />
            <span>DoubtDesk</span>
          </Link>
        </div>

        {/* --- Desktop View --- */}
        <div className="hidden md:flex items-center space-x-8">
          {loggedInUser ? (
            <>
              <Link
                to={getDashboardPage()}
                className={getLinkClassName(getDashboardPage())}
              >
                📊 Dashboard
              </Link>
              {isTeacherDashboard && (
                <Link
                  to="/teacher/solved"
                  className={getLinkClassName("/teacher/solved")}
                >
                  ✅ Solved
                </Link>
              )}
              
              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  🔔
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-xl shadow-xl bg-white ring-1 ring-black ring-opacity-10 z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="font-bold text-gray-900">Notifications</h3>
                      {notifications.length > 0 && (
                        <button
                          onClick={clearNotifications}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    <div className="py-2">
                      {notifications.length === 0 ? (
                        <p className="px-4 py-6 text-center text-gray-500">No notifications</p>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => handleNotificationItemClick(notification)}
                            className={`px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors duration-200 ${
                              !notification.read ? "bg-blue-50" : ""
                            }`}
                          >
                            <p className="text-sm text-gray-900">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <Link
                to={getProfilePage()}
                className={getLinkClassName(getProfilePage())}
              >
                👤 Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/#courses-section"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-gray-100"
              >
                📚 Courses
              </Link>
              <div className="relative" ref={joinRef}>
                <button
                  onClick={() => setIsJoinOpen(!isJoinOpen)}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-gray-100 focus:outline-none"
                >
                  Join as ▼
                </button>
                {isJoinOpen && (
                  <div className="absolute left-0 mt-2 w-56 rounded-xl shadow-xl bg-white ring-1 ring-black ring-opacity-10 z-10 overflow-hidden">
                    <div className="py-2">
                      <Link
                        to="/login/teacher"
                        onClick={() => setIsJoinOpen(false)}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors duration-200"
                      >
                        👨‍🏫 Join as Teacher
                      </Link>
                      <Link
                        to="/login/student"
                        onClick={() => setIsJoinOpen(false)}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors duration-200"
                      >
                        👨‍🎓 Join as Student
                      </Link>
                      <Link
                        to="/login/admin"
                        onClick={() => setIsJoinOpen(false)}
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors duration-200"
                      >
                        ⚙️ Join as Admin
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-4">
          {loggedInUser && unreadNotificationsCount > 0 && (
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                🔔
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
                  {unreadNotificationsCount}
                </span>
              </button>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none transition-colors duration-200"
          >
            {!isOpen ? (
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Notifications Mobile */}
      {isNotificationsOpen && loggedInUser && (
        <div className="md:hidden mt-4 p-4 bg-gray-50 rounded-lg max-h-64 overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-900">Notifications</h3>
            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear
              </button>
            )}
          </div>
          <div className="space-y-2">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500 text-sm py-4">No notifications</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationItemClick(notification)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                    !notification.read ? "bg-blue-100" : "bg-white"
                  }`}
                >
                  <p className="text-sm text-gray-900">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* --- Mobile View --- */}
      {isOpen && (
        <div className="md:hidden mt-4 pb-4 space-y-2">
          {loggedInUser ? (
            <>
              <Link
                to={getDashboardPage()}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                📊 Dashboard
              </Link>
              {isTeacherDashboard && (
                <Link
                  to="/teacher/solved"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  ✅ Solved Questions
                </Link>
              )}
              <Link
                to={getProfilePage()}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                👤 Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/#courses-section"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                📚 Courses
              </Link>
              <Link
                to="/login/teacher"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                👨‍🏫 Teacher Login
              </Link>
              <Link
                to="/login/student"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                👨‍🎓 Student Login
              </Link>
              <Link
                to="/login/admin"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                ⚙️ Admin Login
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
