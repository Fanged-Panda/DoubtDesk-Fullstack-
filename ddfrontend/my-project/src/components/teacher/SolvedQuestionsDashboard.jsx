import React, { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import AttachmentDisplay from "../common/AttachmentDisplay";
import SolutionForm from "./SolutionForm";

const SolvedQuestionsDashboard = () => {
  const { loggedInUser } = useContext(AuthContext);
  const [solvedQuestions, setSolvedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [viewingQuestionDetails, setViewingQuestionDetails] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const fetchSolvedQuestions = async () => {
      if (!loggedInUser?.email) return;
      try {
        setLoading(true);
        const response = await api.get(
          `/questions/solved-by-teacher?email=${loggedInUser.email}`
        );
        const sortedQuestions = response.data.sort(
          (a, b) => new Date(b.answerAt) - new Date(a.answerAt)
        );
        setSolvedQuestions(sortedQuestions);
        setError(null);
      } catch (err) {
        setError("Failed to load solved questions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchSolvedQuestions();
  }, [loggedInUser]);

  const handleViewDetailsClick = async (questionId) => {
    try {
      const response = await api.get(`/questions/${questionId}`);
      setViewingQuestionDetails(response.data);
    } catch (err) {
      alert("Could not fetch question details.");
      console.error(err);
    }
  };

  const handleCloseDetailsView = () => {
    setViewingQuestionDetails(null);
  };

  const handleEditClick = () => {
    setEditingQuestion(viewingQuestionDetails);
  };

  const handleEditSuccess = () => {
    setEditingQuestion(null);
    handleViewDetailsClick(viewingQuestionDetails.questionId);
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
  };

  if (loading)
    return <p className="text-center p-8 text-[var(--app-muted)]">Loading solved questions...</p>;
  if (error) return <p className="text-center text-red-500 p-8">{error}</p>;

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] flex flex-col items-center justify-center p-8">
      <div className="bg-[var(--app-card)] rounded-2xl shadow-xl p-8 max-w-4xl w-full border border-[var(--app-border)]">
        <p className="text-sm uppercase tracking-widest text-[var(--app-muted)] text-center">Teacher Page</p>
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--app-text)] mb-6 text-center">
          Solved questions
        </h2>
        {solvedQuestions.length === 0 ? (
          <p className="text-lg text-[var(--app-muted)] text-center">
            You haven't solved any questions yet.
          </p>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
            {solvedQuestions.map((question) => (
              <div
                key={question.questionId}
                className="bg-[var(--app-card-alt)] p-4 rounded-xl shadow-sm border border-[var(--app-border)] flex justify-between items-center"
              >
                <div className="text-left">
                  <p className="text-[var(--app-text)] font-semibold">
                    {question.questionTitle}
                  </p>
                  <p className="text-xs text-[var(--app-muted)]">
                    Status:{" "}
                    <span className="font-medium">{question.status}</span>
                  </p>
                </div>
                <button
                  onClick={() => handleViewDetailsClick(question.questionId)}
                  className="bg-[var(--app-accent)] hover:bg-[var(--app-accent-strong)] text-white px-5 py-2 rounded-lg font-medium"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {viewingQuestionDetails && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-40">
          <div className="bg-[var(--app-card)] rounded-2xl shadow-xl p-6 max-w-2xl w-full text-left space-y-4 max-h-[90vh] overflow-y-auto border border-[var(--app-border)]">
            <h3 className="text-2xl font-bold text-[var(--app-text)] border-b border-[var(--app-border)] pb-2">
              Question Details
            </h3>

            <div>
              <p className="font-semibold text-[var(--app-muted)]">Student's Question:</p>
              <div className="p-3 bg-[var(--app-card-alt)] rounded-md border border-[var(--app-border)] mt-1">
                <p className="font-bold">
                  {viewingQuestionDetails.questionTitle}
                </p>
                <p className="whitespace-pre-wrap">
                  {viewingQuestionDetails.description}
                </p>
                <AttachmentDisplay
                  attachments={viewingQuestionDetails.questionAttachments}
                />
              </div>
            </div>

            <div>
              <p className="font-semibold text-emerald-600">Your Solution:</p>
              <div className="p-3 bg-emerald-50 rounded-md border border-emerald-200 mt-1">
                <p className="whitespace-pre-wrap">
                  {viewingQuestionDetails.solutionText}
                </p>
                <AttachmentDisplay
                  attachments={viewingQuestionDetails.solutionAttachments}
                />
              </div>
            </div>

            <div className="text-right mt-4 flex justify-end space-x-3">
              <button
                onClick={handleEditClick}
                className="bg-[var(--app-accent)] hover:bg-[var(--app-accent-strong)] text-white font-bold py-2 px-4 rounded"
              >
                Edit Solution
              </button>
              <button
                onClick={handleCloseDetailsView}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {editingQuestion && (
        <SolutionForm
          question={editingQuestion}
          onCancel={handleCancelEdit}
          onSolutionSuccess={handleEditSuccess}
          isEditing={true}
          initialSolutionText={editingQuestion.solutionText}
        />
      )}
    </div>
  );
};

export default SolvedQuestionsDashboard;
