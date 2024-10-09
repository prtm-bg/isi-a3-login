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
        navigate('/dashboard');
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
    <div className='logindiv'>
      <form className='loginform' onSubmit={handleLogin}>
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className='logininputdiv'>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className='logininputdiv'>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
