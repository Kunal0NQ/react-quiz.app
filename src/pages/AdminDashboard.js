import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import app from "../firebaseConfig";
import Container from "../components/Container";

const db = getFirestore(app);

const AdminDashboard = ({ onLogout }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch quizzes from Firebase
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "quizzes"));
        const quizList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuizzes(quizList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };
    fetchQuizzes();
  }, []);

  // Delete quiz
  const handleDelete = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await deleteDoc(doc(db, "quizzes", quizId));
      setQuizzes(quizzes.filter(quiz => quiz.id !== quizId));
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  if (loading) return <p>Loading quizzes...</p>;
  const styles = {
    dashboardContainer: {
      padding: "1em",
    },
  }
  return (
    <Container>
      <div style={styles.dashboardContainer} >
        <h2>Admin Dashboard</h2>
        <button onClick={onLogout} style={{ padding: "15px", marginBottom: "1em", marginTop: "10px", cursor: "pointer" }}>
          Logout
        </button>
        <button style={{ padding: "15px", marginBottom: "1em" }} onClick={() => navigate("/admin/add-quiz")}>Add New Quiz</button>
        <button style={{ padding: "15px", marginBottom: "1em" }} onClick={() => navigate("/admin/uploadquizes")}>Upload Quizzes JSON</button>

        <ul style={{ listStyle: "none", marginTop: "1em" }} >
          {quizzes.map((quiz) => (
            <li key={quiz.id}>
              <p style={{ marginTop: "1em", marginBottom: "1em" }}><strong >{quiz.title}</strong></p>

              <button style={{ padding: "15px", marginBottom: "1em" }} onClick={() => navigate(`/edit-quiz/${quiz.id}`)}>Edit</button>
              <button style={{ padding: "15px", marginBottom: "1em" }} onClick={() => handleDelete(quiz.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
};

export default AdminDashboard;
