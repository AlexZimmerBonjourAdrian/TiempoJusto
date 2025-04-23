import React, { useState } from 'react';
import './ADHDView.css';
import ADHDTaskBoard from './ADHDTaskBoard';
import ADHDHourCalculator from './ADHDHourCalculator';

function ADHDView() {
  const [focusMode, setFocusMode] = useState(false);

  const toggleFocusMode = () => {
    setFocusMode((prevMode) => !prevMode);
  };

  return (
    <div className={`adhd-view ${focusMode ? 'focus-mode' : ''}`}>
      <h1>Welcome to the ADHD-Optimized View</h1>
      <p>This view is designed to help you focus and stay organized.</p>
      <button onClick={toggleFocusMode} className="focus-mode-toggle">
        {focusMode ? 'Disable Focus Mode' : 'Enable Focus Mode'}
      </button>
      {focusMode && (
        <div className="focus-tips">
          <h2>Focus Tips</h2>
          <ul>
            <li>Break tasks into smaller steps.</li>
            <li>Use a timer to stay on track.</li>
            <li>Take short breaks to recharge.</li>
          </ul>
        </div>
      )}
      <ADHDTaskBoard />
      <ADHDHourCalculator />
    </div>
  );
}

export default ADHDView;