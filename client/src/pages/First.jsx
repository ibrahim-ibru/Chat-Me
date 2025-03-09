// client/src/pages/First.jsx
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to ChatMe</h1>
        <p className="home-quote">"Stay connected, wherever you are!"</p>
        <div className="home-buttons">
          <Link to="/login" className="btn primary-btn">Login</Link>
          <Link to="/register" className="btn secondary-btn">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

