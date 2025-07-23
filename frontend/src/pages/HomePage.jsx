import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './../css/home.css';  // Import the CSS file

const images = [
  'https://i0.wp.com/theluxurytravelexpert.com/wp-content/uploads/2014/03/trump-hotel-chicago-illinois-usa.jpg',
  'https://media.istockphoto.com/id/627892060/photo/hotel-room-suite-with-view.jpg?s=612x612&w=0&k=20&c=YBwxnGH3MkOLLpBKCvWAD8F__T-ypznRUJ_N13Zb1cU=',
  'https://media.istockphoto.com/id/1050564510/photo/3d-rendering-beautiful-luxury-bedroom-suite-in-hotel-with-tv.jpg?s=612x612&w=0&k=20&c=ZYEso7dgPl889aYddhY2Fj3GOyuwqliHkbbT8pjl_iM=',
  'https://cdn.pixabay.com/photo/2017/01/14/12/48/hotel-1979406_640.jpg',
  'https://media.istockphoto.com/id/1390233984/photo/modern-luxury-bedroom.jpg?s=612x612&w=0&k=20&c=po91poqYoQTbHUpO1LD1HcxCFZVpRG-loAMWZT7YRe4='
];

const HomePage = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prevImage => (prevImage + 1) % images.length);
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <div 
        className="hero-section" 
        style={{ backgroundImage: `url(${images[currentImage]})` }}
      >
        <h1>Admin Dashboard</h1>
        <p>Manage hotel operations efficiently</p>
      </div>
      <section className="services-section">
        <h2>Admin Services</h2>
        <div className="service-grid">
          <div className="service">
            <h3>Room Management</h3>
            <p>Easily add, modify, or delete room listings and manage availability.</p>
          </div>
          <div className="service">
            <h3>Booking Management</h3>
            <p>Track and manage all customer bookings and reservations.</p>
          </div>
          <div className="service">
            <h3>Customer Support</h3>
            <p>Provide support and assistance to guests when needed.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
