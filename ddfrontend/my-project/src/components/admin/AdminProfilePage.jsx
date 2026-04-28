import React, { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

const AdminProfilePage = () => {
  const { loggedInUser } = useContext(AuthContext);
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalQuestions: 0,
  });

  useEffect(() => {
    if (loggedInUser && loggedInUser.role === "admin") {
      const fetchAdminProfile = async () => {
        try {
          setLoading(true);
          const response = await api.get(
            `/admin/profile?email=${loggedInUser.email}`
          );
          setAdminInfo(response.data);
          setEditData(response.data);

          // Fetch stats if available
          try {
            const statsResponse = await api.get("/admin/stats");
            setStats(statsResponse.data);
          } catch (err) {
            console.log("Could not fetch stats");
          }
        } catch (error) {
          console.error("Failed to load admin profile:", error);
          setMessage("Failed to load profile");
        } finally {
          setLoading(false);
        }
      };

      fetchAdminProfile();
    }
  }, [loggedInUser]);

  const handleEditChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleSaveProfile = async () => {
    if (!editData.name) {
      setMessage("⚠️ Please enter your name");
      return;
    }

    setIsSaving(true);
    try {
      const response = await api.put(
        `/admin/profile?email=${loggedInUser.email}`,
        editData
      );
      setAdminInfo(response.data);
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
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!adminInfo) {
    return (
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] flex items-center justify-center p-8">
        <p className="text-lg text-red-500">Could not load admin profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Message Alert */}
        {message && (
            <div className={`mb-6 p-4 rounded-lg text-center font-medium ${
            message.includes("✅") ? "bg-emerald-50 text-emerald-700" : 
            message.includes("❌") ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--app-card)] rounded-2xl shadow-xl overflow-hidden sticky top-20 border border-[var(--app-border)]">
              {/* Profile Header Gradient */}
              <div className="h-32 bg-gradient-to-r from-red-600 to-orange-600"></div>

              {/* Profile Content */}
              <div className="px-6 pb-6">
                {/* Avatar */}
                <div className="flex justify-center -mt-16 mb-6">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-red-400 to-orange-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg border-4 border-[var(--app-card)]">
                    {adminInfo.name?.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Basic Info */}
                {!isEditing ? (
                  <>
                    <h2 className="text-2xl font-bold text-[var(--app-text)] text-center mb-1">
                      {adminInfo.name}
                    </h2>
                    <p className="text-sm text-[var(--app-muted)] text-center mb-6">
                      ⚙️ Administrator
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="bg-[var(--app-card-alt)] p-3 rounded-lg border border-[var(--app-border)]">
                        <p className="text-xs text-[var(--app-muted)]">Email</p>
                        <p className="text-sm font-semibold text-[var(--app-text)] break-all">
                          {adminInfo.email}
                        </p>
                      </div>
                      <div className="bg-[var(--app-card-alt)] p-3 rounded-lg border border-[var(--app-border)]">
                        <p className="text-xs text-[var(--app-muted)]">Role</p>
                        <p className="text-sm font-semibold text-[var(--app-text)]">
                          {adminInfo.role || "Administrator"}
                        </p>
                      </div>
                      <div className="bg-[var(--app-card-alt)] p-3 rounded-lg border border-[var(--app-border)]">
                        <p className="text-xs text-[var(--app-muted)]">Status</p>
                        <p className="inline-block bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs font-bold">
                          ✓ Active
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-200"
                    >
                      ✏️ Edit Profile
                    </button>
                  </>
                ) : (
                  <>
                    <div className="space-y-4 mb-4">
                      <div>
                        <label className="block text-xs text-[var(--app-muted)] mb-1">Name</label>
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => handleEditChange("name", e.target.value)}
                          className="w-full border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text)] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--app-accent)] focus:border-transparent"
                          placeholder="Your name"
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
                          setEditData(adminInfo);
                        }}
                        className="flex-1 bg-[var(--app-card-alt)] border border-[var(--app-border)] text-[var(--app-text)] font-bold py-2 px-4 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Dashboard Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[var(--app-card-alt)] rounded-xl p-6 border border-[var(--app-border)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--app-muted)] mb-1">Total Users</p>
                    <p className="text-3xl font-black text-[var(--app-accent)]">
                      {stats.totalUsers || 0}
                    </p>
                  </div>
                  <div className="text-5xl opacity-20">👥</div>
                </div>
              </div>

              <div className="bg-[var(--app-card-alt)] rounded-xl p-6 border border-[var(--app-border)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--app-muted)] mb-1">Total Courses</p>
                    <p className="text-3xl font-black text-[var(--app-accent)]">
                      {stats.totalCourses || 0}
                    </p>
                  </div>
                  <div className="text-5xl opacity-20">📚</div>
                </div>
              </div>

              <div className="bg-[var(--app-card-alt)] rounded-xl p-6 border border-[var(--app-border)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--app-muted)] mb-1">Total Questions</p>
                    <p className="text-3xl font-black text-[var(--app-accent)]">
                      {stats.totalQuestions || 0}
                    </p>
                  </div>
                  <div className="text-5xl opacity-20">❓</div>
                </div>
              </div>
            </div>

            {/* Admin Page */}
            <div className="bg-[var(--app-card)] rounded-2xl shadow-xl p-8 border border-[var(--app-border)]">
              <h3 className="text-3xl font-bold text-[var(--app-text)] mb-6">
                🎯 Admin Page
              </h3>

              <div className="space-y-4">
                <div className="border-2 border-[var(--app-border)] rounded-lg p-4 hover:border-[var(--app-accent)] transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-[var(--app-text)]">
                      Users Management
                    </h4>
                    <span className="text-2xl">👥</span>
                  </div>
                  <p className="text-sm text-[var(--app-muted)]">
                    Manage students, teachers, and admins
                  </p>
                </div>

                <div className="border-2 border-[var(--app-border)] rounded-lg p-4 hover:border-[var(--app-accent)] transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-[var(--app-text)]">
                      Courses Management
                    </h4>
                    <span className="text-2xl">📚</span>
                  </div>
                  <p className="text-sm text-[var(--app-muted)]">
                    Create, edit, and manage courses
                  </p>
                </div>

                <div className="border-2 border-[var(--app-border)] rounded-lg p-4 hover:border-[var(--app-accent)] transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-[var(--app-text)]">
                      Questions & Answers
                    </h4>
                    <span className="text-2xl">❓</span>
                  </div>
                  <p className="text-sm text-[var(--app-muted)]">
                    Monitor and manage doubts and solutions
                  </p>
                </div>

                <div className="border-2 border-[var(--app-border)] rounded-lg p-4 hover:border-[var(--app-accent)] transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-[var(--app-text)]">
                      Analytics
                    </h4>
                    <span className="text-2xl">📊</span>
                  </div>
                  <p className="text-sm text-[var(--app-muted)]">
                    View platform statistics and insights
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

export default AdminProfilePage;
