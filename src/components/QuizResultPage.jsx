import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

const QuizResultPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { selectedAnswers, questions, quizId, quizTitle } = state || {};
  const { user } = useAuth();
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!questions || !selectedAnswers || !user?.uid) return;

    let count = 0;
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.answer) count++;
    });
    setScore(count);

    const formattedDate = new Date().toLocaleString(); // "12/12/2023, 12:30:00 PM"
    const quizResult = {
      title: quizTitle || "Untitled Quiz",
      score: count,
      totalQuiz: questions.length,
      createdAt: formattedDate,
    };

    const saveToRecentQuizzes = async () => {
      const userDocRef = doc(db, "recentQuizzes", user.uid);

      try {
        const userDoc = await getDoc(userDocRef);
        const existingData = userDoc.exists() ? userDoc.data() : {};

        const updatedData = {
          userId: user.uid,
          recentQuizzes: [...(existingData.recentQuizzes || []), quizResult],
        };

        await setDoc(userDocRef, updatedData);
        console.log("Recent quiz saved.");

        
      } catch (error) {
        console.error("Error saving recent quiz:", error);
      }
    };

    saveToRecentQuizzes();
  }, [questions, selectedAnswers, user, quizId, quizTitle]);

  if (!questions || !selectedAnswers) {
    return <p className="text-center mt-10">Result not available</p>;
  }

  return (
    <div className="w-full">
 
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
              <div
                key={i}
                className="bg-white p-5 border rounded-md shadow space-y-3"
              >
                <h3 className="font-medium text-gray-900">
                  Q{i + 1}: {q.question}
                </h3>
                <ul className="space-y-2">
                  {q.options.map((opt, idx) => {
                    const isSelected = opt === userAns;
                    const isAnswer = opt === q.answer;
                    let className =
                      "px-4 py-2 border rounded-md transition-all";
                    if (isSelected && isAnswer) {
                      className +=
                        " bg-green-100 border-green-500 text-green-800";
                    } else if (isSelected && !isAnswer) {
                      className += " bg-red-100 border-red-500 text-red-700";
                    } else if (isAnswer) {
                      className +=
                        " bg-green-50 border-green-300 text-green-700";
                    } else {
                      className += " bg-gray-100 border-gray-300";
                    }
                    return (
                      <li key={idx} className={className}>
                        {opt}
                      </li>
                    );
                  })}
                </ul>

                {!isCorrect && (
                  <div className="text-sm text-red-600">
                    ❌ Your Answer: <strong>{userAns || "Not Answered"}</strong>
                    <br />✅ Correct Answer: <strong>{q.answer}</strong>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/quizzes")}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-500"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResultPage;
