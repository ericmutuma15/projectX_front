import React, { useState } from "react";
import {
  FaHome,
  FaBell,
  FaEnvelope,
  FaUserFriends,
  FaUser,
  FaDollarSign,
  FaPlus,
  FaBars,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative">
      {/* Sidebar for larger screens */}
      <div
        className={`h-screen w-64 bg-gray-900 text-white shadow-lg fixed left-0 top-0 z-40 flex flex-col ${
          isSidebarOpen ? "block" : "hidden"
        } lg:flex`}
      >
        {/* Navigation items */}
        <div className="flex flex-col justify-between h-full p-4 overflow-y-auto">
          <div className="space-y-4">
            <Link to="/home">
              <div className="flex items-center space-x-4 p-3 rounded-md hover:bg-gray-800 cursor-pointer">
                <FaHome className="text-xl" />
                <span className="text-lg font-medium">Home</span>
              </div>
            </Link>
            <Link to="/notifications">
              <div className="flex items-center space-x-4 p-3 rounded-md hover:bg-gray-800 cursor-pointer">
                <FaBell className="text-xl" />
                <span className="text-lg font-medium">Notifications</span>
              </div>
            </Link>
            <div className="flex items-center space-x-4 p-3 rounded-md hover:bg-gray-800 cursor-pointer">
              <FaEnvelope className="text-xl" />
              <span className="text-lg font-medium">Messages</span>
            </div>
            <Link to="/add-users">
              <div className="flex items-center space-x-4 p-3 rounded-md hover:bg-gray-800 cursor-pointer">
                <FaUserFriends className="text-xl" />
                <span className="text-lg font-medium">Add Friends</span>
              </div>
            </Link>
            <div className="flex items-center space-x-4 p-3 rounded-md hover:bg-gray-800 cursor-pointer">
              <FaDollarSign className="text-xl" />
              <span className="text-lg font-medium">Subscriptions</span>
            </div>
            <Link to="/profile">
              <div className="flex items-center space-x-4 p-3 rounded-md hover:bg-gray-800 cursor-pointer">
                <FaUser className="text-xl" />
                <span className="text-lg font-medium">My Profile</span>
              </div>
            </Link>
          </div>

          {/* Bottom button */}
          <div>
            <Link to="/create-post">
              <button className="w-full bg-blue-500 text-white flex items-center justify-center py-3 rounded-lg shadow-md hover:bg-blue-600">
                <FaPlus className="text-xl mr-2" />
                <span className="text-lg font-medium">Create Post</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Sidebar Toggle Button for mobile */}
      <button
        className="lg:hidden fixed top-16 left-4 bg-gray-900 text-white p-2 rounded-full shadow-lg z-50"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FaBars className="text-xl" />
      </button>
    </div>
  );
};

export default Sidebar;
