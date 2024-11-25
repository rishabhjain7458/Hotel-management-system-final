import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import './../css/login.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch('http://localhost:2020/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error: ${text}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        setMessage('Logged in successfully!');
        localStorage.setItem('token', data.token);
        onLogin(data.user); // Pass the logged-in user to the parent component
        setTimeout(() => {
          window.location.href = '/rooms';
        }, 2000);
      } else {
        setError(`Error in logging in: ${data.message || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error: ' + error.message);
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    try {
      const googleToken = response.credential; // Google-provided credential
      const backendResponse = await fetch('http://localhost:2020/users/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: googleToken })
      });

      if (!backendResponse.ok) {
        throw new Error('Google login failed.');
      }

      const data = await backendResponse.json();

      if (data.status === 'success') {
        setMessage('Google login successful!');
        localStorage.setItem('token', data.token);
        onLogin(data.user);
        setTimeout(() => {
          window.location.href = '/rooms';
        }, 2000);
      } else {
        setError(`Google login error: ${data.message}`);
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError('Failed to log in with Google. Please try again.');
    }
  };

  return (
    <GoogleOAuthProvider clientId="372191723492-gl69ssncjr1v9jfnrlfated3g8gv9krt.apps.googleusercontent.com"> 
      <div className="login-page">
        <div className="login-form">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
              <label>Password:</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <button type="submit">Login</button>
          </form>
          <div className="oauth-section">
            <h3>Or log in with Google</h3>
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => setError('Google login failed.')}
            />
          </div>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
