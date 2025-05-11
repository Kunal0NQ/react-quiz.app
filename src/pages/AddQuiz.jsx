// src/pages/AddQuiz.js

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createQuiz } from "../services/firestoreServices";
import { useAuth } from "../context/AuthContext";
import useToast from "../hooks/useToast";

const AddQuiz = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showSuccessToast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], answer: "" },
  ]);
  const [error, setError] = useState("");

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    if (field === "question" || field === "answer") {
      updated[index][field] = value;
    } else {
      updated[index].options[field] = value;
    }
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], answer: "" },
    ]);
  };

  const removeQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!title.trim() || questions.length === 0) {
      setError("Please enter title and at least one question.");
      return;
    }

    try {
      await createQuiz({
        title,
        description,
        questions,
        createdBy: user.uid,
        status: "pending", // send to admin for approval
        createdAt: new Date(),
      });

      showSuccessToast("Quiz submitted for approval!");
      navigate("/home");
    } catch (err) {
      setError("Failed to create quiz. " + err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 ">
      <div className="flex items-baseline justify-between border-b border-gray-200 pt-4 pb-4 mb-4 lg:mb-6 sm:px-4 ">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Add Quiz
        </h1>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6 mt-2">
        <div>
          <label className="block font-medium">Quiz Title</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Description (optional)</label>
          <textarea
            className="w-full border px-3 py-2 rounded-md"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Questions</h3>
          {questions.map((q, index) => (
            <div
              key={index}
              className="border p-4 rounded-md mb-4 bg-gray-50 space-y-3"
            >
              <div className="flex justify-between items-center">
                <label className="font-medium">Question {index + 1}</label>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              <input
                type="text"
                placeholder="Enter question"
                className="w-full border px-3 py-2 rounded-md"
                value={q.question}
                onChange={(e) =>
                  handleQuestionChange(index, "question", e.target.value)
                }
                required
              />

              <div className="grid grid-cols-2 gap-2">
                {q.options.map((opt, i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={`Option ${i + 1}`}
                    className="border px-3 py-2 rounded-md"
                    value={opt}
                    onChange={(e) =>
                      handleQuestionChange(index, i, e.target.value)
                    }
                    required
                  />
                ))}
              </div>

              <input
                type="text"
                placeholder="Correct answer (must match one of the options)"
                className="w-full border px-3 py-2 rounded-md"
                value={q.answer}
                onChange={(e) =>
                  handleQuestionChange(index, "answer", e.target.value)
                }
                required
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="text-indigo-600 hover:underline text-sm"
          >
            + Add another question
          </button>
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-indigo-500"
        >
          Submit Quiz
        </button>
      </form>
    </div>
  );
};

export default AddQuiz;
