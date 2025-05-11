import React from 'react'
import Navbar from "./Navbar"
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Outlet } from "react-router";


const Layout = () => {
    const { user } = useAuth();

    return (
        <div className="bg-white">
            <div>
                <Navbar />


                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                   
                    <section aria-labelledby="products-heading" className="pt-6 pb-24">
                        <h2 id="products-heading" className="sr-only">Products</h2>

                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                            {/* <!-- Filters --> */}
                            <form className="hidden lg:block lg:shadow lg:p-3">
                                <ul className="flex-col gap-1 flex">
                                    {user?.role === "admin" && (
                                        <li>
                                            <Link to="/admin">
                                                <div className="flex-col flex p-3 bg-white rounded-lg">
                                                    <div className="h-5 gap-3 flex">
                                                        <div className="relative">
                                                            {/* Home Icon */}
                                                        </div>
                                                        <h2 className="text-gray-500 text-sm font-medium leading-snug">Dashboard</h2>
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>

                                    )}

                                    <li>
                                        <Link to="/">
                                            <div className="flex-col flex p-3 bg-white rounded-lg">
                                                <div className="h-5 gap-3 flex">
                                                    <div className="relative">
                                                        {/* Home Icon */}
                                                    </div>
                                                    <h2 className="text-gray-500 text-sm font-medium leading-snug">Home</h2>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
<li>
                                        <Link to="/topics">
                                            <div className="flex-col flex p-3 bg-white rounded-lg">
                                                <div className="h-5 gap-3 flex">
                                                    <div className="relative">
                                                        {/* Home Icon */}
                                                    </div>
                                                    <h2 className="text-gray-500 text-sm font-medium leading-snug">Topics</h2>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to="/quizzes">
                                            <div className="flex-col flex p-3 bg-white rounded-lg">
                                                <div className="h-5 gap-3 flex">
                                                    <div className="relative">
                                                        {/* Home Icon */}
                                                    </div>
                                                    <h2 className="text-gray-500 text-sm font-medium leading-snug">Quizzes</h2>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/create-quiz">
                                            <div className="flex-col flex p-3 bg-white rounded-lg">
                                                <div className="h-5 gap-3 flex">
                                                    <div className="relative">
                                                        {/* Home Icon */}
                                                    </div>
                                                    <h2 className="text-gray-500 text-sm font-medium leading-snug">Create Quiz</h2>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                    {user && (
                                        <li>
                                            <Link to={`/upload-quiz`}>
                                                <div className="flex-col flex p-3 bg-white rounded-lg">
                                                    <div className="h-5 gap-3 flex">
                                                        <div className="relative">
                                                            {/* Home Icon */}
                                                        </div>
                                                        <h2 className="text-gray-500 text-sm font-medium leading-snug">Upload Quiz</h2>
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                    )}
                                    {user && (
                                        <li>
                                            <Link to={`/${user.username}/my-quizzes`}>
                                                <div className="flex-col flex p-3 bg-white rounded-lg">
                                                    <div className="h-5 gap-3 flex">
                                                        <div className="relative">
                                                            {/* Home Icon */}
                                                        </div>
                                                        <h2 className="text-gray-500 text-sm font-medium leading-snug">My Quizzes</h2>
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            </form>

                            {/* <!-- Product grid --> */}
                            <div className="lg:col-span-3 lg:shadow lg:p-3 sm:min-h-screen">
                                {/* <!-- Your content --> */}
                                <Outlet />
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>

    )
}

export default Layout