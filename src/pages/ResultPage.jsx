// src/pages/Result.js
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { writeBatch, doc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Ensure state exists before accessing properties
  const state = location.state || {};
  const { selectedAnswers, questions, quizId, quizTitle } = state;

  const [score, setScore] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!questions || !selectedAnswers || !user?.uid) {
      setError("Invalid quiz data or user not logged in.");
      return;
    }

    let count = 0;
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.answer) count++;
    });
    setScore(count);

    try {
      const batch = writeBatch(db);
      const scoresRef = doc(collection(db, "scores"));
      const attemptsRef = doc(collection(db, "quizAttempts"));

      batch.set(scoresRef, {
        uid: user.uid,
        quizId,
        quizTitle: quizTitle || "Untitled Quiz",
        score: count,
        total: questions.length,
        createdAt: serverTimestamp(),
      });

      batch.set(attemptsRef, {
        uid: user.uid,
        quizId,
        quizTitle: quizTitle || "Untitled Quiz",
        score: count,
        total: questions.length,
        attemptedAt: serverTimestamp(),
      });

      batch.commit();
    } catch (err) {
      setError("Failed to save results. Please try again.");
      console.error("Firestore Error:", err);
    }
  }, [questions, selectedAnswers, user, quizId, quizTitle]);

  if (error) {
    return <p className="text-center mt-10 text-red-600">{error}</p>;
  }

  if (!questions || !selectedAnswers) {
    return <p className="text-center mt-10">Result not available</p>;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto py-4">
        <div className="bg-white shadow rounded p-6 text-center mb-6">
          <h2 className="text-3xl font-bold text-indigo-700">Your Score</h2>
          <p className="text-xl text-gray-800 mt-2">
            {score} / {questions.length}
          </p>
        </div>

        <div className="space-y-6">
          {questions.map((q, i) => {
            const userAns = selectedAnswers[i];
            const isCorrect = userAns === q.answer;

            return (
              <div key={i} className="bg-white p-5 border rounded-md shadow space-y-3">
                <h3 className="font-medium text-gray-900">
                  Q{i + 1}: {q.question}
                </h3>
                <ul className="space-y-2">
                  {q.options.map((opt, idx) => {
                    const isSelected = opt === userAns;
                    const isAnswer = opt === q.answer;
                    let className = "px-4 py-2 border rounded-md transition-all";
                    if (isSelected && isAnswer) {
                      className += " bg-green-100 border-green-500 text-green-800";
                    } else if (isSelected && !isAnswer) {
                      className += " bg-red-100 border-red-500 text-red-700";
                    } else if (isAnswer) {
                      className += " bg-green-50 border-green-300 text-green-700";
                    } else {
                      className += " bg-gray-100 border-gray-300";
                    }
                    return <li key={idx} className={className}>{opt}</li>;
                  })}
                </ul>

                {!isCorrect && (
                  <div className="text-sm text-red-600">
                    ❌ Your Answer: <strong>{userAns || "Not Answered"}</strong><br />
                    ✅ Correct Answer: <strong>{q.answer}</strong>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-500"
          >
            Back to Home
          </button>
        </div>
      </div>
    </>
  );
};

export default Result;
