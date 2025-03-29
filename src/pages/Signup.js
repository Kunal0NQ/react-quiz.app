import { useState } from "react";
import { signUp } from "../auth";
import { Link, useNavigate } from "react-router-dom";
import "./Lo.css";
import { toast } from "sonner";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true); // Disable button
    try {
      await signUp(email, password);
      toast.success("User created successfully!");
      navigate("/");
    } catch (error) {
      setError(error.message);
      // console.error("Signup failed:", error.message);
    }
    setLoading(false); // Re-enable button
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleSignup} className="login-container">
        <h1>Sign Up</h1>
        <p className="register-link">
          Already have Account? <Link to="/">Login here</Link>
        </p>
        {error && <p className="error-message">{error}</p>} {/* Styled error */}

        {/* Email Input */}
        <div className="wrapper">
          <span className="icon">📧</span>
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required 
            aria-label="Email"
          />
        </div>

        {/* Password Input */}
        <div className="wrapper">
          <span className="icon">🔒</span>
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required
            minLength={6} 
            aria-label="Password"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
