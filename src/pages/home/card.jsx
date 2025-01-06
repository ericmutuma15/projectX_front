import React, { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa"; // Import tick and x icons

const Card = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  // Fetch users excluding the current logged-in user
  const fetchUsers = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Authorization token is missing. Please log in again.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5555/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include", // Allow credentials if needed
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `Failed to fetch users: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to load users. Please try again later.");
    }
  };

  // Generic API call function
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
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return true; // Request was successful
    } catch (err) {
      console.error("API Action Error:", err);
      alert(err.message || "An error occurred. Please try again.");
      return false;
    }
  };

  const handleAction = async (userId, action) => {
    if (action === "like") {
      const success = await handleApiAction(
        "http://127.0.0.1:5555/api/send-friend-request",
        { userId }
      );

      if (success) {
        alert("Friend request sent!");
      }
    } else if (action === "reject") {
      // Remove user locally
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));

      const success = await handleApiAction(
        "http://127.0.0.1:5555/api/reject-user",
        { userId }
      );

      if (!success) {
        // Optionally revert UI changes if the API call fails
        fetchUsers();
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-800">
      {users.map((user) => (
        <div
          key={user.id}
          className="w-full max-w-[250px] h-[250px] border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg flex flex-col transition-all transform hover:scale-105 hover:shadow-xl hover:bg-gray-500 duration-300 ease-in-out"
        >
          <div className="w-full h-32 relative">
            <img
              className="w-full h-full object-cover rounded-t-lg transition-all duration-300 ease-in-out hover:opacity-80"
              src={`http://127.0.0.1:5555/static/${user.picture}`}
              alt="User Profile"
            />
          </div>
          <div className="p-4 flex-1">
            <div className="font-bold text-lg mb-2">{user.name}</div>
            <p className="text-gray-700 text-sm">{user.description}</p>
            <p className="text-gray-500 text-xs mt-2">{user.location}</p>
          </div>
          <div className="flex justify-around p-4">
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
