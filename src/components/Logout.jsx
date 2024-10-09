import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove the auth token cookie
    Cookies.remove('logged');
    Cookies.remove('username');
    // Redirect to login page
    navigate('/login');
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default Logout;
