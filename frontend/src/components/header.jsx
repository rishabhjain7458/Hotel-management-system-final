import React from 'react';
import { Link } from 'react-router-dom';  // Add this import
import './../css/header.css';

const Header = ({ user, onLogout }) => {
  const handleLogout = () => {
    localStorage.removeItem('user');
    onLogout();
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Hotel Taj</Link>
      </div>
      <nav className="nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/rooms">Rooms</Link></li>
          <li><Link to="/bookings">Bookings</Link></li>
          <li><Link to="/events">Events</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          {user ? (
            <>
              <li>{`Welcome, ${user.name}`}</li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Signup</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
