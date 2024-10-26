import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Home, User, Shield, HelpCircle, LogOut } from 'lucide-react';
import UserTable from './UserTable';

// Navbar Component with improved styling
const Navbar = () => {
  const username = Cookies.get('username');
  
  const handleLogout = () => {
    window.location.href = '/logout';
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold tracking-tight">ISI A4</h2>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">
              Signed in as <span className="font-semibold text-white">{username}</span>
            </span>
            <div className="h-6 w-px bg-gray-600" />
            <button
              onClick={handleLogout}
              className="flex items-center text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Enhanced Sidebar with active state and icons
const Sidebar = ({ activePage, setPage }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'admin', label: 'Admin', icon: Shield },
    { id: 'support', label: 'Support', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen w-64 bg-gray-900 text-white flex flex-col py-6">
      <div className="flex-1">
        <ul className="space-y-2 px-3">
          {menuItems.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <button
                onClick={() => setPage(id)}
                className={`
                  w-full flex items-center px-4 py-2.5 rounded-lg
                  transition-colors duration-200
                  ${activePage === id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <Icon className="w-5 h-5 mr-3" />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Enhanced Dashboard Content with better styling
const DashboardContent = () => (
  <div className="max-w-4xl">
    <h1 className="text-4xl font-bold mb-6">Welcome to the Dashboard</h1>
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl">
        Hello, <span className="text-blue-400 font-semibold">{Cookies.get('username')}</span>!
      </h2>
      <p className="mt-2 text-gray-300">You've successfully logged into the system.</p>
    </div>
  </div>
);

// Profile Component (keeping most of the existing logic but with improved styling)
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

  // ... (keeping the existing profile methods)
  
  const fetchProfile = async () => {
    try {
      const token = Cookies.get('access_token');
      if (!token) throw new Error("Session expired, please log in again.");

      const response = await axios.get('http://152.67.176.72:8081/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProfile(response.data);
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
      reader.onload = (e) => setNewImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateImage = async () => {
    try {
      const token = Cookies.get('access_token');
      if (!token) throw new Error("Session expired, please log in again.");

      await axios.post('http://152.67.176.72:8081/update', {
        username: profile.username,
        email: profile.email,
        image_base64: newImage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUpdateSuccess('Profile image updated successfully!');
      setIsEditing(false);
      setImageLoadError(false);
      fetchProfile();
      
      setTimeout(() => setUpdateSuccess(''), 3000);
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
          className="w-full h-full object-cover rounded-full"
          onError={() => setImageLoadError(true)}
        />
      );
    }

    if (!profile?.image_base64 || imageLoadError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-300 text-sm text-center rounded-full">
          <User className="w-12 h-12" />
        </div>
      );
    }

    return (
      <img
        src={profile.image_base64}
        alt="Profile"
        className="w-full h-full object-cover rounded-full"
        onError={() => setImageLoadError(true)}
      />
    );
  };

  if (error) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Profile</h1>
      
      {profile ? (
        <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-32 h-32 relative">
              <div className="w-full h-full rounded-full overflow-hidden ring-4 ring-gray-700">
                {renderProfileImage()}
              </div>
            </div>

            <div className="w-full space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                  {imageError && (
                    <p className="text-red-400 text-sm text-center">{imageError}</p>
                  )}
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={handleUpdateImage}
                      disabled={!newImage || imageError}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Save Image
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setNewImage(null);
                        setImageError('');
                      }}
                      className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Change Profile Picture
                </button>
              )}

              {updateSuccess && (
                <div className="text-green-400 text-center bg-green-900/20 p-2 rounded">
                  {updateSuccess}
                </div>
              )}
            </div>

            <div className="w-full space-y-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Username</p>
                <p className="text-white font-semibold text-center">{profile.username}</p>
              </div>
              
              <div className="bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Email</p>
                <p className="text-white font-semibold text-center">{profile.email}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-blue-600"></div>
          <p className="mt-4 text-gray-400">Loading profile...</p>
        </div>
      )}
    </div>
  );
};

// Enhanced Admin Content
const AdminContent = () => (
  <div className="max-w-6xl">
    <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <UserTable />
    </div>
  </div>
);

// Enhanced Support Content
const SupportContent = () => (
  <div className="max-w-4xl">
    <h1 className="text-4xl font-bold mb-6">Support Center</h1>
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
      <p className="text-gray-300">
        Our support team is here to help you. Please reach out through any of our support channels.
      </p>
    </div>
  </div>
);

// Main Dashboard Component
const Dashboard = () => {
  const [page, setPage] = useState('dashboard');

  const renderContent = () => {
    switch (page) {
      case 'dashboard': return <DashboardContent />;
      case 'profile': return <ProfileContent />;
      case 'admin': return <AdminContent />;
      case 'support': return <SupportContent />;
      default: return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="flex">
        <Sidebar activePage={page} setPage={setPage} />
        <main className="flex-1 p-8 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;