import React from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';



const Dashboard = () => {
    return (
      <div>
        <h1>Welcome to the Main Page</h1>
        <h2> See {Cookies.get('username')}! The Login Works  ;) </h2>
        <Link to="/logout">Logout</Link>
      </div>
    );
  };



export default Dashboard;
