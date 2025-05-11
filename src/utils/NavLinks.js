import { CiSquarePlus, CiSquareQuestion, CiUser } from "react-icons/ci";
import { HiOutlineHome } from "react-icons/hi";
import { FiUpload } from "react-icons/fi"

export const NavLinks = (user) => [
    { label: "Home", href:"/", icon: <HiOutlineHome className="border border-gray-400 rounded p-4" /> },
    { label: "Quizzes", href:"/quizzes", icon: <CiSquareQuestion /> },
    { label: "Topics", href:"/topics", icon: <CiSquareQuestion /> },
    { label: "Create Quiz", href:"/create-quiz", icon: <CiSquarePlus /> },
    { label: "Upload Quizzes", href: "/upload-quiz", icon: <FiUpload /> },
    { label: "My Quizzes", href: user ? `/${user.username}/my-quizzes` : "/login", icon: <FiUpload /> },
]

