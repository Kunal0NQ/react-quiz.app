// src/components/AuthPage.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp, login } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import useToast from "../hooks/useToast";
import { getAuthErrorMessage } from "../utils/firebaseErrorMessages";

const AuthPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccessToast, showErrorToast } = useToast();

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (isRegistering) {
      if (!username.trim()) {
        setError("Username is required.");
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      setLoading(true);

      try {
        await signUp(email, password, username);
        showSuccessToast("Account created successfully!");
        navigate("/home");
      } catch (err) {
        const friendlyMsg = getAuthErrorMessage(err);
        showErrorToast(friendlyMsg);
        setError(friendlyMsg);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        await login(email, password);
        showSuccessToast("Login successful!");
        setEmail("");
        setPassword("");
        setUsername("");
        setConfirmPassword("");
        navigate("/home");
      } catch (err) {
        const friendlyMsg = getAuthErrorMessage(err);
        showErrorToast(friendlyMsg); // show toast
        setError(friendlyMsg);
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <div className="shadow px-10 py-6 mx-auto max-w-md w-full">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          {isRegistering ? "Create an account" : "Sign in to your account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {isRegistering && (
            <div>
              <label className="block text-sm font-medium">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full rounded-md border px-3 py-2"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          {isRegistering && (
            <div>
              <label className="block text-sm font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-md border px-3 py-2"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded"
          >
            {loading
              ? "Please wait..."
              : isRegistering
              ? "Create Account"
              : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          {isRegistering ? (
            <>
              Already have an account?{" "}
              <button
                className="text-indigo-600 font-semibold"
                onClick={() => setIsRegistering(false)}
              >
                Login here
              </button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <button
                className="text-indigo-600 font-semibold"
                onClick={() => setIsRegistering(true)}
              >
                Register here
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
