import React from 'react';
import { Link } from 'react-router-dom';
import './Home.scss';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="heading">Welcome to Our Hotel</h1>
        <p className="subheading">
          Discover comfort, luxury, and unforgettable experiences. 
          Your perfect stay awaits you in our meticulously designed rooms.
        </p>
        <div className="cta-buttons">
          <Link to="/rooms" className="btn btn-primary">
            Explore Rooms
          </Link>
          <Link to="/rooms" className="btn btn-secondary">
            Make a Booking
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;