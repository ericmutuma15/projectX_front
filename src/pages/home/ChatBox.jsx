import React, { useState, useEffect } from "react";

const ChatBox = ({ receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [media, setMedia] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, [receiverId]);

  const fetchMessages = async () => {
    const access_token = localStorage.getItem("access_token");
    const response = await fetch(`http://localhost:5000/api/messages/${receiverId}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const data = await response.json();
    setMessages(data);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("receiver_id", receiverId);
    formData.append("message", newMessage);
    if (media) formData.append("media", media);

    const access_token = localStorage.getItem("access_token");
    const response = await fetch("http://localhost:5000/api/messages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      body: formData,
    });

    if (response.ok) {
      setNewMessage("");
      setMedia(null);
      fetchMessages(); // Refresh messages
    }
  };

  return (
    <div>
      <div className="chat-box">
        {messages.map((msg) => (
          <div key={msg.id}>
            <p>{msg.message}</p>
            {msg.media_type === "image" && <img src={msg.media_url} alt="media" />}
            {msg.media_type === "audio" && <audio controls src={msg.media_url} />}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
        <input type="file" accept="image/*,audio/*" onChange={(e) => setMedia(e.target.files[0])} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatBox;
