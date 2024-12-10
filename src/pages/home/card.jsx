import React, { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa"; // Import tick and x icons

const Card = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  // Fetch users excluding the current logged-in user
  const fetchUsers = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await fetch("http://127.0.0.1:5000/api/users", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include", // Allow credentials if needed
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again later.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAction = (userId, action) => {
    // Handle action for like (tick) or reject (X)
    console.log(`Action for user ${userId}: ${action}`);
    // You can implement a backend call for the action here
  };

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg flex flex-col"
        >
          <img
            className="w-full h-64 object-cover"
            src={`http://127.0.0.1:5000/static/${user.picture}`} // Adjusted to serve images correctly
            alt="User Profile"
          />
          <div className="p-4 flex-1">
            <div className="font-bold text-xl mb-2">{user.name}</div>
            <p className="text-gray-700 text-base">{user.description}</p>
            <p className="text-gray-500 text-sm mt-2">{user.location}</p>
          </div>
          <div className="flex justify-around p-4">
            <button
              onClick={() => handleAction(user.id, "like")}
              className="text-green-500 hover:text-green-700"
            >
              <FaCheck size={24} />
            </button>
            <button
              onClick={() => handleAction(user.id, "reject")}
              className="text-red-500 hover:text-red-700"
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;
