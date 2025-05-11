import React from "react";
import { Link } from "react-router-dom";
import { IoCreateOutline } from "react-icons/io5";
import { CiSquarePlus } from "react-icons/ci";
import { useAuth } from "../context/AuthContext";
import RecentQuizzes from "../components/RecentQuizzes";


const Home = () => {
  const { user } = useAuth();
  
  return (
    <>
      <div className="flex items-baseline justify-between border-b border-gray-200 pt-7 pb-6 sm:px-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {user ? (
            <p> Welcome, {user.username || user.email}</p>
          ) : (
            <p> Welcome, Guest</p>
          )}
        </h1>
      </div>


      <div className="py-4 max-w-3xl mx-auto ">
        <ul className="divide-y divide-gray-100">
          <li className="flex justify-between gap-x-6 py-5">
            <Link to="/create-quiz" className="flex min-w-0 gap-x-4">
              <CiSquarePlus
                className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-50"
                aria-hidden="true"
              />

              <div className="min-w-0 flex-auto">
                <p className="text-sm/6 font-semibold text-gray-900">
                  Create Quiz
                </p>
                <p className="mt-1 truncate text-xs/5 text-gray-500">
                  Create your own quiz!
                </p>
              </div>
            </Link>
          </li>
          <li className="flex justify-between gap-x-6 py-5">
            <Link to="/quizzes" className="flex min-w-0 gap-x-4">
              <IoCreateOutline
                className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-50"
                aria-hidden="true"
              />

              <div className="min-w-0 flex-auto">
                <p className="text-sm/6 font-semibold text-gray-900">
                  Take a Quiz!
                </p>
                <p className="mt-1 truncate text-xs/5 text-gray-500">
                  Click here to take a quiz.
                </p>
              </div>
            </Link>
          </li>
        </ul>

        <RecentQuizzes />
      </div>
    </>
  );
};

export default Home;
