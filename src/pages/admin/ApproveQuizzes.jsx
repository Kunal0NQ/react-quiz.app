// src/pages/admin/ApproveQuizzes.js

import { useEffect, useState } from "react";
import { approveQuiz, rejectQuiz, getPendingQuizzes } from "../../services/firestoreServices";
import { Dialog } from "@headlessui/react";

const ApproveQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const fetchQuizzes = async () => {
    const data = await getPendingQuizzes();
    setQuizzes(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleApprove = async (id) => {
    await approveQuiz(id);
    fetchQuizzes();
  };

  const handleReject = async (id) => {
    const confirm = window.confirm("Are you sure you want to reject and delete this quiz?");
    if (confirm) {
      await rejectQuiz(id);
      fetchQuizzes();
    }
  };

  const openPreview = (quiz) => {
    setSelectedQuiz(quiz);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setSelectedQuiz(null);
    setIsPreviewOpen(false);
  };

  if (loading) return <div className="text-center mt-10">Loading pending quizzes...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6">Pending Quizzes for Approval</h2>

      {quizzes.length === 0 ? (
        <p>No pending quizzes right now.</p>
      ) : (
        <ul className="space-y-4">
          {quizzes.map((quiz) => (
            <li key={quiz.id} className="p-4 border rounded shadow bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{quiz.title}</h3>
                  <p className="text-sm text-gray-600">
                    Created by: {quiz.createdBy || "Unknown"}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => openPreview(quiz)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => handleApprove(quiz.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(quiz.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Preview Modal */}
      <Dialog open={isPreviewOpen} onClose={closePreview} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl rounded bg-white p-6 space-y-4 overflow-y-auto max-h-[80vh]">
            <Dialog.Title className="text-xl font-bold">Quiz Preview</Dialog.Title>

            {selectedQuiz && selectedQuiz.questions.map((q, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded shadow-sm space-y-2">
                <h4 className="font-semibold">Q{index + 1}: {q.question}</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {q.options.map((opt, i) => (
                    <li
                      key={i}
                      className={opt === q.answer ? "font-semibold text-green-600" : ""}
                    >
                      {opt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="text-right">
              <button
                onClick={closePreview}
                className="text-sm px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default ApproveQuizzes;
