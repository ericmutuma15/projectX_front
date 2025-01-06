import React, { useState, useEffect } from "react";

const FeedsPage = () => {
  const [posts, setPosts] = useState([]);

  // Fetch posts from the API
  useEffect(() => {
    fetch("http://localhost:5555/api/feeds")
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  // Handle like functionality
  const handleLike = (postId) => {
    console.log("Liked post:", postId);
  };

  // Handle reply/comment functionality
  const handleComment = (postId) => {
    console.log("Commented on post:", postId);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Feeds</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-3xl mx-auto"
          >
            {/* Media Section */}
            {post.media_url && (
              <div className="mb-4">
                {post.media_url.endsWith(".mp4") ||
                post.media_url.endsWith(".webm") ? (
                  <video
                    controls
                    className="w-full rounded-lg"
                    style={{ maxHeight: "400px" }}
                  >
                    <source
                      src={`http://127.0.0.1:5555/${post.media_url}`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={`http://127.0.0.1:5555/${post.media_url}`}
                    alt="Post media"
                    className="w-full rounded-lg"
                    style={{ maxHeight: "400px", objectFit: "cover" }}
                  />
                )}
              </div>
            )}

            {/* Post Content */}
            <p className="text-gray-300 mb-4">{post.content}</p>
            <p className="text-sm text-gray-500">
              Posted by: {post.user_name} on{" "}
              {new Date(post.timestamp).toLocaleString()}
            </p>

            {/* Actions Section */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center space-x-2 text-gray-400 hover:text-red-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 9V6a3 3 0 00-3-3h-1a3 3 0 00-3 3v3m0 0v6h6V9m0 0H7m7 0h4a1 1 0 001-1V5a1 1 0 00-1-1h-4v4z"
                  />
                </svg>
                <span>{post.likes || 0} Likes</span>
              </button>

              <button
                onClick={() => handleComment(post.id)}
                className="flex items-center space-x-2 text-gray-400 hover:text-blue-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m-6-6h6a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4a2 2 0 012-2z"
                  />
                </svg>
                <span>Comment</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedsPage;
