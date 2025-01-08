import React, { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import axios from "axios";

const FeedsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access_token");

  // Fetch posts from the API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5555/api/feeds", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const updatedPosts = response.data.map((post) => ({
          ...post,
          isLiked: post.liked || false,
          likes: post.likes || 0, // Ensure likes is a valid number
          showComments: false, // Initially hide comments
          commentText: "", // Store the text for new comments
          comments: post.comments || [], // Fetch existing comments
        }));
        setPosts(updatedPosts);
        setLoading(false);
      } catch (error) {
        setError("Error fetching posts.");
        setLoading(false);
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [token]);

  const handleLike = async (postId) => {
    try {
      const post = posts.find((post) => post.id === postId);

      // Immediately update UI for responsiveness
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              }
            : post
        )
      );

      const response = await axios.post(
        `http://localhost:5555/api/posts/${postId}/like`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update likes and isLiked based on response
      if (response.data.success) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likes: response.data.likes,
                  isLiked: response.data.liked,
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
      // Reset like state if error occurs to avoid UI inconsistency
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likes: post.isLiked ? post.likes + 1 : post.likes - 1,
              }
            : post
        )
      );
    }
  };

  const handleCommentToggle = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, showComments: !post.showComments }
          : post
      )
    );
  };

  const handleCommentChange = (postId, commentText) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, commentText } : post
      )
    );
  };

  const handleCommentSubmit = async (postId) => {
    const post = posts.find((post) => post.id === postId);

    if (!post.commentText.trim()) {
      return; // Prevent submitting empty comments
    }

    try {
      const response = await axios.post(
        `http://localhost:5555/api/posts/${postId}/comments`,
        { content: post.commentText },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Add the new comment to the post's comments list
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [...post.comments, response.data.comment],
                commentText: "",
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="space-y-6 ">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-3xl mx-auto"
          >
            {/* Post Content */}

            <p className="text-sm text-gray-500">
              Posted by: {post.user_name} on{" "}
              {new Date(post.timestamp).toLocaleString()}
            </p>
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
                      src={`http://127.0.0.1:5555${post.media_url}`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={`http://127.0.0.1:5555${post.media_url}`}
                    alt="Post media"
                    className="w-full rounded-lg"
                    style={{ maxHeight: "400px", objectFit: "cover" }}
                  />
                )}
              </div>
            )}
            <p className="text-gray-300 mb-4">{post.content}</p>

            {/* Actions Section */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center space-x-2"
              >
                <FaHeart
                  className={`w-5 h-5 ${
                    post.isLiked ? "text-red-500" : "text-gray-400"
                  }`}
                />
                <span>{post.likes}</span>
              </button>

              <button
                onClick={() => handleCommentToggle(post.id)}
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

            {/* Comments Section */}
            {post.showComments && (
              <div className="mt-4">
                <div className="space-y-4">
                  {post.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-gray-700 p-4 rounded-lg"
                    >
                      <p className="text-gray-300">{comment.content}</p>
                    </div>
                  ))}
                </div>

                {/* New Comment Form */}
                <textarea
                  value={post.commentText}
                  onChange={(e) => handleCommentChange(post.id, e.target.value)}
                  placeholder="Add a comment..."
                  className="mt-4 w-full p-2 rounded-lg bg-gray-700 text-white"
                  rows="3"
                />
                <button
                  onClick={() => handleCommentSubmit(post.id)}
                  className="mt-2 px-4 py-2 bg-blue-600 rounded-lg text-white"
                >
                  Post Comment
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedsPage;
