import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import CourseCard from "./CourseCard";

const CoursesPage = () => {
  const {
    courses,
    handleEnrollClick,
    enrolledCourses,
    loadingCourses,
    loggedInUser,
  } = useContext(AuthContext);
  const navigate = useNavigate();

  const onEnrollButtonClick = (courseName) => {
    handleEnrollClick(courseName);
    if (!loggedInUser || loggedInUser.role !== "student") {
      navigate("/login/student", { state: { fromEnrollment: true } });
    } else {
      navigate("/student/enroll");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
          <div>
            <p className="text-sm uppercase tracking-widest text-[var(--app-muted)]">Courses</p>
            <h1 className="text-4xl md:text-5xl font-black">Pick your next course</h1>
            <p className="text-[var(--app-muted)] mt-3 max-w-2xl">
              Learn with expert guidance, get unlimited doubt support, and keep every subject on track.
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="bg-[var(--app-accent)] hover:bg-[var(--app-accent-strong)] text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
          >
            Back to Home
          </button>
        </div>

        {loadingCourses ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--app-accent)]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.isArray(courses) && courses.map((course) => (
              <CourseCard
                key={course.courseId}
                topTitle={course.category}
                programTitle={course.title}
                courseName={course.title}
                features={[
                  "✅ All subjects covered",
                  "✅ Ask unlimited questions",
                  "✅ 24/7 doubt posting",
                  "✅ Expert teacher support",
                ]}
                priceText={`₹${course.price}`}
                enrollButtonText="Enroll Now"
                onEnrollClick={onEnrollButtonClick}
                isEnrolled={enrolledCourses.has(course.title)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
