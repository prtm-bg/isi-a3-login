import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill out both fields');
      return;
    }

    try {
      const response = await axios.post(
        `http://152.67.176.72:8081/token`,
        { username: username, password: password },
        { headers: { "Content-Type": 'application/x-www-form-urlencoded' } }
      );

      if (response.status === 200) {
        if (response.data["token_type"] === "bearer") {
          Cookies.set('access_token', response.data["access_token"], { expires: 1 });
          Cookies.set('username', String(username), { expires: 1 });
          Cookies.set('logged', 'true', { expires: 1 });
          navigate('/');
        }
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while trying to log in');
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle the visibility state
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
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
              <div className="relative flex items-center"> 
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'} // Toggle input type
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="h-3 absolute right-3 flex items-center" // Adjust position to center right
                >
                  {showPassword ? (
                    // Eye icon when password is visible
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12s3-9 9-9 9 9 9 9-3 9-9 9-9-9-9-9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12c0 1.5-.68 2.85-1.76 3.76M9.88 9.88A4.5 4.5 0 006 12c0 1.5.68 2.85 1.76 3.76M12 12a4.5 4.5 0 00-1.74-3.74" />
                    </svg>
                  ) : (
                    // Eye slash icon when password is hidden
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18M9.88 9.88A4.5 4.5 0 006 12c0 1.5.68 2.85 1.76 3.76M15 12c0 1.5-.68 2.85-1.76 3.76M10.26 10.26A4.5 4.5 0 0012 12m0 0a4.5 4.5 0 00-1.74-3.74" />
                    </svg>
                  )}
                </button>
              </div>
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
}

export default Login;
