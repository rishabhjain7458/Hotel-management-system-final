import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './../css/header.css';

const Header = ({ onLogout }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Set user state from localStorage
    } else {
      setUser(null); // Ensure user is null if not found
    }
  }, []); // Runs only on component mount

  const handleLogout = () => {
    localStorage.removeItem('user'); // Remove user data from localStorage
    localStorage.removeItem('token'); // Remove token as well
    setUser(null); // Update state to null after logout
    if (onLogout) onLogout(); // Trigger any additional logout functionality if provided
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Hotel Taj</Link>
      </div>
      <nav className="nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          {user ? (
            <>
              <li><Link to="/rooms">Rooms</Link></li>
              <li><Link to="/bookings">Bookings</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li>{`Welcome, ${user.name}`}</li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <li><Link to="/login">Login</Link></li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
