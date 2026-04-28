import React, { useState, useEffect, useContext } from "react";
import SolutionForm from "./SolutionForm";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import AttachmentDisplay from "../common/AttachmentDisplay"; // নতুন কম্পোনেন্ট ইম্পোর্ট

const PendingQuestionsDashboard = () => {
  const { loggedInUser } = useContext(AuthContext);
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [solvingQuestion, setSolvingQuestion] = useState(null);

  const [enlargedImage, setEnlargedImage] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;

  const fetchPendingQuestions = async (isPolling = false) => {
    if (!loggedInUser?.email) {
      if (!isPolling) setLoading(false);
      return;
    }
    try {
      if (!isPolling) setLoading(true);
      const response = await api.get(
        `/questions/pending?email=${loggedInUser.email}&page=${currentPage}&size=${pageSize}&sort=postAt,desc`
      );

      setPendingQuestions(response.data.content);
      setTotalPages(response.data.totalPages);
      setError(null);
    } catch (err) {
      if (!isPolling) setError("Failed to load pending questions.");
      console.error(err);
    } finally {
      if (!isPolling) setLoading(false);
    }
  };
  useEffect(() => {
    fetchPendingQuestions();
    const interval = setInterval(() => {
      fetchPendingQuestions(true);
    }, 10000);
    return () => clearInterval(interval);
  }, [loggedInUser, currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSolveClick = (question) => {
    setSolvingQuestion(question);
  };

  const handleSolutionSuccess = () => {
    setSolvingQuestion(null);
    fetchPendingQuestions();
  };

  const handleCancelSolve = () => {
    setSolvingQuestion(null);
  };

  if (loading)
    return <p className="text-center p-8 text-[var(--app-muted)]">Loading pending questions...</p>;
  if (error) return <p className="text-center text-red-500 p-8">{error}</p>;

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] flex flex-col items-center justify-center p-8">
      <div className="bg-[var(--app-card)] rounded-2xl shadow-xl p-8 max-w-4xl w-full text-center border border-[var(--app-border)]">
        <h2 className="text-4xl font-bold text-[var(--app-accent)] mb-6">
          Pending Questions
        </h2>
        {pendingQuestions.length === 0 && currentPage === 0 ? (
          <p className="text-lg text-[var(--app-muted)]">
            No pending questions assigned to you.
          </p>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
            {pendingQuestions.map((question) => (
              <div
                key={question.questionId}
                className="bg-[var(--app-card-alt)] p-4 rounded-lg shadow-sm border border-[var(--app-border)] flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div className="text-left flex-grow mb-3 md:mb-0">
                  <p className="text-[var(--app-text)] font-semibold">
                    {question.questionTitle}
                  </p>
                  <p className="text-[var(--app-muted)] text-sm">
                    {question.description}
                  </p>
                  {question.status === "follow-up-pending" && (
                    <p className="text-[var(--app-accent)] text-sm font-semibold mt-1">
                      (Follow-up Question)
                    </p>
                  )}
                  <AttachmentDisplay
                    attachments={question.questionAttachments}
                  />
                </div>
                <button
                  onClick={() => handleSolveClick(question)}
                  className="bg-[var(--app-accent)] hover:bg-[var(--app-accent-strong)] text-white px-5 py-2 rounded-md font-medium ml-0 md:ml-4 flex-shrink-0 self-center"
                >
                  Solve
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            className="bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)] font-bold py-2 px-4 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-lg text-[var(--app-muted)]">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            className="bg-[var(--app-card)] border border-[var(--app-border)] text-[var(--app-text)] font-bold py-2 px-4 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {solvingQuestion && (
        <SolutionForm
          question={solvingQuestion}
          onCancel={handleCancelSolve}
          onSolutionSuccess={handleSolutionSuccess}
        />
      )}
    </div>
  );
};

export default PendingQuestionsDashboard;
