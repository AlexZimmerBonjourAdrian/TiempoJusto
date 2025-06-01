import React from 'react';
import './FooterComponent.css'; // Assuming you'll create a CSS file for styling

const FooterComponent = () => {
  return (
    <footer className="footer-container">
      <p>&copy; {new Date().getFullYear()} ZimTech. All rights reserved.</p>
    </footer>
  );
};

export default FooterComponent;