import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { HashLoader } from "react-spinners";


const QuizStartPage = () => {
  const { quizId } = useParams();
  const { state } = useLocation(); // Retrieve settings from QuizDetailPage
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(state?.enableTimer ? 30 : null); // Default 30s per question

  // Shuffle Function
  const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizDoc = doc(db, "quizzes", quizId);
        const snapshot = await getDoc(quizDoc);
        if (snapshot.exists()) {
          let quizData = snapshot.data();

          // Shuffle questions if enabled
          let shuffledQuestions = state?.shuffleQuestions
            ? shuffleArray(quizData.questions)
            : quizData.questions;

          // Shuffle options within each question if enabled
          if (state?.shuffleOptions) {
            shuffledQuestions = shuffledQuestions.map((q) => ({
              ...q,
              options: shuffleArray(q.options),
            }));
          }

          setQuiz(quizData);
          setLoading(false)
          setQuestions(shuffledQuestions);
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };

    fetchQuiz();
  }, [quizId, state]);

  // Timer functionality
  useEffect(() => {
    if (state?.enableTimer && timeLeft !== null) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, state]);

  // Handle Answer Selection
  const handleAnswerSelect = (option) => {
    setSelectedAnswers({ ...selectedAnswers, [currentIndex]: option });

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTimeLeft(state?.enableTimer ? 30 : null); // Reset timer for next question
    } else {
      // Ensure `quizId` exists before navigation
      if (quizId) {
        // navigate(`/quizzes/${quizId}/result`, { state: { selectedAnswers, quiz } });
        navigate(`/quizzes/${quizId}/result`, {
          state: {
            selectedAnswers: Object.values(selectedAnswers),
            questions,
            quizId,
            quizTitle: quiz?.title || "Untitled Quiz",
          },
        });
      } else {
        console.error("Quiz ID missing. Redirecting to /quizzes.");
        navigate("/quizzes"); // Fallback navigation
      }
    }
  };

  // Format remaining time
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <HashLoader
          color="#2563eb"
          loading={loading}
          height={15}
          width={5}
          radius={2}
          margin={2}
        />
      </div>
    );
  if (!quiz) return <p className="text-center mt-10 text-gray-500">No recent quizzes found.</p>;

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
        <p>Question {currentIndex + 1} of {questions.length}</p>
        {state?.enableTimer && <p className="text-red-500 font-semibold">⏱ {formatTime(timeLeft)}</p>}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-300 rounded-full mb-4">
        <div className="h-full bg-blue-600 rounded-full transition-all"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question */}
      <div className="bg-white  rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">{questions[currentIndex].question}</h2>

        {/* Options */}
        <div className="grid gap-3">
          {questions[currentIndex].options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswerSelect(opt)}
              className="w-full border px-4 py-2 text-left rounded-md bg-white hover:bg-blue-50 transition duration-200"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizStartPage;
