import React from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-gray-800 text-white shadow-lg w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold">ISI A4</h2>
          </div>
          <div className="flex items-center space-x-4">
            <p>Signed in as <b>{Cookies.get('username')}</b></p>
            <p> | </p>
            <Link to="/logout" className="text-red-500 hover:text-gray-400">Logout</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-gray-900 text-white fixed top-0 left-0 flex flex-col space-y-4 py-6">
      <h2 className="text-xl font-bold text-center mb-4">Menu</h2>
      <ul className="space-y-2">
        <li>
          <Link to="/" className="block px-4 py-2 hover:bg-gray-700 rounded">
            Dashboard
          </Link>
        </li>
        <li>
          <Link className="block px-4 py-2 hover:bg-gray-700 rounded">
            Profile
          </Link>
        </li>
        <li>
          <Link to="/settings" className="block px-4 py-2 hover:bg-gray-700 rounded">
            Settings
          </Link>
        </li>
        <li>
          <Link to="/support" className="block px-4 py-2 hover:bg-gray-700 rounded">
            Support
          </Link>
        </li>
      </ul>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div>
      {/* Top Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Dashboard Content */}
        <div className="ml-64 p-6 w-full">
          <h1 className="text-4xl font-bold mb-4">Welcome to the Dashboard</h1>
          <h2 className="text-2xl">
            See <span className="text-blue-500">{Cookies.get('username')}</span>! The Login Works ;)
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
