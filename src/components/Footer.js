import React from 'react';
import PropTypes from 'prop-types';
import './Footer.css';

function Footer({ hasADHD, toggleADHDMode }) {
  return (
    <footer className="footer" style={{ textAlign: 'center', padding: '10px', backgroundColor: '#4A148C', color: 'white', borderRadius: '8px' }}>
      <p>&copy; 2025 ZimTech. Todos los derechos reservados.</p>
      <button 
        onClick={toggleADHDMode} 
        style={{ 
          backgroundColor: hasADHD ? '#f44336' : '#4CAF50', 
          color: 'white', 
          border: 'none', 
          padding: '10px 20px', 
          fontSize: '0.9em', 
          borderRadius: '5px', 
          cursor: 'pointer', 
          marginTop: '10px' 
        }}
      >
        Cambiar a {hasADHD ? 'Versión Normal' : 'Modo ADHD'}
      </button>
    </footer>
  );
}

Footer.propTypes = {
  hasADHD: PropTypes.bool.isRequired,
  toggleADHDMode: PropTypes.func.isRequired,
};

export default Footer;