import React, { useEffect, useState, useCallback } from "react";
import { FaUserCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Notify = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [loadingRequestId, setLoadingRequestId] = useState(null); // Track which request is loading
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  // Fetch Notifications Function
  const fetchNotifications = useCallback(async () => {
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      const response = await fetch(`${baseUrl}/api/notifications`, {
        credentials: "include",
        signal, // Attach signal for cleanup
      });

      if (!response.ok) throw new Error("Failed to fetch notifications");

      let data = await response.json();
      console.log("Notifications received:", data);

      // Filter out invalid friend request notifications (if needed)
      data = data.filter(
        (notif) => notif.type !== "friend_request" || notif.friend_request_id !== null
      );

      setNotifications(data);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message);
      }
    }

    return () => controller.abort(); // Cleanup on unmount
  }, [baseUrl]);

  // Accept Friend Request
  const acceptFriendRequest = async (requestId) => {
    setLoadingRequestId(requestId); // Track loading state

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

      // Remove accepted request from notifications
      setNotifications((prev) =>
        prev.filter((notif) => notif.friend_request_id !== requestId)
      );

      alert("Friend request accepted!");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingRequestId(null);
    }
  };

  // Fetch Notifications on Component Mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4 bg-gray-900 space-y-4">
      <h2 className="text-lg font-bold text-white">
        Notifications{" "}
        {notifications.length > 0 && (
          <span className="ml-2 bg-red-600 text-white px-2 py-1 rounded-full text-sm">
            {notifications.length}
          </span>
        )}
      </h2>

      {notifications.length === 0 ? (
        <p className="text-gray-400">No new notifications</p>
      ) : (
        notifications.map((notif) => (
          <div
            key={notif.id}
            className="w-full max-w-3xl mx-auto border border-gray-300 rounded-lg p-4 shadow-lg flex items-center justify-between bg-gray-800"
          >
            <div className="flex items-center space-x-3">
              {/* Display Profile Picture using originator_profile_pic */}
              <img
                src={
                  notif.originator_profile_pic
                    ? `${notif.originator_profile_pic}`
                    : `${baseUrl}static/default.jpg`
                }
                alt={notif.originator_name || "Unknown User"}
                className="w-10 h-10 rounded-full object-cover"
                onClick={() => navigate(`/profile/${user.id}`)}
              />
              <p className="text-white">
                {notif.type === "friend_accept"
                  ? notif.message
                  : `Friend request from ${notif.originator_name || "Unknown User"}`}
              </p>
            </div>

            {/* Accept Friend Request Button - only for pending friend requests */}
            {notif.type === "friend_request" && notif.friend_request_id && (
              <button
                onClick={() => acceptFriendRequest(notif.friend_request_id)}
                disabled={loadingRequestId === notif.friend_request_id}
                className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${
                  loadingRequestId === notif.friend_request_id
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-700"
                } text-white transition-all`}
              >
                {loadingRequestId === notif.friend_request_id ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <FaUserCheck size={20} />
                    <span>Accept</span>
                  </>
                )}
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Notify;
