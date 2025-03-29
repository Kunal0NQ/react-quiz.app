import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import app from "../firebaseConfig";
import { toast } from "sonner";

const db = getFirestore(app);

const AddQuiz = () => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([{ question: "", options: ["", "", "", ""], answer: "" }]);
  const navigate = useNavigate();

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleAnswerChange = (qIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].answer = value;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, "quizzes"), { title, questions });
      toast.success("Quiz added sucessfully!")
      navigate("/admin");
    } catch (error) {
      // console.error("Error adding quiz:", error);
    }
  };

  return (
    <div>
      <h2>Add New Quiz</h2>
      <input type="text" placeholder="Quiz Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      {questions.map((q, qIndex) => (
        <div key={qIndex}>
          <input type="text" placeholder="Question" value={q.question} onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)} />
          {q.options.map((opt, oIndex) => (
            <input key={oIndex} type="text" placeholder={`Option ${oIndex + 1}`} value={opt} onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} />
          ))}
          <label>Select Correct Answer:</label>
          <select value={q.answer} onChange={(e) => handleAnswerChange(qIndex, e.target.value)}>
            <option value="">Select</option>
            {q.options.map((opt, oIndex) => (
              <option key={oIndex} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      ))}
      <button onClick={() => setQuestions([...questions, { question: "", options: ["", "", "", ""], answer: "" }])}>➕ Add Question</button>
      <button onClick={handleSubmit}>✅ Save Quiz</button>
    </div>
  );
};

export default AddQuiz;
