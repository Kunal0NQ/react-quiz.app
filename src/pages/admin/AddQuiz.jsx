// src/pages/admin/AddQuiz.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createQuiz } from "../../services/firestoreServices"; // Firebase function to create quiz
import Navbar from "../../components/Navbar"; // Assuming you have a Navbar component
const AddQuiz = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([{ question: "", options: [], answer: "" }]);
  const [status, setStatus] = useState("Pending");

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const quizData = { title, questions, status };
    await createQuiz(quizData); // Firebase function to create quiz in Firestore
    navigate("/admin/dashboard");
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4">Add New Quiz</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Quiz Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {questions.map((q, idx) => (
            <div key={idx} className="mb-4">
              <label className="block text-sm font-semibold mb-1">Question {idx + 1}</label>
              <input
                type="text"
                value={q.question}
                onChange={(e) => handleQuestionChange(idx, "question", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
                required
              />
              <input
                type="text"
                value={q.options.join(",")}
                onChange={(e) => handleQuestionChange(idx, "options", e.target.value.split(","))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
                placeholder="Comma separated options"
                required
              />
              <input
                type="text"
                value={q.answer}
                onChange={(e) => handleQuestionChange(idx, "answer", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Correct answer"
                required
              />
            </div>
          ))}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl"
          >
            Save Quiz
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddQuiz;
