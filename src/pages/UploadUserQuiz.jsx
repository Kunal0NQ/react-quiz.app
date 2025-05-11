// src/pages/UploadUserQuiz.js

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createQuiz } from "../services/firestoreServices";
import useToast from "../hooks/useToast";

const UploadUserQuiz = () => {
  const { user } = useAuth();
  const { showSuccessToast } = useToast();
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUpload = async () => {
    setError("");
    setSuccess("");

    try {
      const quiz = JSON.parse(jsonInput.trim());

      if (
        !quiz.title ||
        !Array.isArray(quiz.questions) ||
        quiz.questions.length === 0
      ) {
        throw new Error("Invalid format. Please include title and questions.");
      }

      await createQuiz({
        ...quiz,
        createdBy: user.uid,
        status: "pending", // Must be approved by admin
        createdAt: new Date(),
      });

      showSuccessToast("✅ Quiz submitted successfully for approval.");
      setSuccess("✅ Quiz submitted successfully for approval.");
      setJsonInput("");
    } catch (err) {
      setError("❌ Invalid JSON: " + err.message);
    }
  };

  const exampleJson = {
    title: "Sample Quiz",
    description: "This is a sample quiz about basic knowledge.",
    questions: [
      {
        question: "What is the capital of France?",
        options: ["Paris", "Berlin", "Rome", "London"],
        answer: "Paris",
      },
      {
        question: "2 + 2 equals to?",
        options: ["3", "4", "5", "22"],
        answer: "4",
      },
    ],
  };

  return (
    <div className="w-full ">
      <div className="max-w-3xl mx-auto p-6 bg-white ">
      <div typeof="label" className="flex items-baseline justify-between border-b border-gray-200 pt-4 pb-6 sm:px-4 lg:pt-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Submit Your Quiz <span className="text-lg/6">(Paste JSON)</span>
        </h1>
      </div>
       

       
        <textarea
          rows={10}
          className="w-full border px-4 py-2 font-mono text-sm rounded-md focus:outline-indigo-500"
          placeholder="Paste your JSON quiz set here..."
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
        ></textarea>

        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        {success && <p className="text-green-600 mt-2 text-sm">{success}</p>}

        <button
          onClick={handleUpload}
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
        >
          Submit Quiz
        </button>

        <div className="mt-8 bg-gray-50 p-4 rounded border border-gray-200">
          <h3 className="text-md font-semibold mb-2 text-gray-700">
            📄 JSON Format Example:
          </h3>
          <pre className="text-sm bg-gray-100 p-3 rounded overflow-x-auto text-gray-800">
            {JSON.stringify(exampleJson, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default UploadUserQuiz;
