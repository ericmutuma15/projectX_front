import React, { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";

const FeedsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewMedia, setPreviewMedia] = useState(null); // New state for preview media
  const token = localStorage.getItem("access_token");
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch posts from the API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/feeds`, {
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
        `${baseUrl}/api/posts/${postId}/like`,
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
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/api/posts/${postId}/comments`,
        { content: post.commentText },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // 🔹 This is crucial for sending cookies
        }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [...post.comments, response.data],
                commentText: "",
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  // Handle opening the media preview
  const handleMediaClick = (mediaUrl) => {
    setPreviewMedia(mediaUrl); // Set media URL for preview
  };

  // Handle closing the preview
  const closePreview = () => {
    setPreviewMedia(null); // Clear preview state to close modal
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex justify-center">
      {/* Media Preview Modal */}
      {previewMedia && (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-60 z-50">
          <div className="relative max-w-3xl max-h-[85%] bg-gray-900 p-4 rounded-lg shadow-xl">
            {previewMedia.endsWith(".mp4") || previewMedia.endsWith(".webm") ? (
              <video controls className="w-full h-full rounded-lg">
                <source src={`${baseUrl}${previewMedia}`} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={`${baseUrl}${previewMedia}`}
                alt="Preview"
                className="w-full h-full object-contain rounded-lg"
              />
            )}
            <button
              onClick={closePreview}
              className="absolute top-3 right-3 text-white text-3xl hover:text-gray-400 transition"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Posts Section */}

      <div className="w-full max-w-3xl flex flex-col space-y-8 mx-auto bg-gray-900 lg:mr-12">

        {posts.map((post) => (
          <div
            key={post.id}
            className=" p-6 rounded-xl shadow-lg w-full border border-gray-800 mx-auto"
          >
            {/* User Info Section */}
            <div className="flex items-center space-x-4 mb-5">
              {post.user_photo && (
                <img
                  src={`${baseUrl}/static/${post.user_photo}`}
                  alt="User profile"
                  className="w-12 h-12 rounded-full object-cover border border-gray-700"
                />
              )}
              <div>
                <p className="text-lg font-semibold text-white">
                  {post.user_name}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(post.timestamp).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Media Section (Perfectly Centered) */}
            {post.media_url && (
              <div
                className="mb-4 flex justify-center items-center w-full"
                onClick={() => handleMediaClick(post.media_url)}
              >
                {post.media_url.endsWith(".mp4") ||
                post.media_url.endsWith(".webm") ? (
                  <video
                    controls
                    className="rounded-lg border border-gray-800 w-full max-w-[500px] h-auto mx-auto"
                  >
                    <source
                      src={`${baseUrl}${post.media_url}`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={`${baseUrl}${post.media_url}`}
                    alt="Post media"
                    className="rounded-lg object-contain border border-gray-800 w-full max-w-[500px] h-auto mx-auto"
                  />
                )}
              </div>
            )}

            {/* Post Content */}
            <p className="text-gray-300 mb-4 leading-relaxed text-center">
              {post.content}
            </p>

            {/* Actions Section */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center space-x-2 hover:text-red-500 transition"
              >
                <FaHeart
                  className={`w-5 h-5 ${
                    post.isLiked ? "text-red-500" : "text-gray-400"
                  }`}
                />
                <span className="text-sm">{post.likes}</span>
              </button>

              <button
                onClick={() => handleCommentToggle(post.id)}
                className="flex items-center space-x-2 text-gray-400 hover:text-blue-500 transition"
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
                <span className="text-sm">Comment</span>
              </button>
            </div>

            {/* Comments Section */}
            {post.showComments && (
              <div className="mt-4">
                <div className="space-y-4">
                  {post.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-gray-800 p-4 rounded-lg flex items-start space-x-4 border border-gray-700"
                    >
                      {/* Comment User's Profile Picture */}
                      {comment.user_photo && (
                        <img
                          src={`${baseUrl}/static/${comment.user_photo}`}
                          alt="Comment user profile"
                          className="w-8 h-8 rounded-full object-cover border border-gray-600"
                        />
                      )}

                      {/* Comment Content */}
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white">
                          {comment.user_name}
                        </p>
                        <p className="text-gray-300">{comment.content}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(comment.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* New Comment Form */}
                <textarea
                  value={post.commentText}
                  onChange={(e) => handleCommentChange(post.id, e.target.value)}
                  placeholder="Add a comment..."
                  className="mt-4 w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
                <button
                  onClick={() => handleCommentSubmit(post.id)}
                  className="mt-3 px-5 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-500 transition"
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
