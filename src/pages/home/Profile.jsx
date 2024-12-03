import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";

const Profile = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [picture, setPicture] = useState(null);
  const [useCamera, setUseCamera] = useState(false);
  const webcamRef = useRef(null);

  // Function to get current location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(
            `${position.coords.latitude}, ${position.coords.longitude}`
          );
        },
        (error) => alert("Failed to retrieve location!")
      );
    } else {
      alert("Geolocation not supported by your browser!");
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setPicture(e.target.files[0]);
  };

  // Handle camera capture
  const handleCameraCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPicture(imageSrc);
    setUseCamera(false); // Close camera after capture
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if there's an access token
    const access_token = localStorage.getItem("access_token");

    if (!access_token) {
      console.error("Access token not found");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("location", location);

    // If the picture is a base64 string (from webcam), append as string
    if (typeof picture === "string") {
      formData.append("picture", picture);
    } else {
      formData.append("picture", picture); // Upload picture as file
    }

    // Send the request to the backend
    fetch("http://localhost:5000/api/profile", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`, // Include the access token
      },
      body: formData, // Send the form data with profile data and picture
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Profile updated successfully!");
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        alert("Error updating profile");
      });
  };

  // Automatically get location when component mounts
  useEffect(() => {
    getLocation();
  }, []);

  return (
    <div>
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="button" onClick={getLocation}>
          Get Current Location
        </button>
        <p>{location}</p>
        <label>Upload Picture:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="button" onClick={() => setUseCamera(true)}>
          Use Camera
        </button>
        {useCamera && (
          <div>
            <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
            <button type="button" onClick={handleCameraCapture}>
              Capture
            </button>
          </div>
        )}
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default Profile;
