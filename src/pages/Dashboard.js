import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import app from "../firebaseConfig";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import Container from "../components/Container";
import "./style.css";

const db = getFirestore(app);

const fetchUserAttempts = async (userId) => {
  if (!userId) return [];
  
  const attemptsRef = collection(db, "quizAttempts");
  const q = query(attemptsRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => doc.data());
};

const Dashboard = ({ user, onLogout, quizAttempts, setQuizAttempts }) => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  // Fetch user quiz attempts
  useEffect(() => {
    if (!user) return;

    const fetchAttempts = async () => {
      try {
        const attemptsData = await fetchUserAttempts(user.uid);
        setQuizAttempts(attemptsData);
      } catch (error) {
        console.error("Error fetching quiz attempts:", error);
      }
    };

    fetchAttempts();
  }, [user, setQuizAttempts]);

  // Fetch quizzes only if quizzes list is empty
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const quizCollection = await getDocs(collection(db, "quizzes"));
        setQuizzes(quizCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    if (quizzes.length === 0) fetchQuizzes();
  }, [quizzes.length]);

  const handleLogout = () => {
    onLogout();
    toast.success("Logged out successfully!");
  };

  return (
    <Container>
      <div className="dashboard-container" >
        {user && <h2>WELCOME, {user.email.replace("@gmail.com", "")}</h2>}
        <p className="dashboard-title" style={{ marginBottom: "30px", marginTop: "5px" }}>
          Select a topic below to start your Quiz
        </p>

        {/* Quiz Selection */}
        <div className="quiz-grid" style={{ gap: "25px", marginBottom: "30px" }}>
          {quizzes.map((quiz) => (
            <button
              key={quiz.id}
              onClick={() => navigate(`/quiz/${quiz.id}`)}
              className="quiz-button"
              style={{ padding: "18px", marginBottom: "1em" }}
            >
              {quiz.title}
            </button>
          ))}
        </div>

        {/* Recent Quiz Attempts */}
        <div>
          <h3>Recent Quiz Attempts</h3>
          {quizAttempts.length === 0 ? (
            <p>No recent quizzes attempted.</p>
          ) : (
            <ul style={{ listStyle: "none" }}>
              {quizAttempts.map((quiz, index) => (
                <li key={index}>
                  {quiz.quizTitle} - Score: {quiz.score}/{quiz.total}
                  <span style={{ fontSize: "12px", color: "gray", marginLeft: "10px" }}>
                    ({quiz.date})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="logout-button"
          style={{ marginTop: "30px", padding: "14px 28px" }}
        >
          Logout
        </button>
      </div>
    </Container>
  );
};

export default Dashboard;
