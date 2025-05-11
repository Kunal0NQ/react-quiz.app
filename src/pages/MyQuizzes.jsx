import { useEffect, useState } from "react";
import { getQuizzesByUser } from "../services/firestoreServices";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const MyQuizzes = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyQuizzes = async () => {
      if (user?.uid) {
        const data = await getQuizzesByUser(user.uid);
        setQuizzes(data);
        setLoading(false);
      }
    };

    fetchMyQuizzes();
  }, [user]);

  if (loading) return <div className="text-center mt-10">Loading your quizzes...</div>;

  return (
  
        <div className="max-w-3xl mx-auto py-4">
        <h2 className="text-2xl font-bold mb-6">My Quiz Sets</h2>

        {quizzes.length === 0 ? (
            <p>No quizzes created yet.</p>
        ) : (
            <ul className="space-y-4">
            {quizzes.map((quiz) => (
                <li key={quiz.id} className="border rounded-md p-4 bg-white shadow">
                <div className="flex justify-between items-center">
                    <div>
                    <h3 className="text-lg font-semibold">{quiz.title}</h3>
                    <p className="text-sm text-gray-600">Status: {quiz.status}</p>
                    </div>
                    <Link
                    to={`/quiz/${quiz.id}`}
                    className="text-indigo-600 hover:underline text-sm"
                    >
                    View
                    </Link>
                </div>
                </li>
            ))}
            </ul>
        )}
        </div>
    
  );
};

export default MyQuizzes;
