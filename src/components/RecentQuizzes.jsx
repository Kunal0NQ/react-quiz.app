import { useEffect, useState } from "react";
import { getRecentQuizzes } from "../services/firestoreServices";
import { getAuth } from "firebase/auth";
import { HashLoader } from "react-spinners";

const RecentQuizzes = () => {
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setRecentQuizzes([]);
      setLoading(false);
      return;
    }

    getRecentQuizzes(user.uid).then((quizzes) => {
      setRecentQuizzes(quizzes);
      setLoading(false);
    });
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <HashLoader
          color="#2563eb"
          loading={loading}
          height={15}
          width={5}
          radius={2}
          margin={2}
        />
      </div>
    );
  if (recentQuizzes.length === 0)
    return (
      <div class="px-4 py-6">
        <div class="text-md/6 text-gray-600 mb-2 mt-2">
          No recent quizzes found.
        </div>
      </div>
    );

  return (
    <div className=" max-w-3xl mx-auto mt-4">
      <h2 className="text-xl font-bold mb-3">Recent Quizzes</h2>
      <ul className="divide-y divide-gray-100">
        {recentQuizzes.map((quiz, index) => (
          <li key={index} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <div className="min-w-0 flex-auto">
                <p className="text-md/6 font-semibold text-gray-900">
                  {quiz.title}
                </p>
                <p className="mt-1 truncate text-xs/5 text-gray-500">
                  {quiz.createdAt}
                </p>
              </div>
            </div>
            <div className="shrink-0 sm:flex sm:flex-col sm:items-end">
              <p className="text-md/6 text-gray-900">
                {quiz.score}/{quiz.totalQuiz}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentQuizzes;
