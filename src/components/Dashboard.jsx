import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import UserTable from './UserTable';

// Navbar Component
const Navbar = () => {
  return (
    <nav className="top-0 relative bg-gray-800 text-white shadow-lg w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold">ISI A4</h2>
          </div>
          <div className="flex items-center space-x-4">
            <p>Signed in as <b>{Cookies.get('username')}</b></p>
            <p> | </p>
            <a href="/logout" className="text-red-500 hover:text-gray-400">Logout</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Sidebar Component with Page Switching Logic
const Sidebar = ({ setPage }) => {
  return (
    <div className="h-screen bg-gray-900 text-white relative top-0 left-0 flex flex-col space-y-4 py-6">
      <ul className="space-y-2 px-10">
        <li>
          <button
            onClick={() => setPage('dashboard')}
            className="block w-full text-center px-20 py-2 hover:bg-gray-700 rounded"
          >
            Dashboard
          </button>
        </li>
        <li>
          <button
            onClick={() => setPage('profile')}
            className="block w-full text-center px-20 py-2 hover:bg-gray-700 rounded"
          >
            Profile
          </button>
        </li>
        <li>
          <button
            onClick={() => setPage('admin')}
            className="block w-full text-center px-20 py-2 hover:bg-gray-700 rounded"
          >
            Admin
          </button>
        </li>
        <li>
          <button
            onClick={() => setPage('support')}
            className="block w-full text-center px-20 py-2 hover:bg-gray-700 rounded"
          >
            Support
          </button>
        </li>
      </ul>
    </div>
  );
};

// Page Components
const DashboardContent = () => (
  <div>
    <h1 className="text-4xl font-bold mb-4">Welcome to the Dashboard</h1>
    <h2 className="text-2xl">
      See <span className="text-blue-500">{Cookies.get('username')}</span>! The Login Works ;)
    </h2>
  </div>
);

// Profile Component with Authorization
const ProfileContent = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [imageError, setImageError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [imageLoadError, setImageLoadError] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = Cookies.get('access_token');
      if (!token) {
        throw new Error("Session expired, please log in again.");
      }

      const response = await axios.get('http://152.67.176.72:8081/users/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setProfile(response.data);
      // Reset image load error when new profile data is fetched
      setImageLoadError(false);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500 * 1024) {
        setImageError('Image size must be less than 500KB');
        e.target.value = '';
        return;
      }
      setImageError('');
      setImageLoadError(false);

      const reader = new FileReader();
      reader.onload = (e) => {
        setNewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateImage = async () => {
    try {
      const token = Cookies.get('access_token');
      if (!token) {
        throw new Error("Session expired, please log in again.");
      }

      await axios.post('http://152.67.176.72:8081/update', {
        username: profile.username,
        email: profile.email,
        image_base64: newImage
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUpdateSuccess('Profile image updated successfully!');
      setIsEditing(false);
      setImageLoadError(false);
      fetchProfile();
      
      setTimeout(() => {
        setUpdateSuccess('');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    }
  };

  const renderProfileImage = () => {
    if (isEditing && newImage) {
      return (
        <img
          src={newImage}
          alt="Profile"
          className="w-full h-full object-cover"
          onError={() => setImageLoadError(true)}
        />
      );
    }

    if (!profile?.image_base64 || imageLoadError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-300 text-sm text-center rounded-full">
          No Image Uploaded
        </div>
      );
    }

    return (
      <img
        src={profile.image_base64}
        alt="Profile"
        className="w-full h-full object-cover"
        onError={() => setImageLoadError(true)}
      />
    );
  };

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Profile</h1>
      
      {profile ? (
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex flex-col items-center w-full">
            <div className="flex flex-col items-center w-full mb-8">
              <div className="w-32 h-32 relative mb-4">
                <div className="w-full h-full rounded-full overflow-hidden">
                  {renderProfileImage()}
                </div>
              </div>

              <div className="flex flex-col items-center w-full gap-4">
                {isEditing ? (
                  <>
                    <div className="flex flex-col items-center w-full gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="text-sm text-gray-300 text-center w-full max-w-xs"
                      />
                      {imageError && (
                        <p className="text-red-500 text-sm text-center">{imageError}</p>
                      )}
                    </div>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={handleUpdateImage}
                        disabled={!newImage || imageError}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Save Image
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setNewImage(null);
                          setImageError('');
                        }}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Change Profile Picture
                  </button>
                )}
              </div>

              {updateSuccess && (
                <div className="text-green-500 mt-4 text-center">{updateSuccess}</div>
              )}
            </div>

            <div className="w-full max-w-md space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Username</p>
                <p className="text-white font-semibold text-center">{profile.username}</p>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Email</p>
                <p className="text-white font-semibold text-center">{profile.email}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="mt-4 text-gray-300">Loading profile...</p>
        </div>
      )}
    </div>
  );
};

// Admin Component for managing users
const AdminContent = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Admin</h1>
      <UserTable />
    </div>
  );
};


const SupportContent = () => (
  <div>
    <h1 className="text-4xl font-bold mb-4">Support</h1>
    <p>Get help and contact support here.</p>
  </div>
);

// Main Dashboard Component
const Dashboard = () => {
  const [page, setPage] = useState('dashboard');  // State to track the active page

  const renderContent = () => {
    switch (page) {
      case 'dashboard':
        return <DashboardContent />;
      case 'profile':
        return <ProfileContent />;
      case 'admin':
        return <AdminContent />;
      case 'support':
        return <SupportContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div>
      {/* Top Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar setPage={setPage} />

        {/* Dynamic Content Based on Page Selection */}
        <div className="flex-1 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;