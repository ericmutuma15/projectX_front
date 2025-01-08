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

//Assets and Icons
import LOGO from "./assets/Olivia.gif";
import { IoNotifications } from "react-icons/io5";
import { FaUpload } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { FaUserFriends } from "react-icons/fa";

// Pages
import Profile from "./pages/home/Profile";
import Card from "./pages/home/card";
import ChatBox from "./pages/home/ChatBox";
import FeedsPage from "./pages/home/FeedsPage";
import CreatePost from "./pages/home/CreatePost";
import SideBar from "./pages/home/sidebar";
import RightSidebar from "./pages/home/RightSidebar";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCAlIUfXGNCdDGDfVS9Sjxexxq6GScRkdc",
  authDomain: "projx-8adc8.firebaseapp.com",
  projectId: "projx-8adc8",
  storageBucket: "projx-8adc8.appspot.com",
  messagingSenderId: "779196128624",
  appId: "1:779196128624:web:637cc73c4e8ff2777843b5",
  measurementId: "G-QL43M84DR6",
};

initializeApp(firebaseConfig);

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetch("http://localhost:5555/api/current_user", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setCurrentUser(data))
        .catch((err) => console.error("Failed to fetch current user:", err));
    }
  }, []);

  return (
    <Router>
      <div className="bg-gray-900 h-screen w-full flex flex-col">
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home currentUser={currentUser} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/add-users" element={<Card />} />
          <Route
            path="/chat/:recipientEmail"
            element={
              <ChatBox
                user={currentUser}
                recipient={location.state?.recipient} // Use the recipient passed in state
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

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
      const response = await fetch("http://localhost:5555/api/register", {
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
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-xl w-full sm:w-96"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign Up
        </h1>
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
      const response = await fetch("http://localhost:5555/api/login", {
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
      const response = await fetch("http://localhost:5555/api/google-login", {
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
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-xl w-full sm:w-96"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h1>
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
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Correctly manage user state
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Fetch user data when the component loads
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const response = await fetch(
            "http://localhost:5555/api/current_user",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setUser(data); // Update the user state with the current user's data
          } else {
            console.error("Failed to fetch current user data");
          }
        } catch (error) {
          console.error("Error fetching current user data:", error);
        }
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const response = await fetch(
          "http://localhost:5555/api/notifications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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

  const handleProfileButton = () => {
    navigate("/profile");
  };

  const handleCreateButton = () => {
    navigate("/create-post");
  };

  const handleFriendsButton = () => {
    navigate("/add-users");
  };

  // Log out logic
  const handleLogout = () => {
    localStorage.removeItem("access_token"); // Remove the access token from local storage
    navigate("/login"); // Redirect to the login page after logging out
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gray-900">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-gray-900 w-full h-16 flex justify-between items-center p-4 z-10">
        <div className="flex items-center space-x-4">
          <img src={LOGO} alt="Profile" className="w-12 h-12 rounded-full" />
          <span className="text-white text-lg">{user?.name || "User"}</span>
        </div>
  
        {/* Centered Icon Container */}
        <div className="flex space-x-4 absolute left-1/2 transform -translate-x-1/2">
          <button onClick={handleNotificationClick} className="text-white relative">
            <IoNotifications />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs px-2">
                {notifications.length}
              </span>
            )}
          </button>
          <button onClick={handleCreateButton} className="text-white">
            <FaUpload />
          </button>
          <button onClick={handleFriendsButton} className="text-white">
            <FaUserFriends />
          </button>
          <button onClick={handleProfileButton} className="text-white">
            <CgProfile />
          </button>
        </div>
  
        {/* Log Out Button */}
        <button
          onClick={handleLogout}
          className="text-white absolute right-4 top-1/2 transform -translate-y-1/2"
        >
          Log Out
        </button>
      </div>
  
      {/* Main Content */}
<div className="flex h-[calc(100vh-4rem)] bg-gray-900">
  {/* Left Sidebar - Always Visible on Large Screens */}
  <div className="hidden lg:block w-64 bg-gray-900 sticky top-16"> 
    <SideBar />
  </div>

  {/* Main Feeds Section */}
  <div className="flex-1 bg-gray-900 overflow-auto scrollable">
    <FeedsPage />
  </div>

  {/* Right Sidebar */}
  <div className="lg:w-64 lg:block">
    <RightSidebar  />
  </div>
</div>

    </div>
  );
  
};
export default App;
