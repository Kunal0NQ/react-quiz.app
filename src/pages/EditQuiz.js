import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import app from "../firebaseConfig";

const db = getFirestore(app);

const EditQuiz = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      const quizRef = doc(db, "quizzes", quizId);
      const quizSnap = await getDoc(quizRef);
      if (quizSnap.exists()) {
        setQuiz({ id: quizSnap.id, ...quizSnap.data() });
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index][field] = value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleAnswerChange = (qIndex, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[qIndex].answer = value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleSave = async () => {
    try {
      const quizRef = doc(db, "quizzes", quiz.id);
      await updateDoc(quizRef, quiz);
      alert("Quiz updated successfully!");
      navigate("/admin");
    } catch (error) {
      console.error("Error updating quiz:", error);
    }
  };

  if (!quiz) return <p>Loading quiz...</p>;

  return (
    <div>
      <h2>Edit Quiz</h2>
      <input type="text" value={quiz.title} onChange={(e) => setQuiz({ ...quiz, title: e.target.value })} />
      {quiz.questions.map((q, qIndex) => (
        <div key={qIndex}>
          <input type="text" value={q.question} onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)} />
          {q.options.map((opt, oIndex) => (
            <input key={oIndex} type="text" value={opt} onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} />
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
      <button onClick={handleSave}>✅ Save Changes</button>
    </div>
  );
};

export default EditQuiz;
