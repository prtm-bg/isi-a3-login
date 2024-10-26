import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { EyeIcon, EyeOffIcon, UserIcon, KeyIcon, LoaderIcon, AlertCircle } from 'lucide-react';

// Custom Alert Component
const Alert = ({ children, className = '' }) => (
  <div className={`p-4 rounded-lg border flex items-start space-x-3 ${className}`}>
    <AlertCircle className="h-5 w-5 mt-0.5" />
    <div className="flex-1">{children}</div>
  </div>
);

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Form validation
    if (!username.trim() || !password.trim()) {
      setError('Please fill out both fields');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `http://152.67.176.72:8081/token`,
        { username: username.trim(), password: password },
        { 
          headers: { "Content-Type": 'application/x-www-form-urlencoded' },
          timeout: 10000 // 10 second timeout
        }
      );

      if (response.status === 200 && response.data.token_type === "bearer") {
        // Set cookies
        const cookieOptions = { 
          expires: 1,
        };
        
        Cookies.set('access_token', response.data.access_token, cookieOptions);
        Cookies.set('username', username.trim(), cookieOptions);
        Cookies.set('logged', 'true', cookieOptions);
        
        navigate('/');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.status === 401 
          ? 'Invalid username or password'
          : 'Unable to connect to the server. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-center text-white">Login</h2>
          <p className="text-gray-400 text-center">Please sign in to continue</p>
        </div>

        {error && (
          <Alert className="bg-red-900/20 border-red-500/50 text-red-400">
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-600 rounded-lg 
                           bg-gray-700/50 text-white placeholder-gray-400
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition duration-200"
                  placeholder="Enter your username"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-2.5 border border-gray-600 rounded-lg 
                           bg-gray-700/50 text-white placeholder-gray-400
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition duration-200"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 m-2 px-2 flex items-center justify-center text-gray-400 
                           hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent 
                     rounded-lg shadow-sm text-white bg-indigo-800 hover:bg-blue-700 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition duration-200"
          >
            {isLoading ? (
              <>
                <LoaderIcon className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;