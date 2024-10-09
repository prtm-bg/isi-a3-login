import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    setError('');

    if (!username || !password) {
      setError('Please fill out both fields');
      return;
    }

    try {
      const response = await axios.get(`http://152.67.176.72:8081/userauth?username=${username}&password=${password}`);

      if (response.data["auth"] == true) {
        // Redirect to dashboard on successful login
        Cookies.set('logged', 'true', { expires: 1 });
        Cookies.set('username', String(username), { expires: 1 });
        navigate('/');
      } else {
        // Show error message if credentials are incorrect
        setError('Invalid username or password');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while trying to log in');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray">
      <div className="w-full max-w-md p-8 space-y-6 bg-black shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-100">Login</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
