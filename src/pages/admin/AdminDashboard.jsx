import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
      <div className="max-w-4xl mx-auto mt-10 p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            to="/admin/approve"
            className="p-6 border rounded shadow hover:shadow-lg transition bg-white"
          >
            <h2 className="text-xl font-semibold">✅ Approve Quizzes</h2>
            <p className="text-gray-600 mt-2">
              Review quizzes submitted by users and approve or reject them.
            </p>
          </Link>

          <Link
            to="/admin/manage"
            className="p-6 border rounded shadow hover:shadow-lg transition bg-white"
          >
            <h2 className="text-xl font-semibold">📚 Manage Quizzes</h2>
            <p className="text-gray-600 mt-2">
              View all quizzes, approve, delete or analyze them.
            </p>
          </Link>

          {/* Optional: Add more features here later */}
          {/* <Link to="/admin/stats" className="...">Quiz Stats</Link> */}
        </div>
      </div>
   
  );
};

export default AdminDashboard;
