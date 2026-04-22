import React, { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { courseSubjectsData } from "../../data/courseSubjectsData";

const StudentProfilePage = () => {
  const { loggedInUser } = useContext(AuthContext);
  const [studentInfo, setStudentInfo] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (loggedInUser && loggedInUser.role === "student") {
      const fetchStudentProfile = async () => {
        try {
          setLoading(true);
          const profileResponse = await api.get(
            `/students/profile?email=${loggedInUser.email}`
          );
          setStudentInfo(profileResponse.data);
          setEditData(profileResponse.data);

          const coursesResponse = await api.get(
            `/students/courses?email=${loggedInUser.email}`
          );
          setEnrolledCourses(coursesResponse.data);
        } catch (error) {
          console.error("Failed to load student profile:", error);
          setMessage("Failed to load profile");
        } finally {
          setLoading(false);
        }
      };

      fetchStudentProfile();
    }
  }, [loggedInUser]);

  const handleEditChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleSaveProfile = async () => {
    if (!editData.name || !editData.institute || !editData.levelOfStudy) {
      setMessage("⚠️ Please fill in all required fields");
      return;
    }

    setIsSaving(true);
    try {
      const response = await api.put(
        `/students/profile?email=${loggedInUser.email}`,
        editData
      );
      setStudentInfo(response.data);
      setIsEditing(false);
      setMessage("✅ Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);
      setMessage("❌ Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!studentInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-8">
        <p className="text-lg text-red-500">Could not load student profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg text-center font-medium ${
            message.includes("✅") ? "bg-green-100 text-green-800" : 
            message.includes("❌") ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-20">
              {/* Profile Header Gradient */}
              <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>

              {/* Profile Content */}
              <div className="px-6 pb-6">
                {/* Avatar */}
                <div className="flex justify-center -mt-16 mb-6">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg border-4 border-white">
                    {studentInfo.name?.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Basic Info */}
                {!isEditing ? (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">
                      {studentInfo.name}
                    </h2>
                    <p className="text-sm text-gray-600 text-center mb-6">
                      👨‍🎓 Student
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Email</p>
                        <p className="text-sm font-semibold text-gray-900 break-all">
                          {studentInfo.email}
                        </p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Institute</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {studentInfo.institute}
                        </p>
                      </div>
                      <div className="bg-indigo-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Grade/Level</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {studentInfo.levelOfStudy}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-200"
                    >
                      ✏️ Edit Profile
                    </button>
                  </>
                ) : (
                  <>
                    <div className="space-y-4 mb-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Name</label>
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => handleEditChange("name", e.target.value)}
                          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Institute</label>
                        <input
                          type="text"
                          value={editData.institute}
                          onChange={(e) => handleEditChange("institute", e.target.value)}
                          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Your institute"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Grade/Level</label>
                        <input
                          type="text"
                          value={editData.levelOfStudy}
                          onChange={(e) => handleEditChange("levelOfStudy", e.target.value)}
                          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Your grade/level"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditData(studentInfo);
                        }}
                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-2 px-4 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Enrolled Courses Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                📚 Enrolled Courses
              </h3>
              <p className="text-gray-600 mb-6">
                {enrolledCourses.length} {enrolledCourses.length === 1 ? "course" : "courses"}
              </p>

              {enrolledCourses.length > 0 ? (
                <div className="space-y-6">
                  {enrolledCourses.map((course) => {
                    const subjects = courseSubjectsData[course.title] || [];
                    return (
                      <div
                        key={course.courseId}
                        className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 transition-all duration-300 hover:shadow-lg"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-xl font-bold text-gray-900 mb-1">
                              {course.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Category: {course.category}
                            </p>
                          </div>
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                            ✓ Enrolled
                          </span>
                        </div>

                        {/* Subject List */}
                        {subjects.length > 0 && (
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-3">
                              📖 Subjects ({subjects.length}):
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {subjects.map((subject, idx) => (
                                <div
                                  key={idx}
                                  className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg px-4 py-2 flex items-start gap-2"
                                >
                                  <span className="text-blue-600 font-bold mt-1">→</span>
                                  <span className="text-gray-700 text-sm">{subject}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-xs text-gray-600">
                            💰 Price: <span className="font-bold text-gray-900">₹{course.price}</span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-lg mb-4">
                    You haven't enrolled in any courses yet.
                  </p>
                  <a
                    href="/#courses-section"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-200"
                  >
                    Explore Courses
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
