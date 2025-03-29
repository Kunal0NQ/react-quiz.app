import { useLocation,  useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./style.css"
const Result = () => {
  const location = useLocation();
  const { selectedAnswers, questions } = location.state || {};
  const navigate = useNavigate();
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (selectedAnswers && questions) {
      let correctCount = 0;
      questions.forEach((q, index) => {
        if (selectedAnswers[index] === q.answer) {
          correctCount++;
        }
      });
      setScore(correctCount);
    }
  }, [selectedAnswers, questions]);

  return (
    <div className="container">
      <h2>Quiz Result</h2>
      <p>Score: {score} / {questions?.length || 0}</p>

      <h3>Review Your Answers</h3>
      {questions?.map((q, index) => (
        <div key={index} style={{ marginBottom: "15px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
          <p><strong>Q{index + 1}: {q.question}</strong></p>
          <p>
            <span style={{ color: selectedAnswers[index] === q.answer ? "green" : "red" }}>
              Your Answer: {selectedAnswers[index] || "Not Answered"}
            </span>
          </p>
          {selectedAnswers[index] !== q.answer && (
            <p style={{ color: "green" }}>✅ Correct Answer: {q.answer}</p>
          )}
        </div>
      ))}

      <button onClick={() => navigate("/")}>Go to Home</button>
    </div>
  );
};

export default Result;
