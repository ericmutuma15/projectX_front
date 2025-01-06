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
      credentials: "include", // Allow credentials
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
    <div className="bg-gray-800 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-lg p-8 bg-gray-900 rounded-lg shadow-lg">
        <div
          className="relative h-40 bg-cover bg-center rounded-t-lg"
          style={{
            backgroundImage: `url(${picture || "/default-profile.png"})`,
          }}
        >
          <div className="absolute bottom-4 left-4 text-white text-2xl font-bold">{name || "User Name"}</div>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          <div>
            <label className="block text-gray-300 font-semibold">Name</label>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <div>
            <label className="block text-gray-300 font-semibold">Description</label>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <div>
            <button
              type="button"
              onClick={getLocation}
              className="text-blue-400 hover:underline"
            >
              Get Current Location
            </button>
            <p className="text-gray-400 mt-1">{location || "Location not set"}</p>
          </div>
  
          <div>
            <label className="block text-gray-300 font-semibold">Upload Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded mt-1 focus:outline-none"
            />
          </div>
  
          <button
            type="button"
            onClick={() => setUseCamera(true)}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mt-2"
          >
            Use Camera
          </button>
  
          {useCamera && (
            <div className="mt-4">
              <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
              <button
                type="button"
                onClick={handleCameraCapture}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-2"
              >
                Capture
              </button>
            </div>
          )}
  
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full mt-4"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
  
};

export default Profile;
