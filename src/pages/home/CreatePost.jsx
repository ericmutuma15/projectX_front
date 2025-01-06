import React, { useState } from "react";

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [error, setError] = useState(null);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleMediaChange = (e) => {
    setMedia(e.target.files[0]);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("content", content);
    if (media) {
      formData.append("media", media);
    }

    try {
      const response = await fetch("http://localhost:5555/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const result = await response.json();
      setContent("");
      setMedia(null);
      if (onPostCreated) {
        onPostCreated(result);
      }
    } catch (error) {
      setError("Error creating post: " + error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl text-white font-semibold mb-4">Create a Post</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handlePostSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="What's on your mind?"
          className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>

        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleMediaChange}
          className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
