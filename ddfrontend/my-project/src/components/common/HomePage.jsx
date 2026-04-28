import React, { useEffect, useRef, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CourseCard from "./CourseCard";
import { AuthContext } from "../../context/AuthContext";

const HomePage = () => {
  const {
    courses,
    handleEnrollClick,
    enrolledCourses,
    loadingCourses,
    loggedInUser,
  } = useContext(AuthContext);

  const coursesSectionRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.scrollToCourses && coursesSectionRef.current) {
      coursesSectionRef.current.scrollIntoView({ behavior: "auto" });
      navigate(location.pathname, { replace: true, state: {} });
    } else if (
      location.hash === "#courses-section" &&
      coursesSectionRef.current
    ) {
      coursesSectionRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [location, coursesSectionRef, navigate]);

  const onEnrollButtonClick = (courseName) => {
    handleEnrollClick(courseName);
    if (!loggedInUser || loggedInUser.role !== "student") {
      navigate("/login/student", { state: { fromEnrollment: true } });
    } else {
      navigate("/student/enroll");
    }
  };

  // Calculate stats
  const stats = [
    { number: "10000+", label: "Active Students", icon: "👥" },
    { number: "500+", label: "Expert Teachers", icon: "👨‍🏫" },
    { number: Array.isArray(courses) ? courses.length : 0, label: "Courses", icon: "📚" },
  ];

  return (
    <main className="flex-grow bg-[var(--app-bg)] text-[var(--app-text)] overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
        {/* Animated background elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-4">
                <span className="inline-block bg-[var(--app-card-alt)] text-[var(--app-text)] px-4 py-2 rounded-full text-sm font-semibold border border-[var(--app-border)]">
                  #1 Doubt Solving Platform 🏆
                </span>
                <h1 className="text-5xl sm:text-6xl font-black text-[var(--app-text)] leading-tight">
                  From Confusion to
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Clarity</span>
                </h1>
              </div>
              
              <p className="text-xl text-[var(--app-muted)] leading-relaxed max-w-xl">
                Your personal doubt-solving companion. Get instant, clear answers from expert teachers available 24/7. No question is too small, no confusion too big.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => navigate("/login/student")}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  Get Started as Student
                </button>
                <button
                  onClick={() => navigate("/login/teacher")}
                  className="px-8 py-4 border-2 border-[var(--app-text)] text-[var(--app-text)] font-bold rounded-lg hover:bg-[var(--app-text)] hover:text-[var(--app-surface)] transition-all duration-300"
                >
                  Join as Teacher
                </button>
                <button
                  onClick={() => navigate("/courses")}
                  className="px-8 py-4 bg-[var(--app-card)] border-2 border-[var(--app-accent)] text-[var(--app-accent)] font-bold rounded-lg hover:bg-[var(--app-accent)] hover:text-white transition-all duration-300"
                >
                  Explore Courses
                </button>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[var(--app-border)]">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-[var(--app-text)]">{stat.number}</div>
                    <p className="text-sm text-[var(--app-muted)] mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image Section */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Floating Card 1 */}
                <div className="absolute -top-10 -right-10 bg-[var(--app-card)] rounded-2xl shadow-2xl p-6 w-64 animate-bounce border border-[var(--app-border)]" style={{ animationDelay: "0s" }}>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">24/7</span>
                    <div>
                      <p className="font-bold text-[var(--app-text)]">Expert Teachers</p>
                      <p className="text-sm text-[var(--app-muted)]">Clear Your Confusion</p>
                    </div>
                  </div>
                </div>

                {/* Floating Card 2 */}
                <div className="absolute bottom-20 -left-10 bg-[var(--app-card)] rounded-2xl shadow-2xl p-6 w-64 animate-bounce border border-[var(--app-border)]" style={{ animationDelay: "0.5s" }}>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">⚡</span>
                    <div>
                      <p className="font-bold text-[var(--app-text)]">Instant Answers</p>
                      <p className="text-sm text-[var(--app-muted)]">In minutes, not hours</p>
                    </div>
                  </div>
                </div>

                {/* Main Image */}
                <img
                  src="stress.png"
                  alt="Student learning"
                  className="w-full rounded-3xl shadow-2xl object-cover h-96 lg:h-auto"
                />

                {/* Floating Badge */}
                <div className="absolute top-1/2 right-0 transform translate-x-1/3 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full p-4 shadow-xl animate-pulse">
                  <p className="text-center font-bold text-sm whitespace-nowrap">No. 1 Platform</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--app-card)]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-[var(--app-text)] mb-16">Why Students Love DoubtDesk</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "🎯", title: "Smart Matching", desc: "Get paired with the right teacher for your specific question" },
              { icon: "⚡", title: "Lightning Fast", desc: "Most questions answered within minutes, not days" },
              { icon: "💯", title: "Expert Quality", desc: "Verified teachers with 5+ years of teaching experience" },
              { icon: "🛡️", title: "Safe Learning", desc: "Personal doubt space away from classroom embarrassment" },
              { icon: "📊", title: "Track Progress", desc: "See your improvement with detailed analytics" },
              { icon: "🌍", title: "24/7 Available", desc: "Help whenever you need it, day or night" },
            ].map((feature, index) => (
              <div key={index} className="p-8 rounded-2xl border-2 border-[var(--app-border)] hover:border-[var(--app-accent)] hover:shadow-lg transition-all duration-300 group bg-[var(--app-card)]">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-xl font-bold text-[var(--app-text)] mb-3">{feature.title}</h3>
                <p className="text-[var(--app-muted)]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--app-bg)]" ref={coursesSectionRef}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center text-[var(--app-text)] mb-4">Popular Courses</h2>
          <p className="text-center text-[var(--app-muted)] text-xl mb-16">Choose your path and start learning with expert guidance</p>
          
          {loadingCourses ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Clear Your Doubts?</h2>
          <p className="text-xl text-blue-100 mb-10">Join thousands of students who have transformed their learning journey</p>
          <button
            onClick={() => navigate("/login/student")}
            className="px-10 py-4 bg-white text-blue-600 font-bold rounded-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Start Your Free Trial
          </button>
        </div>
      </section>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
};

export default HomePage;
