import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { HashLoader } from "react-spinners";
import { HiXMark } from "react-icons/hi2";

const QuizDetailPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [modalOpen, setModalOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [shuffleOptions, setShuffleOptions] = useState(false);
  const [enableTimer, setEnableTimer] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizDoc = doc(db, "quizzes", quizId);
        const snapshot = await getDoc(quizDoc);
        if (snapshot.exists()) {
          setQuiz(snapshot.data());
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleStartQuiz = () => {
    navigate(`/quizzes/${quizId}/start`, {
      state: { shuffleQuestions, shuffleOptions, enableTimer },
    });
  };
  const handleClick = () => {
    setModalOpen(false);
    navigate("/quizzes");
  };

  if (loading) {
    return (
      <div className="flex items-center align-middle justify-center min-h-screen bg-gray-50">
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
  }

  return (
    <div className="w-full relative">
      {/* Quiz Modal */}
      {modalOpen && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center bg-black/50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4">
              <h4 className="text-lg font-semibold">{quiz.title}</h4>
              <button onClick={handleClick}>
                <HiXMark className="size-6" />
              </button>
            </div>

            {/* Quiz Details */}
            <p className="text-gray-600">{quiz.description}</p>
            <p className="text-sm text-gray-600">
              Total Questions: {quiz.questions.length}
            </p>

            {/* Settings Options */}
            <div className="mt-4 space-y-3">
              {/* Shuffle Questions */}
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={shuffleQuestions}
                    onChange={() => setShuffleQuestions(!shuffleQuestions)}
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-checked:bg-indigo-600 rounded-full transition peer-checked:after:translate-x-full after:absolute after:left-1 after:top-[0.17rem] after:bg-white after:h-4 after:w-4 after:rounded-full"></div>
                </label>
                Shuffle Questions
              </div>
             
              {/* Shuffle Options */}
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={shuffleOptions}
                    onChange={() => setShuffleOptions(!shuffleOptions)}
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-checked:bg-indigo-600 rounded-full transition peer-checked:after:translate-x-full after:absolute after:left-1 after:top-[0.17rem] after:bg-white after:h-4 after:w-4 after:rounded-full"></div>
                </label>
                Shuffle Options
              </div>

              {/* Enable Timer */}
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={enableTimer}
                    onChange={() => setEnableTimer(!enableTimer)}
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-checked:bg-indigo-600 rounded-full transition peer-checked:after:translate-x-full after:absolute after:left-1 after:top-[0.17rem] after:bg-white after:h-4 after:w-4 after:rounded-full"></div>
                </label>
                Enable Timer
              </div>
            </div>

            {/* Start Quiz Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleStartQuiz}
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow hover:bg-indigo-700"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizDetailPage;
