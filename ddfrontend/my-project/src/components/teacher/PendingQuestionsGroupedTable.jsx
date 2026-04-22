import React, { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import SolutionForm from "./SolutionForm";
import AttachmentDisplay from "../common/AttachmentDisplay";

const PendingQuestionsGroupedTable = () => {
  const { loggedInUser } = useContext(AuthContext);
  const [groupedQuestions, setGroupedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupQuestions, setGroupQuestions] = useState([]);
  const [groupLoading, setGroupLoading] = useState(false);
  const [solvingQuestion, setSolvingQuestion] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;

  // Fetch grouped summary
  const fetchGroupedQuestions = async (isPolling = false) => {
    try {
      if (!isPolling) setLoading(true);
      const response = await api.get(`/questions/grouping/summary`);
      setGroupedQuestions(response.data);
      setError(null);
    } catch (err) {
      if (!isPolling) setError("Failed to load pending questions grouping.");
      console.error(err);
    } finally {
      if (!isPolling) setLoading(false);
    }
  };

  // Fetch questions for a specific group
  const fetchGroupQuestions = async (courseId, subjectId, page = 0, isPolling = false) => {
    try {
      if (!isPolling) setGroupLoading(true);
      const response = await api.get(`/questions/grouping/list`, {
        params: {
          courseId: courseId || 'null',
          subjectId: subjectId || 'null',
          page,
          size: pageSize
        }
      });
      setGroupQuestions(response.data.content);
      setTotalPages(response.data.totalPages);
      setCurrentPage(page);
      if (!isPolling) setGroupLoading(false);
    } catch (err) {
      console.error("Failed to load group questions:", err);
      if (!isPolling) setGroupLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupedQuestions();
    const interval = setInterval(() => {
      fetchGroupedQuestions(true);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedGroup && !solvingQuestion) {
      const interval = setInterval(() => {
        fetchGroupQuestions(selectedGroup.courseId, selectedGroup.subjectId, currentPage, true);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [selectedGroup, solvingQuestion, currentPage]);

  useEffect(() => {
    if (selectedGroup) {
      const updatedGroup = groupedQuestions.find(
        (g) => g.courseId === selectedGroup.courseId && g.subjectId === selectedGroup.subjectId
      );
      if (updatedGroup && updatedGroup.pendingCount !== selectedGroup.pendingCount) {
        setSelectedGroup(updatedGroup);
      } else if (!updatedGroup && selectedGroup.pendingCount !== 0) {
        setSelectedGroup({ ...selectedGroup, pendingCount: 0 });
      }
    }
  }, [groupedQuestions]);

  const handleSolveClick = (group) => {
    setSelectedGroup(group);
    setCurrentPage(0);
    fetchGroupQuestions(group.courseId, group.subjectId, 0);
  };

  const handleBackToTable = () => {
    setSelectedGroup(null);
    setGroupQuestions([]);
    setCurrentPage(0);
    setSolvingQuestion(null);
  };

  const handleSolveQuestion = (question) => {
    setSolvingQuestion(question);
  };

  const handleSolutionSuccess = () => {
    setSolvingQuestion(null);
    fetchGroupedQuestions();
    if (selectedGroup) {
      fetchGroupQuestions(selectedGroup.courseId, selectedGroup.subjectId, currentPage);
    }
  };

  const handleCancelSolve = () => {
    setSolvingQuestion(null);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      fetchGroupQuestions(selectedGroup.courseId, selectedGroup.subjectId, currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      fetchGroupQuestions(selectedGroup.courseId, selectedGroup.subjectId, currentPage - 1);
    }
  };

  // Show the solution form if solving a question
  if (solvingQuestion) {
    return (
      <SolutionForm
        question={solvingQuestion}
        onSolutionSuccess={handleSolutionSuccess}
        onCancel={handleCancelSolve}
      />
    );
  }

  // Show questions in a group
  if (selectedGroup && !solvingQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={handleBackToTable}
              className="mb-4 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
            >
              ← Back to Table
            </button>
            <h2 className="text-3xl font-bold text-gray-900">
              {selectedGroup.courseName} - {selectedGroup.subjectName}
            </h2>
            <p className="text-gray-600 mt-2">
              {selectedGroup.pendingCount} pending question(s)
            </p>
          </div>

          {/* Questions List */}
          {groupLoading ? (
            <div className="text-center py-8">Loading questions...</div>
          ) : (
            <div className="space-y-4">
              {groupQuestions.length === 0 ? (
                <p className="text-center text-gray-600 py-8">No pending questions found.</p>
              ) : (
                <>
                  {groupQuestions.map((question) => (
                    <div
                      key={question.questionId}
                      className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-grow">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {question.questionTitle}
                          </h3>
                          <p className="text-gray-700 mb-3">{question.description}</p>
                          <p className="text-sm text-gray-600">
                            📚 {question.courseName} • 📖 {question.subjectName}
                          </p>
                          {question.questionAttachments && question.questionAttachments.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm font-semibold text-gray-700 mb-2">Attachments:</p>
                              <AttachmentDisplay attachments={question.questionAttachments} />
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleSolveQuestion(question)}
                          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold whitespace-nowrap transition"
                        >
                          Solve
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 0}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 text-gray-900 rounded-lg font-semibold transition"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-gray-900">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages - 1}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 text-gray-900 rounded-lg font-semibold transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show the table view
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-8">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-purple-600 mb-2">
            📋 Pending Questions by Subject
          </h2>
          <p className="text-gray-600">
            Click the "Solve" button to view and answer questions in each category
          </p>
        </div>

        {/* Summary Stats */}
        {groupedQuestions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-4">
              <p className="text-sm text-gray-600">Total Subjects</p>
              <p className="text-3xl font-bold text-purple-600">{groupedQuestions.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <p className="text-sm text-gray-600">Total Questions</p>
              <p className="text-3xl font-bold text-blue-600">
                {groupedQuestions.reduce((sum, g) => sum + g.pendingCount, 0)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <p className="text-sm text-gray-600">Courses</p>
              <p className="text-3xl font-bold text-green-600">
                {new Set(groupedQuestions.map(g => g.courseName)).size}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-3xl font-bold text-orange-600">Pending</p>
            </div>
          </div>
        )}

        {/* Table */}
        {groupedQuestions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-xl text-gray-700">✅ No pending questions! All questions have been answered.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-center font-semibold">Serial</th>
                    <th className="px-6 py-4 text-left font-semibold">Course Name</th>
                    <th className="px-6 py-4 text-left font-semibold">Subject</th>
                    <th className="px-6 py-4 text-center font-semibold">Pending</th>
                    <th className="px-6 py-4 text-center font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedQuestions.map((group, index) => (
                    <tr
                      key={`${group.courseId}_${group.subjectId}`}
                      className={`border-b transition hover:bg-purple-50 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4 text-center font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {group.courseName}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {group.subjectName}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-bold text-lg">
                          {group.pendingCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleSolveClick(group)}
                          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg"
                        >
                          Solve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t">
              <p className="text-sm text-gray-600">
                Showing {groupedQuestions.length} subject grouping(s)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingQuestionsGroupedTable;
