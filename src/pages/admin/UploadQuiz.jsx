import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { createQuiz } from "../../services/firestoreServices";

const UploadQuiz = () => {
  const { user } = useAuth();
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUpload = async () => {
    setError("");
    setSuccess("");

    try {
      const quiz = JSON.parse(jsonInput.trim());

      // ✅ Basic validation
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
        status: "pending",
        createdAt: new Date(),
      });

      setSuccess("Quiz uploaded successfully!");
      setJsonInput("");
    } catch (err) {
      console.error(err);
      setError("Invalid JSON or structure: " + err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Paste JSON Quiz Set</h2>

      <textarea
        rows={10}
        className="w-full border rounded p-3 font-mono text-sm"
        placeholder="Paste your quiz JSON here..."
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
      ></textarea>

      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      {success && <p className="text-green-600 mt-2 text-sm">{success}</p>}

      <button
        onClick={handleUpload}
        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
      >
        Upload Quiz
      </button>
    </div>
  );
};

export default UploadQuiz;
