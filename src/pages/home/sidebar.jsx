import React from "react";
import { FaHome, FaBell, FaEnvelope, FaUserFriends, FaUser, FaDollarSign, FaPlus } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-gray-900 text-white flex flex-col justify-between p-4 shadow-lg">
      {/* Top Section */}
      <div>
        
        <nav>
          <ul className="space-y-4 flex flex-col">
            <li className="flex items-center space-x-4 p-2 rounded-md hover:bg-gray-900 cursor-pointer">
              <FaHome className="text-xl" />
              <span className="text-lg font-medium">Home</span>
            </li>
            <li className="flex items-center space-x-4 p-2 rounded-md hover:bg-gray-800 cursor-pointer">
              <FaBell className="text-xl" />
              <span className="text-lg font-medium">Notifications</span>
            </li>
            <li className="flex items-center space-x-4 p-2 rounded-md hover:bg-gray-800 cursor-pointer">
              <FaEnvelope className="text-xl" />
              <span className="text-lg font-medium">Messages</span>
            </li>
            <li className="flex items-center space-x-4 p-2 rounded-md hover:bg-gray-800 cursor-pointer">
              <FaUserFriends className="text-xl" />
              <span className="text-lg font-medium">Friends</span>
            </li>
            <li className="flex items-center space-x-4 p-2 rounded-md hover:bg-gray-800 cursor-pointer">
              <FaDollarSign className="text-xl" />
              <span className="text-lg font-medium">Subscriptions</span>
            </li>
            <li className="flex items-center space-x-4 p-2 rounded-md hover:bg-gray-800 cursor-pointer">
              <FaUser className="text-xl" />
              <span className="text-lg font-medium">My Profile</span>
            </li>
          </ul>
        </nav>
      </div>

      {/* Bottom Section */}
      <div>
        <button className="w-full bg-blue-500 text-white flex items-center justify-center py-3 rounded-lg shadow-md hover:bg-blue-600">
          <FaPlus className="text-xl mr-2" />
          <span className="text-lg font-medium">Create Post</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
