import React, { useState } from 'react';
import './../css/signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    designation: 'Staff', // Default designation
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:2020/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error: ${text}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        setMessage('Signed up successfully!');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        // Optionally clear the form fields after success
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          designation: 'Staff',
        });
      } else {
        setError('Error in signing up: ' + (data.message || 'Please try again.'));
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Network error: ' + error.message);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-form">
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Designation:</label>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              required
            >
              <option value="Staff">Staff</option>
              <option value="Manager">Manager</option>
              {/* Add more options as needed */}
            </select>
          </div>
          <button type="submit">Signup</button>
          Already a user? <a href="/login">Login</a>
        </form>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default Signup;
