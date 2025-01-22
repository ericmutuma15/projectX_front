import React, { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import LoadingPage from "./LoadingPage"; // Import your LoadingPage component

const Card = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state to track fetching
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchUsers = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Authorization token is missing. Please log in again.");
      setLoading(false); // Stop loading in case of error
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `Failed to fetch users: ${response.status}`);
      }

      const data = await response.json();
      const updatedUsers = data.map((user) => ({
        ...user,
        locationName: user.location || "Location not available",
      }));

      setUsers(updatedUsers);
      setLoading(false); // Stop loading when data is fetched
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to load users. Please try again later.");
      setLoading(false); // Stop loading in case of error
    }
  };

  const handleApiAction = async (url, payload) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Authorization token is missing. Please log in again.");
      return false;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return true;
    } catch (err) {
      console.error("API Action Error:", err);
      alert(err.message || "An error occurred. Please try again.");
      return false;
    }
  };

  const handleAction = async (userId, action) => {
    if (action === "like") {
      const success = await handleApiAction(
        `${baseUrl}/api/send-friend-request`,
        { userId }
      );

      if (success) {
        alert("Friend request sent!");
      }
    } else if (action === "reject") {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));

      const success = await handleApiAction(
        `${baseUrl}/api/reject-user`,
        { userId }
      );

      if (!success) {
        fetchUsers();
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <LoadingPage />; // Show LoadingPage while data is loading
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="p-4 bg-gray-900 space-y-4 scrollable">
      {users.map((user) => (
        <div
          key={user.id}
          className="w-full max-w-3xl mx-auto border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg flex items-center p-4 transition-all transform hover:scale-105 hover:shadow-xl hover:bg-gray-800 duration-300 ease-in-out"
        >
          <img
            className="w-16 h-16 rounded-full object-cover mr-4"
            src={`${baseUrl}/static/${user.picture}`}
            alt="User Profile"
          />

          <div className="flex-1">
            <div className="font-bold text-lg">{user.name}</div>
            <p className="text-gray-500 text-sm">{user.description}</p>
            <p className="text-gray-400 text-xs">{user.locationName}</p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => handleAction(user.id, "like")}
              className="text-green-500 hover:text-green-700 transition-colors duration-300"
            >
              <FaCheck size={20} />
            </button>
            <button
              onClick={() => handleAction(user.id, "reject")}
              className="text-red-500 hover:text-red-700 transition-colors duration-300"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;
