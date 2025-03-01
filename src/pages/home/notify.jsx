import React, { useEffect, useState } from "react";
import { FaUserCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Notify = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/notifications`, {
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch notifications");

        const data = await response.json();
        console.log("Notifications received:", data);
        setNotifications(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchNotifications();
  }, []);

  const acceptFriendRequest = async (requestId) => {
    try {
      const response = await fetch(`${baseUrl}/api/accept-friend-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ requestId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to accept friend request");
      }

      setNotifications((prev) => prev.filter((notif) => notif.friend_request_id !== requestId));

      alert("Friend request accepted!");
    } catch (err) {
      alert(err.message);
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4 bg-gray-900 space-y-4">
      <h2 className="text-lg font-bold text-white">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-400">No new notifications</p>
      ) : (
        notifications.map((notif) => (
          <div
            key={notif.id}
            className="w-full max-w-3xl mx-auto border border-gray-300 rounded-lg p-4 shadow-lg flex items-center justify-between bg-gray-800"
          >
            <div className="flex items-center space-x-3">
              {/* Display Profile Picture */}
              <img
                src={notif.requester_profile_pic}
                alt={notif.requester_name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <p className="text-white">
                Friend request from <span className="font-bold">{notif.requester_name}</span>
              </p>
            </div>

            {/* Accept Friend Request Button */}
            {notif.type === "friend_request" && notif.friend_request_id && (
              <button
                onClick={() => acceptFriendRequest(notif.friend_request_id)}
                className="text-green-500 hover:text-green-700 transition-colors"
              >
                <FaUserCheck size={20} />
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Notify;
