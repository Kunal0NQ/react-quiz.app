import { CiSquareCheck } from "react-icons/ci";
import { HiOutlineHome } from "react-icons/hi";
import { FaRegEdit } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";

export const AdminNavLinks = (user) => [
  {
    label: "Dashboard",
    href: "/",
    icon: <HiOutlineHome className="border border-gray-400 rounded p-4" />,
  },
  { label: "Upload Quiz", href: "/upload", icon: <FiUpload /> },
  { label: "Aprove Quiz", href: "/approve", icon: <CiSquareCheck /> },
  { label: "Mange Quizzes", href: "/manage", icon: <FaRegEdit /> },
];
