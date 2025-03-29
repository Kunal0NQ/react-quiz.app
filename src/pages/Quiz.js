import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import app from "../firebaseConfig";
import { toast } from "sonner";
import { formatDate } from "../utils/functions";

const auth = getAuth(app);
const db = getFirestore(app);

const Quiz = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizRef = doc(db, "quizzes", quizId);
        const quizSnap = await getDoc(quizRef);
        if (quizSnap.exists()) {
          setQuiz(quizSnap.data());
        } else {
          setError("Quiz not found.");
        }
      } catch (err) {
        setError("Error fetching quiz. Please try again.");
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleAnswerSelect = (questionIndex, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));
  };

  const handleSubmit = async () => {
    if (!quiz || Object.keys(selectedAnswers).length < quiz.questions.length) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    let correctCount = 0;
    quiz.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.answer) {
        correctCount++;
      }
    });

    const user = auth.currentUser;
    if (!user) {
      toast.error("User not logged in.");
      return;
    }

    try {
     
      await addDoc(collection(db, "quizAttempts"), {
        userId: user.uid,
        title: quiz.title,
        score: correctCount,
        total: quiz.questions.length,
        date: formatDate(new Date()), 
      });

      navigate(`/result/${quizId}`, { state: { selectedAnswers, questions: quiz.questions, score: correctCount } });
    } catch (error) {
      toast.error("Failed to save quiz attempt.");
    }
  };

  if (error) return <p>{error}</p>;
  if (!quiz) return <p>Loading quiz...</p>;

  const styles = {
    container: {
      maxWidth: "600px",
      margin: "5px auto 5px auto",// Reduced gap above the container
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      height: "83vh",
      overflow: "hidden", // Prevents extra scrolling
    },
    titleContainer: {
      position: "sticky",
      top: 0,
      background: "white",
      padding: "15px 0",
      fontSize: "22px",
      fontWeight: "bold",
      borderBottom: "1px solid #ddd",
      zIndex: 10,
    },
    quizContainer: {
      flexGrow: 1,
      overflowY: "auto",
      padding: "10px 20px", // Reduced padding to optimize spacing
      textAlign: "left",
    },
    submitBtnContainer: {
      position: "sticky",
      bottom: 0,
      background: "white",
      padding: "10px",
      boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
    },
    submitBtn: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#21bf73",
      color: "white",
      border: "none",
      borderRadius: "5px",
      fontSize: "18px",
      cursor: "pointer",
      transition: "background 0.3s ease-in-out",
    },
    submitBtnHover: {
      backgroundColor: "#1aa360",
    },
    questionBlock: {
      marginBottom: "15px",
    },
    questionText: {
      fontSize: "18px",
      fontWeight: "bold",
    },
    optionLabel: {
      display: "flex",
      alignItems: "center",
      marginBottom: "10px",
      fontSize: "16px",
      cursor: "pointer",
      gap: "10px", 
    },
    checkmark: {
      minWidth: "20px", // Ensures size consistency
      minHeight: "20px",
      width: "20px",
      height: "20px",
      backgroundColor: "#555",
      border: "1px solid #ddd",
      borderRadius: "50%",
      marginRight: "10px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      transition: "background 300ms ease-in-out",
    },
    checkmarkChecked: {
      backgroundColor: "#21bf73",
    },
    checkmarkInner: {
      width: "10px",
      height: "10px",
      backgroundColor: "white",
      borderRadius: "50%",
      transform: "scale(0)",
      transition: "300ms ease-in-out",
    },
    checkmarkInnerChecked: {
      transform: "scale(1)",
    },
      // Responsive styles for smaller screens
  "@media (max-width: 480px)": {
    optionLabel: {
      fontSize: "14px",
      gap: "8px",
      flexWrap: "nowrap",
    },
    checkmark: {
      minWidth: "18px",
      minHeight: "18px",
    },
  },
  };

  return (
    <div style={styles.container}>
      {/* Sticky Title */}
      <div style={styles.titleContainer}>{quiz.title}</div>

      {/* Scrollable Questions */}
      <div style={styles.quizContainer}>
        {quiz.questions.map((q, index) => (
          <div key={index} style={styles.questionBlock}>
            <p style={styles.questionText}>{index + 1}. {q.question}</p>
            {q.options.map((option, i) => (
              <label key={i} style={styles.optionLabel}>
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option}
                  checked={selectedAnswers[index] === option}
                  onChange={() => handleAnswerSelect(index, option)}
                  style={{ opacity: 0, position: "absolute", appearance: "none" }}
                />
                <span style={selectedAnswers[index] === option ? { ...styles.checkmark, ...styles.checkmarkChecked } : styles.checkmark}>
                  <span style={selectedAnswers[index] === option ? styles.checkmarkInnerChecked : styles.checkmarkInner}></span>
                </span>
                {option}
              </label>
            ))}
          </div>
        ))}
      </div>

      {/* Sticky Submit Button */}
      <div style={styles.submitBtnContainer}>
        <button
          style={styles.submitBtn}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.submitBtnHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.submitBtn.backgroundColor)}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Quiz;
