// src/pages/admin/ManageQuizzes.js

import { useEffect, useState } from "react";
import { getAllQuizzes, approveQuiz, rejectQuiz } from "../../services/firestoreServices";
import { Link } from "react-router-dom";

const ManageQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuizzes = async () => {
    const data = await getAllQuizzes();
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
    const confirm = window.confirm("Are you sure you want to delete this quiz?");
    if (confirm) {
      await rejectQuiz(id);
      fetchQuizzes();
    }
  };

  if (loading) return <div className="text-center mt-10">Loading quizzes...</div>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <div className="flex items-baseline justify-between border-b border-gray-200 pt-7 pb-6 sm:px-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          All Quizzes
        </h1>
      </div>

      {quizzes.length === 0 ? (
        <p>No quizzes found.</p>
      ) : (
        <ul className="space-y-4">
          {quizzes.map((quiz) => (
            <li key={quiz.id} className="p-4 border rounded shadow bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{quiz.title}</h3>
                  <p className="text-sm text-gray-600">
                    Status: <strong>{quiz.status}</strong> <br />
                    Created by: {quiz.createdBy || "Unknown"}
                  </p>
                </div>
              

                <div className="space-x-2">
                <Link
                    to={`/admin/edit/${quiz.id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </Link>
                  {quiz.status === "pending" && (
                    <>
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
                    </>
                  )}
                  {quiz.status === "approved" && (
                    <button
                      onClick={() => handleReject(quiz.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageQuizzes;
