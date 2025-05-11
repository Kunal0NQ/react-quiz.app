import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase"; // Ensure correct Firebase import
import { Link } from "react-router-dom";
import { HashLoader } from "react-spinners";

const QuizListPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const approvedQuizzesQuery = query(
          collection(db, "quizzes"),
          where("status", "==", "approved")
        );
        const snapshot = await getDocs(approvedQuizzesQuery);
        const quizData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuizzes(quizData);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

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

  return (
    <div className="py-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Available Quizzes</h1>
      <div className="grid gap-4">
        {quizzes.length > 0 ? (
          <ul>
            {quizzes.map((quiz) => (
              <Link
                to={`/quizzes/${quiz.id}`}
                key={quiz.id}
                className="p-4 bg-white rounded shadow cursor-pointer hover:bg-gray-50"
              >
                <h2 className="text-xl font-semibold">{quiz.title}</h2>
                <p className="text-gray-600">{quiz.description}</p>
              </Link>
            ))}
          </ul>
        ) : (
          <p>No approved quizzes available.</p>
        )}
      </div>
    </div>
  );
};

export default QuizListPage;
