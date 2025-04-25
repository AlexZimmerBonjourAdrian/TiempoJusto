import React from 'react';
import './ConfirmationPopup.css'; // Create this file for styling

function ConfirmationPopup({ message, onConfirm, onCancel }) {
  return (
    <div className="confirmation-popup">
      <div className="popup-content">
        <p>{message}</p>
        <div className="button-group">
          <button onClick={onConfirm} className="confirm-button">Confirm</button>
          <button onClick={onCancel} className="cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPopup;