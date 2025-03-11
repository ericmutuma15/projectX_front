import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import LoadingPage from "./LoadingPage"; // Import the LoadingPage component
import { Link } from "react-router-dom";

const Profile = () => {
  const { userId } = useParams(); // Get userId from URL if available
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPostId, setExpandedPostId] = useState(null); // Track which post video is expanded
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch user details
  const fetchUserDetails = async () => {
    const endpoint = userId
      ? `${baseUrl}/api/user/${userId}`
      : `${baseUrl}/api/current_user`;

    try {
      const response = await fetch(endpoint, {
        method: "GET",
        credentials: "include", // Include cookies in the request
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        console.error("Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // Fetch user posts (Show their posts when viewing their profile)
  const fetchUserPosts = async () => {
    const endpoint = userId
      ? `${baseUrl}/api/user_posts/${userId}` // Fetch specific user's posts
      : `${baseUrl}/api/user_posts`; // Fetch logged-in user's posts

    try {
      const response = await fetch(endpoint, {
        method: "GET",
        credentials: "include", // Include cookies for authentication
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      } else {
        console.error("Failed to fetch user posts");
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserDetails();
      await fetchUserPosts();
      setLoading(false);
    };
    fetchData();
  }, [userId]); // Refetch when userId changes

  const handleVideoClick = (postId) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  if (loading) return <LoadingPage />;

  if (!user) return <div className="text-white">User not found.</div>;

  return (
    <div className="bg-gray-900 min-h-screen p-6 text-white overflow-hidden">
      <div className="profile-container overflow-y-auto max-h-screen no-scrollbar">
        {/* User Details */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg flex items-center space-x-4">
          <img
            src={user.picture || "/default-profile.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
          />
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-400">
              {user.location || "Location not set"}
            </p>
            <p className="mt-2">{user.description}</p>

            {/* Show Edit Profile button only if it's the logged-in user's profile */}
            {!userId && (
              <Link
                to="/edit-profile"
                className="inline-block mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
              >
                Edit Profile
              </Link>
            )}
          </div>
        </div>

        {/* User Posts */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-gray-900 p-4 rounded-lg shadow-lg"
                >
                  {post.media_url ? (
                    post.media_url.match(/\.(jpeg|jpg|gif|png)$/) ? (
                      <img
                        src={post.media_url}
                        alt="Post Media"
                        className="mt-2 w-full h-48 object-cover rounded-lg"
                      />
                    ) : post.media_url.match(/\.(mp4|webm|ogg)$/) ? (
                      <div
                        className="mt-2 w-full h-48 bg-gray-700 rounded-lg cursor-pointer"
                        onClick={() => handleVideoClick(post.id)}
                      >
                        <video
                          controls
                          src={post.media_url}
                          className={`w-full h-full object-cover rounded-lg ${
                            expandedPostId === post.id ? "h-auto" : ""
                          }`}
                        />
                      </div>
                    ) : (
                      <div className="mt-2 w-full h-32 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
                        Unsupported Media
                      </div>
                    )
                  ) : (
                    <div className="mt-2 w-full h-32 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
                      No Media
                    </div>
                  )}
                  <h3 className="text-lg font-semibold">{post.content}</h3>
                  <p className="text-gray-400 mt-2">
                    Likes: {post.like_count} | Posted on:{" "}
                    {new Date(post.timestamp).toLocaleString()}
                  </p>
                  
                </div>
              ))
            ) : (
              <p className="text-gray-400">No posts found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
