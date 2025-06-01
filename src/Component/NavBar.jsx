import React from 'react';
import { Link } from 'react-router-dom';
import '../Style/global.css'; // Assuming you have a global CSS file

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        {/* Placeholder for logo - Replace with your logo */}
        <span>Your Logo</span>
      </div>
      <div className="navbar-links">
        <Link to="/log">Log</Link>
      </div>
      <div className="navbar-hamburger">
        {/* Placeholder for hamburger menu - Implement later */}
        &#9776;
      </div>
    </nav>
  );
}

export default NavBar;