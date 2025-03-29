import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "../firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import "./Lo.css"
import { toast } from "sonner";

const auth = getAuth(app);
const db = getFirestore(app);

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user role from Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setUser({ uid: user.uid, email: user.email, role: userData.role });
        toast.success("Login successful! Redirecting...");
        // Redirect based on role
        if (userData.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        toast.error("User role not found. Contact support.");
      }
      if (!setUser) {
        // console.error("setUser is undefined in Login.js");
        return;
      }
      if (!user?.role) {
        return toast.error("Your account is not fully set up.");
      }
    } catch (error) {
      // toast.error("Login failed: " + error.message);
      toast.error("Login Failed Invalid Credentials");
    }
  };


  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h1>Login</h1>
        <p className="register-link">
          Not registered? <Link  to="/signup">Sign up here</Link>
        </p>
        <div className="wrapper">
          <span className="icon">📧</span>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="wrapper">
          <span className="icon">🔒</span>
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;