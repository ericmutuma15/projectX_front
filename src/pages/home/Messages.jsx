import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Messages = () => {
  const [chats, setChats] = useState([]);
  const [error, setError] = useState(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/chats`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch chats");
        const data = await response.json();
        setChats(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchChats();
  }, [baseUrl]);

  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (chats.length === 0)
    return <div className="text-gray-400 p-4">No conversations found.</div>;

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <h2 className="text-xl font-bold text-white mb-4">Chats</h2>
      <div className="space-y-4">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => navigate(`/chat/${chat.id}`)}
            className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
          >
            <img
              src={chat.profile_pic}
              alt={chat.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <p className="font-semibold text-white">{chat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
