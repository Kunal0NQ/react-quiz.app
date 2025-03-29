import { useState, useEffect } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../firebaseConfig";
import { toast } from "sonner";

const db = getFirestore(app);
const auth = getAuth(app);

const UploadQuizes = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  // Check if user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleUpload = async () => {
   
    if (!user) {
      toast.error("You must be logged in as an admin to upload quizzes.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const quizData = JSON.parse(jsonInput);

      // Validate JSON structure
      if (!quizData.title || !quizData.description || !Array.isArray(quizData.questions)) {
        throw new Error("Invalid JSON format! Ensure it includes title, description, and questions.");
      }

      // Validate each question
      quizData.questions.forEach((q, index) => {
        if (!q.question || !q.answer || !Array.isArray(q.options) || q.options.length < 2) {
          throw new Error(`Error in question ${index + 1}: Ensure question, answer, and options are present.`);
        }
      });

      // Upload to Firestore
      await addDoc(collection(db, "quizzes"), quizData);
      toast.success("Quiz uploaded successfully!");
      setJsonInput(""); // Clear input

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <h2>Unauthorized: Admins Only</h2>;
  }

  return (
    <div>
      <h2>Upload New Quiz</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <textarea
        rows="10"
        cols="50"
        placeholder="Paste JSON here"
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
      />
      <br />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload Quiz"}
      </button>
    </div>
  );
};

export default UploadQuizes;
