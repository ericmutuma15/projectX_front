import React, { useState } from "react";

const ChatBox = ({ user, recipient }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [file, setFile] = useState(null);

  const handleSendMessage = async () => {
    if (!messageInput && !file) return;

    const newMessage = {
      sender: user?.email,
      recipient: recipient?.email,
      text: messageInput,
      file: file ? URL.createObjectURL(file) : null, // For image/audio preview
      timestamp: new Date(),
    };

    // Append the new message locally
    setMessages([...messages, newMessage]);

    try {
      // Send the message to the backend
      const formData = new FormData();
      formData.append("sender", user?.email);
      formData.append("recipient", recipient?.email);
      if (messageInput) formData.append("text", messageInput);
      if (file) formData.append("file", file);

      await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        body: formData,
      });

      // Clear input
      setMessageInput("");
      setFile(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-800 text-white">
      {/* Chat Header */}
      <div className="p-4 bg-gray-700 flex items-center">
        <img
          src={recipient?.picture || "default-profile.png"}
          alt="Recipient"
          className="w-10 h-10 rounded-full mr-4"
        />
        <span>{recipient?.name}</span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === user?.email ? "justify-end" : "justify-start"
            }`}
          >
            <div className="bg-gray-700 p-3 rounded-lg max-w-sm">
              {message.text && <p>{message.text}</p>}
              {message.file && (
                <img
                  src={message.file}
                  alt="Uploaded content"
                  className="mt-2 max-w-full"
                />
              )}
              <span className="text-xs text-gray-400">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-4 bg-gray-700 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          className="flex-1 p-2 bg-gray-800 border border-gray-600 rounded-lg"
        />
        <input
          type="file"
          accept="image/*,audio/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          📎
        </label>
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 p-2 rounded-lg text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
