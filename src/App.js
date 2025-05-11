import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ToastProvider from "./components/Toasts/ToastProvider";
import NavLayout from "./components/NavLayout";
import PrivateRoute from "./components/PrivateRoute";
import AuthPage from "./components/AuthPage";
import UserProfile from "./components/UserProfile";
import QuizDetailPage from "./components/QuizDetailPage";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageQuizzes from "./pages/admin/ManageQuizzes";
import ApproveQuizzes from "./pages/admin/ApproveQuizzes";
import UploadQuiz from "./pages/admin/UploadQuiz";
import Home from "./pages/Home";
import QuizPage from "./pages/QuizPage";
import TopicPage from "./pages/TopicPage";
import TopicDetail from "./components/TopicDetail";
import QuizStartPage from "./components/QuizStartPage";
import QuizResultPage from "./components/QuizResultPage";
import AddQuiz from "./pages/AddQuiz";
import MyQuizzes from "./pages/MyQuizzes";
import UploadUserQuiz from "./pages/UploadUserQuiz"
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to={user ? "/home" : "/login"} />} />
      <Route path="/login" element={!user ? <AuthPage /> : <Navigate to="/home" />} />
     

      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
    
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path=":username/profile"      element={<UserProfile />} />
        <Route path=":username/my-quizzes"   element={<MyQuizzes />} /> 
        <Route path="quizzes"                element={<QuizPage />} /> 
        <Route path="quizzes/:quizId"        element={<QuizDetailPage />} /> 
        <Route path="topics" element={<TopicPage />} />
        <Route path="topic/:topicId"         element={<TopicDetail />} />
         
      </Route>

      
      <Route path="/" element={<PrivateRoute><NavLayout /></PrivateRoute>}>
        <Route path="quizzes/:quizId/start"  element={<QuizStartPage />} />
        <Route path="quizzes/:quizId/result" element={<QuizResultPage />} />
        <Route path="/create-quiz"           element={<AddQuiz />}/>
        <Route path="/upload-quiz"           element={<UploadUserQuiz />}/>
      </Route>

  
      <Route path="/admin" element={<AdminRoute> <AdminLayout /> </AdminRoute> } >

        <Route index  element={<Navigate to="dashboard" />} />

        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="upload"    element={<UploadQuiz />} />
        <Route path="approve"   element={<ApproveQuizzes />} />
        <Route path="manage"    element={<ManageQuizzes />} />

      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
      <Route path="/unauthorized"
        element={
          <h2 className="text-center mt-10 text-xl text-red-600">
            403 – Not Authorized
          </h2>
        }
      />
    </Routes>
  );
}

const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
