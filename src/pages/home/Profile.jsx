import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  // Fetch user details
  const fetchUserDetails = async () => {
    try {
      const access_token = localStorage.getItem("access_token");
      if (!access_token) {
        console.error("Access token not found");
        return;
      }

      const response = await fetch("http://localhost:5555/api/current_user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
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

  // Fetch user posts
  const fetchUserPosts = async () => {
    try {
      const access_token = localStorage.getItem("access_token");
      if (!access_token) {
        console.error("Access token not found");
        return;
      }

      const response = await fetch("http://localhost:5555/api/user_posts", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
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
    fetchUserDetails();
    fetchUserPosts();
  }, []);

  if (!user) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="bg-gray-900 min-h-screen p-6 text-white">
      {/* User Details */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center space-x-4">
        <img
          src={user.picture || "/default-profile.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
        />
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-400">{user.location || "Location not set"}</p>
          <p className="mt-2">{user.description}</p>
          <Link
            to="/edit-profile"
            className="inline-block mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {/* User Posts */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Your Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-gray-800 p-4 rounded-lg shadow-lg"
              >
                <h3 className="text-lg font-semibold">{post.content}</h3>
                {post.media_url && (
                  <img
                    src={post.media_url}
                    alt="Post Media"
                    className="mt-2 w-full h-auto rounded-lg"
                  />
                )}
                <p className="text-gray-400 mt-2">
                  Likes: {post.like_count} | Posted on: {new Date(post.timestamp).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No posts found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
