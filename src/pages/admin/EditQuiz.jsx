import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuizById, updateQuiz } from "../../services/quizService";

const EditQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      const data = await getQuizById(quizId);
      setQuiz(data);
      setLoading(false);
    };

    fetchQuiz();
  }, [quizId]);

  const handleChange = (index, field, value) => {
    const updated = [...quiz.questions];
    if (field === "question" || field === "answer") {
      updated[index][field] = value;
    } else {
      updated[index].options[field] = value;
    }
    setQuiz({ ...quiz, questions: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateQuiz(quizId, quiz);
      alert("Quiz updated successfully");
      navigate("/admin/manage");
    } catch (err) {
      setError("Failed to update quiz: " + err.message);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Quiz</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium">Title</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={quiz.title}
            onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            value={quiz.description}
            onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
          />
        </div>

        <div className="space-y-4">
          {quiz.questions.map((q, index) => (
            <div key={index} className="border p-4 rounded bg-gray-50 space-y-2">
              <input
                className="w-full border px-2 py-1 rounded"
                value={q.question}
                onChange={(e) => handleChange(index, "question", e.target.value)}
              />

              <div className="grid grid-cols-2 gap-2">
                {q.options.map((opt, i) => (
                  <input
                    key={i}
                    className="border px-2 py-1 rounded"
                    value={opt}
                    onChange={(e) => handleChange(index, i, e.target.value)}
                  />
                ))}
              </div>

              <input
                className="w-full border px-2 py-1 rounded"
                placeholder="Correct answer"
                value={q.answer}
                onChange={(e) => handleChange(index, "answer", e.target.value)}
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditQuiz;
