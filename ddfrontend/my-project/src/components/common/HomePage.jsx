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
    <main className="flex-grow bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
        {/* Animated background elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-4">
                <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                  #1 Doubt Solving Platform 🏆
                </span>
                <h1 className="text-5xl sm:text-6xl font-black text-gray-900 leading-tight">
                  From Confusion to
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Clarity</span>
                </h1>
              </div>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
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
                  className="px-8 py-4 border-2 border-gray-900 text-gray-900 font-bold rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-300"
                >
                  Join as Teacher
                </button>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
                    <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image Section */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Floating Card 1 */}
                <div className="absolute -top-10 -right-10 bg-white rounded-2xl shadow-2xl p-6 w-64 animate-bounce" style={{ animationDelay: "0s" }}>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">24/7</span>
                    <div>
                      <p className="font-bold text-gray-900">Expert Teachers</p>
                      <p className="text-sm text-gray-600">Clear Your Confusion</p>
                    </div>
                  </div>
                </div>

                {/* Floating Card 2 */}
                <div className="absolute bottom-20 -left-10 bg-white rounded-2xl shadow-2xl p-6 w-64 animate-bounce" style={{ animationDelay: "0.5s" }}>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">⚡</span>
                    <div>
                      <p className="font-bold text-gray-900">Instant Answers</p>
                      <p className="text-sm text-gray-600">In minutes, not hours</p>
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Why Students Love DoubtDesk</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "🎯", title: "Smart Matching", desc: "Get paired with the right teacher for your specific question" },
              { icon: "⚡", title: "Lightning Fast", desc: "Most questions answered within minutes, not days" },
              { icon: "💯", title: "Expert Quality", desc: "Verified teachers with 5+ years of teaching experience" },
              { icon: "🛡️", title: "Safe Learning", desc: "Personal doubt space away from classroom embarrassment" },
              { icon: "📊", title: "Track Progress", desc: "See your improvement with detailed analytics" },
              { icon: "🌍", title: "24/7 Available", desc: "Help whenever you need it, day or night" },
            ].map((feature, index) => (
              <div key={index} className="p-8 rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:shadow-lg transition-all duration-300 group">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white" ref={coursesSectionRef}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center text-gray-900 mb-4">Popular Courses</h2>
          <p className="text-center text-gray-600 text-xl mb-16">Choose your path and start learning with expert guidance</p>
          
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
