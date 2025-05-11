import React, { useState } from "react";
import { HiBars3, HiOutlineUser, HiXMark } from "react-icons/hi2";
import logo from "../assets/images/logo.png";
import { NavLinks } from "../utils/NavLinks";
import { HashLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [menuState, setMenuState] = useState({
    mobileMenuPanel: false,
    profileMenuPanel: false,
    dropdownMenuPanel: false,
  });

  const { user, loading } = useAuth();

  const navigate = useNavigate();
  const navLinks = NavLinks(user);

  const toggleMenu = (panel) => {
    setMenuState((prevState) => ({
      ...prevState,
      [panel]: !prevState[panel],
    }));
  };

  if (loading) {
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
  }

  return (
    <header className="bg-white">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8 shadow-sm"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Quizzes</span>
            <img className="h-8 w-auto" src={logo} alt="Quizz" />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            onClick={() => toggleMenu("mobileMenuPanel")}
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <HiBars3 className="size-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {user.role}
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.href}
              className="text-sm/6 font-semibold text-gray-900 hover:text-gray-900"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {user ? (
            <div className="relative ml-3">
              {/*  Profile dropdown  */}
              <div>
                <button
                  type="button"
                  className="relative shadow flex max-w-xs items-center rounded-full  text-sm focus:ring-2 focus:ring-zinc-200 focus:ring-offset-2 focus:ring-offset-zinc-200 focus:outline-hidden"
                  id="user-menu-button"
                  aria-haspopup="true"
                  aria-expanded={menuState.profileMenuPanel}
                  onClick={() => toggleMenu("profileMenuPanel")}
                >
                  <span className="absolute -inset-1.5"></span>
                  <span className="sr-only">Open user menu</span>
                  <HiOutlineUser className="size-8 shadow-md bg-zinc-200  rounded-full" />
                  {/* <img className="size-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" /> */}
                </button>
              </div>

              {/* 
                  Dropdown menu, show/hide based on menu state.

                  Entering: "transition ease-out duration-100"
                    From: "transform opacity-0 scale-95"
                    To: "transform opacity-100 scale-100"
                  Leaving: "transition ease-in duration-75"
                    From: "transform opacity-100 scale-100"
                    To: "transform opacity-0 scale-95"
                */}

              <div
                className={`absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-hidden transition ease-out duration-100 ${
                  menuState.profileMenuPanel
                    ? "transform opacity-100 scale-100"
                    : "transform opacity-0 scale-95"
                } `}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                tabIndex="-1"
              >
                {/* <!-- Active: "bg-gray-100 outline-hidden", Not Active: "" --> */}
                <Link
                  to={`/${user.username}/profile`}
                  className="block px-4 py-2 text-sm text-gray-700"
                  role="menuitem"
                  tabIndex="-1"
                  id="user-menu-item-0"
                >
                  {" "}
                  Your Profile
                </Link>
                <Link
                  to="/"
                  className="block px-4 py-2 text-sm text-gray-700"
                  role="menuitem"
                  tabIndex="-1"
                  id="user-menu-item-1"
                >
                  Settings
                </Link>
                <button
                  onClick={async () => {
                    await logout();
                    navigate("/login");
                  }}
                  className="block px-4 py-2 text-sm text-gray-700"
                  role="menuitem"
                  tabIndex="-1"
                  id="user-menu-item-2"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link to="/" className="text-sm/6 font-semibold text-gray-900">
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </nav>
      {/* Mobile menu, show/hide based on menu open state. */}
      <div
        className={`lg:hidden  ${
          menuState.mobileMenuPanel ? "block" : "hidden"
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Background backdrop, show/hide based on slide-over state. */}
        {/* <div className="fixed inset-0 z-10"></div> */}

        <div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 transform ranslate-x-full">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img className="h-8 w-auto" src={logo} alt="" />
            </Link>
            <button
              onClick={() => toggleMenu("mobileMenuPanel")}
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <HiXMark className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Dashboard
                  </Link>
                )}

                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                {user ? (
                  <div>
                    <div className="flex items-center ">
                      <div
                        className="shrink-0"
                        aria-expanded={menuState.profileMenuPanel}
                        onClick={() => toggleMenu("profileMenuPanel")}
                      >
                        <HiOutlineUser className="size-10 shadow-md bg-zinc-200 rounded-full" />
                        {/* <img className="size-10 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" /> */}
                      </div>
                      <div className="ml-3">
                        <div className="text-base/5 font-medium text-black">
                          {user.username}
                        </div>
                        <div className="text-sm font-medium text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    {menuState.profileMenuPanel && (
                      <div className="mt-4 space-y-1 px-2 ">
                        <Link
                          to={`/${user.username}/profile`}
                          className="block rounded-md px-3 py-2 text-base font-medium text-zinc-600 hover:bg-zinc-200 hover:text-white"
                        >
                          Your Profile
                        </Link>
                        <Link
                          to="/"
                          className="block rounded-md px-3 py-2 text-base font-medium text-zinc-600 hover:bg-zinc-200 hover:text-white"
                        >
                          Settings
                        </Link>
                        <button
                          onClick={async () => {
                            await logout();
                            navigate("/login");
                          }}
                          className="block rounded-md px-3 py-2 text-base font-medium text-zinc-600 hover:bg-zinc-200 hover:text-white"
                        >
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  // <div className="relative ml-3">
                  //   {/*  Profile dropdown  */}
                  //   <div>
                  //     <button type="button" className="relative shadow flex max-w-xs items-center rounded-full  text-sm focus:ring-2 focus:ring-zinc-200 focus:ring-offset-2 focus:ring-offset-zinc-200 focus:outline-hidden"
                  //       id="user-menu-button"
                  //       aria-haspopup="true"
                  //       aria-expanded={menuState.profileMenuPanel}
                  //       onClick={() => toggleMenu("profileMenuPanel")}
                  //     >
                  //       <span className="absolute -inset-1.5"></span>
                  //       <span className="sr-only">Open user menu</span>
                  //       <HiOutlineUser className="size-8 shadow-md bg-zinc-200  rounded-full" />
                  //       {/* <img className="size-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" /> */}
                  //     </button>
                  //   </div>

                  //   {/*
                  //       Dropdown menu, show/hide based on menu state.

                  //       Entering: "transition ease-out duration-100"
                  //         From: "transform opacity-0 scale-95"
                  //         To: "transform opacity-100 scale-100"
                  //       Leaving: "transition ease-in duration-75"
                  //         From: "transform opacity-100 scale-100"
                  //         To: "transform opacity-0 scale-95"
                  //     */}

                  //   <div className={`absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-hidden transition ease-out duration-100 ${menuState.profileMenuPanel ? "transform opacity-100 scale-100" : "transform opacity-0 scale-95"} `} role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex="-1">

                  //     {/* <!-- Active: "bg-gray-100 outline-hidden", Not Active: "" --> */}
                  //     <Link to={`/${user.username}/profile`} className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="user-menu-item-0"> Your Profile</Link>
                  //     <Link to="/" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="user-menu-item-1">Settings</Link>
                  //     <button onClick={async () => {
                  //       await logout();
                  //       navigate("/login");
                  //     }} className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="user-menu-item-2">Sign out</button>
                  //   </div>
                  // </div>

                  <Link
                    to="/"
                    className="text-sm/6 font-semibold text-gray-900"
                  >
                    Log in <span aria-hidden="true">&rarr;</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
