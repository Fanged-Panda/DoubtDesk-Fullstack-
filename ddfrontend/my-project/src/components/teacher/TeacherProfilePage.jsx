import React, { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

const TeacherProfilePage = () => {
  const { loggedInUser } = useContext(AuthContext);
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (loggedInUser && loggedInUser.role === "teacher") {
      const fetchTeacherProfile = async () => {
        try {
          setLoading(true);
          const response = await api.get(
            `/teachers/profile?email=${loggedInUser.email}`
          );
          setTeacherInfo(response.data);
          setEditData(response.data);
        } catch (error) {
          console.error("Failed to load teacher profile:", error);
          setMessage("Failed to load profile");
        } finally {
          setLoading(false);
        }
      };

      fetchTeacherProfile();
    }
  }, [loggedInUser]);

  const handleEditChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleSaveProfile = async () => {
    if (!editData.name || !editData.institute || !editData.qualification) {
      setMessage("⚠️ Please fill in all required fields");
      return;
    }

    setIsSaving(true);
    try {
      const response = await api.put(
        `/teachers/profile?email=${loggedInUser.email}`,
        editData
      );
      setTeacherInfo(response.data);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!teacherInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-8">
        <p className="text-lg text-red-500">Could not load teacher profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
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
              <div className="h-32 bg-gradient-to-r from-green-600 to-emerald-600"></div>

              {/* Profile Content */}
              <div className="px-6 pb-6">
                {/* Avatar */}
                <div className="flex justify-center -mt-16 mb-6">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg border-4 border-white">
                    {teacherInfo.name?.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Basic Info */}
                {!isEditing ? (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">
                      {teacherInfo.name}
                    </h2>
                    <p className="text-sm text-gray-600 text-center mb-6">
                      👨‍🏫 Teacher
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Email</p>
                        <p className="text-sm font-semibold text-gray-900 break-all">
                          {teacherInfo.email}
                        </p>
                      </div>
                      <div className="bg-emerald-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Institute</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {teacherInfo.institute}
                        </p>
                      </div>
                      <div className="bg-teal-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Qualification</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {teacherInfo.qualification}
                        </p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg border-2 border-blue-200">
                        <p className="text-xs text-gray-600">Questions Solved</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {teacherInfo.solvedCount || 0}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-200"
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
                          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Institute</label>
                        <input
                          type="text"
                          value={editData.institute}
                          onChange={(e) => handleEditChange("institute", e.target.value)}
                          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Your institute"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Qualification</label>
                        <input
                          type="text"
                          value={editData.qualification}
                          onChange={(e) => handleEditChange("qualification", e.target.value)}
                          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Your qualification"
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
                          setEditData(teacherInfo);
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

          {/* Stats Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Stats */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                📊 Performance Stats
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Questions Solved</p>
                  <p className="text-4xl font-black text-blue-600">
                    {teacherInfo.solvedCount || 0}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">✅ Verified answers</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
                  <p className="text-sm text-gray-600 mb-1">Success Rate</p>
                  <p className="text-4xl font-black text-green-600">
                    {teacherInfo.successRate || "5"}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">⭐ Stars rating</p>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                👨‍🎓 About
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Welcome! I'm {teacherInfo.name}, a dedicated educator at{" "}
                <strong>{teacherInfo.institute}</strong> with expertise in{" "}
                <strong>{teacherInfo.qualification}</strong>. I have helped{" "}
                <strong>{teacherInfo.solvedCount || 0} students</strong> solve their
                doubts and achieve academic excellence.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                  <p className="text-sm font-semibold text-gray-700">Expertise</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Multiple subjects across various levels
                  </p>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
                  <p className="text-sm font-semibold text-gray-700">Availability</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Available 24/7 for doubt solving
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfilePage;
