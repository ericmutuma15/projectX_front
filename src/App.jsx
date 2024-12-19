import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { initializeApp } from "firebase/app";
import "./App.css";

// Pages
import Profile from "./pages/home/Profile";
import Card from './pages/home/card'

// Initialize Firebase
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
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-xl w-full sm:w-96">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign Up</h1>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full mb-3 p-3 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full mb-3 p-3 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full mb-3 p-3 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="w-full mb-3 p-3 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Sign Up
        </button>
        <div className="mt-4 text-center text-gray-700">
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
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-xl w-full sm:w-96">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h1>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full mb-3 p-3 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full mb-3 p-3 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Login
        </button>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-red-600 text-white py-3 rounded-md mt-4 hover:bg-red-700 transition duration-300"
        >
          Continue with Google
        </button>
      </form>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();  // Use navigate inside the component
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Fetch user data when the component loads
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        const response = await fetch("http://localhost:5000/api/users", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("User data:", data);
        setUser(data);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileButton = () => {
    navigate("/profile");
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const response = await fetch("http://localhost:5000/api/notifications", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };


  return (
    <>
      <div className="sticky top-0 bg-gray-800 w-full h-1/5 flex justify-between items-center p-4">
        <div className="flex items-center space-x-4">
          <img
            src={user?.picture || "default-profile.png"} // Use default if no profile picture
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
          <span className="text-white text-lg">{user?.name || "User"}</span>
        </div>

        <div className="flex space-x-4 relative">
          <button onClick={handleNotificationClick} className="text-white relative">
            🔔
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs px-2">
                {notifications.length}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute top-12 right-0 bg-gray-700 text-white p-4 rounded-lg shadow-lg w-64">
              <h4 className="font-bold mb-2">Notifications</h4>
              {notifications.length === 0 ? (
                <p>No new notifications</p>
              ) : (
                <ul>
                  {notifications.map((notification) => (
                    <li key={notification.id} className="mb-2">
                      <p>{notification.requester_name} sent you a friend request</p>
                      <span className="text-gray-400 text-sm">
                        {new Date(notification.timestamp).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <button className="text-white">⚙️</button> {/* Settings Icon */}
          <button onClick={handleProfileButton} className="text-white">👤</button> {/* Profile Icon */}
        </div>
      </div>

      <div className="h-screen flex items-center justify-center bg-gray-800">
        <Card />
      </div>
    </>
  );
};

export default App;
