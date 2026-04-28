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
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={handleBackToTable}
              className="mb-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition"
            >
              ← Back to Table
            </button>
            <h2 className="text-3xl font-bold text-gray-900">
              {selectedGroup.courseName} - {selectedGroup.subjectName}
            </h2>
            <p className="text-[var(--app-muted)] mt-2">
              {selectedGroup.pendingCount} pending question(s)
            </p>
          </div>

          {/* Questions List */}
          {groupLoading ? (
            <div className="text-center py-8">Loading questions...</div>
          ) : (
            <div className="space-y-4">
              {groupQuestions.length === 0 ? (
                <p className="text-center text-[var(--app-muted)] py-8">No pending questions found.</p>
              ) : (
                <>
                  {groupQuestions.map((question) => (
                    <div
                      key={question.questionId}
                      className="bg-[var(--app-card)] rounded-2xl shadow-md p-6 border-l-4 border-[var(--app-accent)]"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-grow">
                          <h3 className="text-xl font-semibold text-[var(--app-text)] mb-2">
                            {question.questionTitle}
                          </h3>
                          <p className="text-[var(--app-muted)] mb-3">{question.description}</p>
                          <p className="text-sm text-[var(--app-muted)]">
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
                          className="px-6 py-2 bg-[var(--app-accent)] hover:bg-[var(--app-accent-strong)] text-white rounded-lg font-semibold whitespace-nowrap transition"
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
                    className="px-4 py-2 bg-[var(--app-card)] border border-[var(--app-border)] hover:border-[var(--app-accent)] disabled:opacity-50 text-[var(--app-text)] rounded-lg font-semibold transition"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-[var(--app-text)]">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages - 1}
                    className="px-4 py-2 bg-[var(--app-card)] border border-[var(--app-border)] hover:border-[var(--app-accent)] disabled:opacity-50 text-[var(--app-text)] rounded-lg font-semibold transition"
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
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] flex items-center justify-center p-8">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm uppercase tracking-widest text-[var(--app-muted)]">
            Teacher Page
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--app-text)] mb-2">
            Pending questions by subject
          </h2>
          <p className="text-[var(--app-muted)]">
            Click the "Solve" button to view and answer questions in each category
          </p>
        </div>

        {/* Summary Stats */}
        {groupedQuestions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[var(--app-card)] rounded-2xl shadow-md p-4 border border-[var(--app-border)]">
              <p className="text-sm text-[var(--app-muted)]">Total Subjects</p>
              <p className="text-3xl font-bold text-[var(--app-text)]">{groupedQuestions.length}</p>
            </div>
            <div className="bg-[var(--app-card)] rounded-2xl shadow-md p-4 border border-[var(--app-border)]">
              <p className="text-sm text-[var(--app-muted)]">Total Questions</p>
              <p className="text-3xl font-bold text-[var(--app-text)]">
                {groupedQuestions.reduce((sum, g) => sum + g.pendingCount, 0)}
              </p>
            </div>
            <div className="bg-[var(--app-card)] rounded-2xl shadow-md p-4 border border-[var(--app-border)]">
              <p className="text-sm text-[var(--app-muted)]">Courses</p>
              <p className="text-3xl font-bold text-[var(--app-text)]">
                {new Set(groupedQuestions.map(g => g.courseName)).size}
              </p>
            </div>
            <div className="bg-[var(--app-card)] rounded-2xl shadow-md p-4 border border-[var(--app-border)]">
              <p className="text-sm text-[var(--app-muted)]">Status</p>
              <p className="text-3xl font-bold text-[var(--app-text)]">Pending</p>
            </div>
          </div>
        )}

        {/* Table */}
        {groupedQuestions.length === 0 ? (
          <div className="bg-[var(--app-card)] rounded-2xl shadow-md p-8 text-center border border-[var(--app-border)]">
            <p className="text-xl text-[var(--app-muted)]">✅ No pending questions! All questions have been answered.</p>
          </div>
        ) : (
          <div className="bg-[var(--app-card)] rounded-2xl shadow-md overflow-hidden border border-[var(--app-border)]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--app-accent)] text-white">
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
                      className={`border-b ${
                        index % 2 === 0 ? 'bg-[var(--app-card)]' : 'bg-[var(--app-card-alt)]'
                      }`}
                    >
                      <td className="px-6 py-4 text-center font-medium text-[var(--app-text)]">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 font-medium text-[var(--app-text)]">
                        {group.courseName}
                      </td>
                      <td className="px-6 py-4 text-[var(--app-muted)]">
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
                          className="px-6 py-2 bg-[var(--app-accent)] hover:bg-[var(--app-accent-strong)] text-white rounded-lg font-semibold transition duration-200 shadow-md hover:shadow-lg"
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
            <div className="bg-[var(--app-card-alt)] px-6 py-4 border-t border-[var(--app-border)]">
              <p className="text-sm text-[var(--app-muted)]">
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
