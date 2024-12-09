import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './../css/header.css';

const Header = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Track dropdown state

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    if (onLogout) onLogout();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prevState => !prevState); // Toggle dropdown state
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
              <li className="profile-container" onClick={toggleDropdown}>
                <div className="profile-icon">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt="Profile" />
                  ) : (
                    <span className="default-icon">👤</span>
                  )}
                </div>
                <div className={`profile-dropdown ${isDropdownOpen ? 'show' : ''}`}>
                  <p><strong>{user.name}</strong></p>
                  <p>{user.designation}</p>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </li>
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