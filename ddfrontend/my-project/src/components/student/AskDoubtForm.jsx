import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import AttachmentDisplay from "../common/AttachmentDisplay";
import { getSubjectsForCourse } from "../../data/courseSubjectsData";

const AskDoubtForm = ({
  isFollowUp = false,
  originalQuestion = null,
  onSuccess,
  onClose,
}) => {
  const { loggedInUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedCourseName = location.state?.courseName;

  const [doubtDescription, setDoubtDescription] = useState("");
  const [doubtTitle, setDoubtTitle] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(
    preselectedCourseName || ""
  );
  const [selectedSubject, setSelectedSubject] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [subjectsForCourse, setSubjectsForCourse] = useState([]);
  const [error, setError] = useState("");
  const [isPosted, setIsPosted] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!isFollowUp) {
      const fetchEnrolledCourses = async () => {
        if (loggedInUser?.email) {
          try {
            const response = await api.get(
              `/students/courses?email=${loggedInUser.email}`
            );
            setEnrolledCourses(response.data);
            if (preselectedCourseName) {
              setSelectedCourse(preselectedCourseName);
            }
          } catch (err) {
            console.error("Could not fetch enrolled courses", err);
          }
        }
      };
      fetchEnrolledCourses();
    }
  }, [loggedInUser, preselectedCourseName, isFollowUp]);

  useEffect(() => {
    if (selectedCourse) {
      setSubjectsForCourse(getSubjectsForCourse(selectedCourse));
    } else {
      setSubjectsForCourse([]);
    }
  }, [selectedCourse]);

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError("");

    const uploadPromises = Array.from(files).map((file) => {
      const formData = new FormData();
      formData.append("file", file);
      return api.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    });

    try {
      const responses = await Promise.all(uploadPromises);
      const newAttachments = responses.map((res, index) => ({
        fileName: res.data.fileName,
        fileUrl: res.data.url,
        fileType: files[index].type,
      }));
      setAttachments((prev) => [...prev, ...newAttachments]);
    } catch (err) {
      setError("File upload failed. Please try again.");
      console.error("File upload error:", err);
    } finally {
      setIsUploading(false);
      event.target.value = null;
    }
  };

  const removeAttachment = (fileName) => {
    setAttachments(attachments.filter((att) => att.fileName !== fileName));
  };

  const handlePostDoubt = async (e) => {
    e.preventDefault();
    
    // Validate required fields (attachments are NOT required)
    if (!doubtTitle.trim()) {
      setError("⚠️ Please enter a question title.");
      return;
    }
    
    if (!doubtDescription.trim()) {
      setError("⚠️ Please describe your doubt.");
      return;
    }
    
    if (!isFollowUp) {
      if (!selectedCourse) {
        setError("⚠️ Please select a course.");
        return;
      }
      if (!selectedSubject) {
        setError("⚠️ Please select a subject.");
        return;
      }
    }

    setError("");
    try {
      const payload = {
        studentEmail: loggedInUser.email,
        courseName: isFollowUp ? originalQuestion.courseName : selectedCourse,
        subjectName: isFollowUp
          ? originalQuestion.subjectName
          : selectedSubject,
        questionTitle: doubtTitle,
        description: doubtDescription,
        attachments: attachments, // Can be empty array - that's fine!
      };

      if (isFollowUp) {
        await api.post(
          `/questions/${originalQuestion.questionId}/follow-up`,
          payload
        );
        if (onSuccess) onSuccess();
      } else {
        await api.post("/questions", payload);
        setIsPosted(true);
        setTimeout(() => {
          navigate("/student/dashboard");
        }, 0);
      }
    } catch (err) {
      setError("❌ Failed to post your doubt. Please try again.");
      console.error("Doubt posting error:", err);
    }
  };

  return (
    <div
      className={
        isFollowUp
          ? "fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          : "min-h-screen bg-[var(--app-bg)] flex items-center justify-center p-4"
      }
    >
      <div className="bg-[var(--app-card)] rounded-lg shadow-xl p-8 max-w-2xl w-full text-center relative border border-[var(--app-border)] text-[var(--app-text)]">
        {isFollowUp && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-2 right-2 text-[var(--app-muted)] hover:text-[var(--app-text)] p-2 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
        <h2 className="text-4xl font-bold text-[var(--app-accent)] mb-2">
          {isFollowUp ? "Ask a Follow-up" : "Ask a Doubt"}
        </h2>
        <p className="text-sm text-[var(--app-muted)] mb-6">
          <span className="text-red-500">*</span> = Required | 📎 Files are optional
        </p>
        {isPosted && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-md mb-4">
            Success! Your doubt has been posted. Redirecting to student page...
          </div>
        )}

        <form onSubmit={handlePostDoubt} className="space-y-6 text-left">
          {!isFollowUp && (
            <>
              <div>
                <label
                  htmlFor="selectCourse"
                  className="block text-[var(--app-text)] text-sm font-bold mb-2"
                >
                  Select Course: <span className="text-red-500">*</span>
                </label>
                <select
                  id="selectCourse"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  disabled={!!preselectedCourseName}
                  className="shadow-sm border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text)] rounded-md w-full py-3 px-4 focus:ring-2 focus:ring-[var(--app-accent)] focus:border-transparent"
                >
                  <option value="">-- Select an Enrolled Course --</option>
                  {enrolledCourses.map((course) => (
                    <option key={course.courseId} value={course.title}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
              {selectedCourse && (
                <div>
                  <label
                    htmlFor="selectSubject"
                    className="block text-[var(--app-text)] text-sm font-bold mb-2"
                  >
                    Select Subject: <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="selectSubject"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="shadow-sm border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text)] rounded-md w-full py-3 px-4 focus:ring-2 focus:ring-[var(--app-accent)] focus:border-transparent"
                  >
                    <option value="">-- Select a Subject --</option>
                    {subjectsForCourse.map((subject, index) => (
                      <option key={index} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          <div>
            <label
              htmlFor="doubtTitle"
              className="block text-[var(--app-text)] text-sm font-bold mb-2"
            >
              Question Title: <span className="text-red-500">*</span>
            </label>
            <input
              id="doubtTitle"
              type="text"
              value={doubtTitle}
              onChange={(e) => setDoubtTitle(e.target.value)}
              placeholder="e.g., Problem with Newton's second law"
              className="shadow-sm border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text)] rounded-md w-full py-3 px-4 focus:ring-2 focus:ring-[var(--app-accent)] focus:border-transparent"
            />
          </div>
          <div>
            <label
              htmlFor="doubtDescription"
              className="block text-[var(--app-text)] text-sm font-bold mb-2"
            >
              Your Doubt: <span className="text-red-500">*</span>
            </label>
            <textarea
              id="doubtDescription"
              value={doubtDescription}
              onChange={(e) => setDoubtDescription(e.target.value)}
              rows="6"
              placeholder="Describe your question in detail..."
              className="shadow-sm border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text)] rounded-md w-full py-3 px-4 focus:ring-2 focus:ring-[var(--app-accent)] focus:border-transparent"
            ></textarea>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[var(--app-text)] text-sm font-bold">
                Attach Files (Image, Audio, Video):
              </label>
              <span className="text-xs text-[var(--app-muted)] bg-[var(--app-card-alt)] px-3 py-1 rounded-full">
                Optional
              </span>
            </div>
            <p className="text-xs text-[var(--app-muted)] mb-3">
              📎 Upload files to provide more context to your doubt. You can ask without attachments too!
            </p>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              disabled={isUploading}
              className="block w-full text-sm text-[var(--app-muted)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--app-card-alt)] file:text-[var(--app-text)] hover:file:bg-[var(--app-border)] disabled:opacity-50"
            />
            {isUploading && (
              <p className="text-sm text-[var(--app-accent)] mt-2">⏳ Uploading...</p>
            )}
            {attachments.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-[var(--app-text)] mb-2">📁 Attached Files:</p>
                <AttachmentDisplay
                  attachments={attachments}
                  onRemove={removeAttachment}
                />
              </div>
            )}
          </div>

          {error && (
            <p className="text-red-500 text-xs italic mt-1 text-left">
              {error}
            </p>
          )}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-[var(--app-accent)] hover:bg-[var(--app-accent-strong)] text-white font-bold py-3 px-6 rounded-lg"
            >
              Post Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AskDoubtForm;
