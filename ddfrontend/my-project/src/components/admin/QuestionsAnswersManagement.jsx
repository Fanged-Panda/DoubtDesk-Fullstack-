import React, { useState, useEffect } from "react";
import api from "../../services/api";
import AttachmentDisplay from "../common/AttachmentDisplay"; // নতুন কম্পোনেন্ট ইম্পোর্ট

const QuestionsAnswersManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingQuestion, setViewingQuestion] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/questions");
      setQuestions(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load questions.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this question permanently?"
      )
    ) {
      try {
        await api.delete(`/admin/questions/${questionId}`);
        setQuestions(questions.filter((q) => q.questionId !== questionId));
      } catch (err) {
        alert("Failed to delete the question. Please try again.");
        console.error("Delete question error:", err);
      }
    }
  };

  if (loading) return <p className="text-center p-8">Loading Q&A data...</p>;
  if (error) return <p className="text-center text-red-500 p-8">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-5xl w-full text-center">
        <h2 className="text-4xl font-bold text-blue-600 mb-8">
          Question & Answer Management ({questions.length} Total)
        </h2>

        {questions.length === 0 ? (
          <p className="text-lg text-gray-700">No questions asked yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full bg-white">
              <thead className="bg-purple-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase">
                    Question
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase">
                    Solved By (Teacher)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {questions.map((item) => (
                  <tr key={item.questionId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.questionTitle?.substring(0, 30) || "N/A"}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.studentEmail || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.solvedByTeacherEmail || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === "solved"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => setViewingQuestion(item)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(item.questionId)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {viewingQuestion && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full my-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">
              Question & Answer Details
            </h3>
            
            <div className="text-left space-y-5">
              {/* Student Info */}
              <div className="border-b pb-4">
                <p className="text-sm text-gray-600 mb-1">
                  <strong>📧 Student Email:</strong>
                </p>
                <p className="text-base text-gray-800">{viewingQuestion.studentEmail}</p>
              </div>

              {/* Question Section */}
              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                <p className="font-bold text-blue-900 mb-2 text-lg">❓ Question</p>
                <p className="font-semibold text-gray-900 mb-2">
                  {viewingQuestion.questionTitle}
                </p>
                <p className="text-gray-700 mb-3">{viewingQuestion.description}</p>
                {viewingQuestion.questionAttachments && viewingQuestion.questionAttachments.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">📎 Question Attachments:</p>
                    <AttachmentDisplay attachments={viewingQuestion.questionAttachments} />
                  </div>
                )}
              </div>

              {/* Answer Section */}
              {viewingQuestion.solutionText || viewingQuestion.answerText ? (
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-bold text-green-900 text-lg">✅ Answer</p>
                    {viewingQuestion.solvedByTeacherName && (
                      <span className="text-sm bg-green-200 text-green-800 px-2 py-1 rounded">
                        By: {viewingQuestion.solvedByTeacherName}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                    {viewingQuestion.solutionText || viewingQuestion.answerText}
                  </p>
                  {viewingQuestion.solutionAttachments && viewingQuestion.solutionAttachments.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <p className="text-sm font-semibold text-gray-700 mb-2">📎 Answer Attachments:</p>
                      <AttachmentDisplay attachments={viewingQuestion.solutionAttachments} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                  <p className="text-yellow-800 font-semibold">⏳ Answer: Not Answered Yet</p>
                </div>
              )}

              {/* Status & Teacher Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <p className="text-xs text-gray-600 uppercase font-semibold">Status</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    <span
                      className={`px-3 py-1 rounded-full inline-block ${
                        viewingQuestion.status === "solved"
                          ? "bg-green-100 text-green-800"
                          : viewingQuestion.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {viewingQuestion.status?.toUpperCase()}
                    </span>
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <p className="text-xs text-gray-600 uppercase font-semibold">Teacher</p>
                  <p className="text-base font-semibold text-gray-900 mt-1">
                    {viewingQuestion.solvedByTeacherEmail ? (
                      <>
                        <span>{viewingQuestion.solvedByTeacherName || "Unknown"}</span>
                        <br />
                        <span className="text-xs text-gray-600">{viewingQuestion.solvedByTeacherEmail}</span>
                      </>
                    ) : (
                      <span className="text-gray-500">Not assigned</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <p className="text-xs text-gray-600 uppercase font-semibold">Posted At</p>
                  <p className="text-gray-800 mt-1">
                    {viewingQuestion.postAt
                      ? new Date(viewingQuestion.postAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
                {viewingQuestion.answerAt && (
                  <div className="bg-gray-50 p-3 rounded-lg border">
                    <p className="text-xs text-gray-600 uppercase font-semibold">Answered At</p>
                    <p className="text-gray-800 mt-1">
                      {new Date(viewingQuestion.answerAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="text-right mt-8">
              <button
                onClick={() => setViewingQuestion(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionsAnswersManagement;
