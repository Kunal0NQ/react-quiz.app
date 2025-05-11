import React, { useEffect, useState } from "react";
import { getApprovedQuizzes } from "../services/firestoreServices";
import QuizList from "../components/QuizList"


const QuizPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const data = await getApprovedQuizzes();
        setQuizzes(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchDocument();
  }, []);

 

  return (
    <>
      <div className="flex items-baseline justify-between border-b border-gray-200 pt-7 pb-6 sm:px-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          All Available quizzes
        </h1>
      </div>
        {error && <p className="text-red-500 text-sm mx-auto text-center my-2">{error}</p>}
      <QuizList items={quizzes} />
    </>
  );
};

export default QuizPage;
