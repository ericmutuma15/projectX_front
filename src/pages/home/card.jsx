import React, { useEffect, useState } from "react";
import { FaUserPlus, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LoadingPage from "./LoadingPage";

const Card = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/users`, { credentials: "include" });

        if (!response.ok) throw new Error("Failed to fetch users");

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const sendFriendRequest = async (userId) => {
    try {
      const response = await fetch(`${baseUrl}/api/send-friend-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error("Failed to send friend request");

      alert("Friend request sent!");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <LoadingPage />;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

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
            <p className="text-gray-400 text-xs">{user.location || "Location not available"}</p>
          </div>

          <div className="flex space-x-4">
            {/* Add Friend Button */}
            <button
              onClick={() => sendFriendRequest(user.id)}
              className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
            >
              <FaUserPlus size={20} />
            </button>

            {/* View Profile Button */}
            <button
              onClick={() => navigate(`/profile/${user.id}`)} // Navigate to the user profile page
              className="text-green-500 hover:text-green-700 transition-colors duration-300"
            >
              <FaUser size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;
