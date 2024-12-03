import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import "./App.css";
import Profile from "./pages/home/Profile";

// Initialize Firebase (replace with your Firebase config)
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCAlIUfXGNCdDGDfVS9Sjxexxq6GScRkdc",
  authDomain: "projx-8adc8.firebaseapp.com",
  projectId: "projx-8adc8",
  storageBucket: "projx-8adc8.firebasestorage.app",
  messagingSenderId: "779196128624",
  appId: "1:779196128624:web:637cc73c4e8ff2777843b5",
  measurementId: "G-QL43M84DR6",
};

initializeApp(firebaseConfig);

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  </Router>
);

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        navigate("/home");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error during sign up:", error);
    }
  };

  const handleSignInRedirect = () => {
    navigate("/login");
  };
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h1 className="text-xl font-bold mb-4">Sign Up</h1>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="w-full mb-3 p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Sign Up
        </button>
        <div className="mt-4 text-center">
          <p>
            Already a member?{" "}
            <button
              type="button"
              onClick={handleSignInRedirect}
              className="text-blue-500 hover:underline"
            >
              Sign in here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.access_token) {
            // Store the JWT token in localStorage
            localStorage.setItem("access_token", data.access_token);
            alert("Login successful!");
            navigate("/home");
          } else {
            alert("Login failed!");
          }
        })
        .catch((err) => console.error("Error:", err));
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleGoogleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;

      // Verify with backend
      const response = await fetch("http://localhost:5000/api/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        navigate("/home");
      } else {
        alert("Google login failed or email not registered.");
      }
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md">
        <h1 className="text-xl font-bold mb-4">Login</h1>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full mb-3 p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Login
        </button>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mt-3"
        >
          Continue with Google
        </button>
      </form>
    </div>
  );
};
const handleProfileButton = () => {
  navigate("/profile");
};
const Home = () => {
  const navigate = useNavigate();  // Use navigate inside the component

  const handleProfileButton = () => {
    navigate("/profile");  // Navigate to /profile when the button is clicked
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <button
        type="button"
        onClick={handleProfileButton}
        className="text-blue-500 hover:underline"
      >
        Profile
      </button>
    </div>
  );
};


export default App;
