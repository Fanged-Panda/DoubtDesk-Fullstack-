import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext"; // AuthContext ইম্পোর্ট করুন

const StudentDashboard = () => {
  const { loggedInUser, setSelectedCourseForSubjects } =
    useContext(AuthContext); // useContext ব্যবহার করে state and setter function নিন
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser || !loggedInUser.email) {
      setLoading(false);
      return;
    }

    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/students/courses?email=${loggedInUser.email}`
        );
        setCourses(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load enrolled courses. Please try again later.");
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [loggedInUser]);

  const handleGoToCourse = (courseName) => {
    setSelectedCourseForSubjects(courseName);
    navigate(`/student/course-details`);
  };

  const handleBuyCourses = () => {
    navigate("/", { state: { scrollToCourses: true } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] flex items-center justify-center">
        <p className="text-lg text-[var(--app-muted)]">Loading your courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] flex items-center justify-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] flex flex-col items-center justify-center p-8">
      <div className="bg-[var(--app-card)] rounded-2xl shadow-xl p-8 max-w-5xl w-full border border-[var(--app-border)]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <p className="text-sm uppercase tracking-widest text-[var(--app-muted)]">
              Student Page
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--app-text)]">
              Your learning command center
            </h2>
            <p className="text-[var(--app-muted)] mt-2">
              Manage courses, jump into subjects, and keep progress moving.
            </p>
          </div>
          <button
            onClick={handleBuyCourses}
            className="bg-[var(--app-accent)] hover:bg-[var(--app-accent-strong)] text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
          >
            Browse Courses
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[var(--app-card-alt)] p-6 rounded-2xl shadow-sm border border-[var(--app-border)]">
            <h3 className="text-xl font-semibold text-[var(--app-text)] mb-3">
              Enrolled Courses
            </h3>
            {courses.length === 0 ? (
              <>
                <p className="text-[var(--app-muted)]">
                  You haven't enrolled in any courses yet.
                </p>
                <button
                  onClick={handleBuyCourses}
                  className="mt-4 bg-[var(--app-accent)] hover:bg-[var(--app-accent-strong)] text-white px-5 py-2 rounded-lg font-medium"
                >
                  Buy Courses
                </button>
              </>
            ) : (
              <div className="space-y-3">
                {courses.map((course) => (
                  <div
                    key={course.courseId}
                    className="flex items-center justify-between bg-[var(--app-card)] p-3 rounded-xl shadow-sm border border-[var(--app-border)]"
                  >
                    <span className="text-[var(--app-text)] font-medium">
                      {course.title}
                    </span>
                    <button
                      onClick={() => handleGoToCourse(course.title)}
                      className="bg-[var(--app-accent)] hover:bg-[var(--app-accent-strong)] text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      Go to Course
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleBuyCourses}
                  className="mt-4 bg-[var(--app-accent)] hover:bg-[var(--app-accent-strong)] text-white px-5 py-2 rounded-lg font-medium"
                >
                  Buy More Courses
                </button>
              </div>
            )}
          </div>

          <div className="bg-[var(--app-card-alt)] p-6 rounded-2xl shadow-sm border border-[var(--app-border)]">
            <h3 className="text-xl font-semibold text-[var(--app-text)] mb-3">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/student/ask-doubt")}
                className="w-full bg-[var(--app-card)] border border-[var(--app-border)] hover:border-[var(--app-accent)] text-[var(--app-text)] px-4 py-3 rounded-xl font-medium"
              >
                Ask a Doubt
              </button>
              <button
                onClick={() => navigate("/student/question-history")}
                className="w-full bg-[var(--app-card)] border border-[var(--app-border)] hover:border-[var(--app-accent)] text-[var(--app-text)] px-4 py-3 rounded-xl font-medium"
              >
                Question History
              </button>
              <button
                onClick={() => navigate("/student/profile")}
                className="w-full bg-[var(--app-card)] border border-[var(--app-border)] hover:border-[var(--app-accent)] text-[var(--app-text)] px-4 py-3 rounded-xl font-medium"
              >
                Profile Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
