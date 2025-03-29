import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "./firebaseConfig";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import AdminDashboard from "./pages/AdminDashboard";
import UploadQuizes from "./pages/UploadQuizes";
import AddQuiz from "./pages/AddQuiz";
import EditQuiz from "./pages/EditQuiz";
import Signup from "./pages/Signup"
import { Toaster } from "sonner";
import NotFound from "./pages/NotFound";

const auth = getAuth(app);
const db = getFirestore(app);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizAttempts, setQuizAttempts] = useState([]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (!userData.role) {
            console.error("User role not found");
            setUser(null); // Prevents login without a role
          } else {
            setUser({ uid: user.uid, email: user.email, role: userData.role });
          }
        } else {
          console.error("User document not found in Firestore");
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setQuizAttempts([]); // Clear quiz attempts
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Toaster position="top-right" /> {/* Global toast container */}
      <Router>
        <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} />
          <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} onLogout={handleLogout} quizAttempts={quizAttempts} setQuizAttempts={setQuizAttempts} /> : <Navigate to="/" />} />
          {/* <Route path="/dashboard" element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />} /> */}
          <Route path="/quiz/:quizId" element={user ? <Quiz /> : <Navigate to="/" />} />
          <Route path="/result/:quizId" element={user ? <Result /> : <Navigate to="/" />} />

          {/* Admin Routes */}
          <Route path="/admin" element={user?.role === "admin" ? <AdminDashboard onLogout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="/admin/uploadquizes" element={user?.role === "admin" ? <UploadQuizes /> : <Navigate to="/" />} />
          <Route path="/admin/add-quiz" element={user?.role === "admin" ? <AddQuiz /> : <Navigate to="/" />} />
          <Route path="/edit-quiz/:quizId" element={user?.role === "admin" ? <EditQuiz /> : <Navigate to="/" />} />
        
          {/* 404 Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
