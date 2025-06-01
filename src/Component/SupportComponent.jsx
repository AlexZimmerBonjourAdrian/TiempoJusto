import React from 'react';
import './SupportComponent.css'; // Assuming you'll create a CSS file for styling

const SupportComponent = () => {
  return (
    <div className="support-container">
      <h2>Support Me</h2>
      <div className="support-links">
        <a href="https://ko-fi.com/yourkofi" target="_blank" rel="noopener noreferrer" className="kofi-button">
          <img src="https://ko-fi.com/img/githubbutton_sm.svg" alt="Ko-fi" />
          Support me on Ko-fi
        </a>
        <a href="https://www.patreon.com/yourpatreon" target="_blank" rel="noopener noreferrer" className="patreon-button">
          <img src="https://patreon.com/images/creators/button-creator-desktop@2x.png" alt="Patreon" />
          Support me on Patreon
        </a>
      </div>
    </div>
  );
};

export default SupportComponent;