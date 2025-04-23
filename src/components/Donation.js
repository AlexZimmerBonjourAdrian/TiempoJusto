import React from 'react';
import './Donation.css';

function Donation() {
  return (
    <div className="donation-section" style={{ textAlign: 'center', padding: '15px', backgroundColor: '#F3E5F5', borderRadius: '8px' }}>
      <h3>Apóyanos</h3>
      <p>Si te gusta esta aplicación, considera apoyarnos con un café:</p>
      <a href="https://ko-fi.com/zimtech" target="_blank" rel="noopener noreferrer" style={{ marginRight: '10px', textDecoration: 'none', color: '#4A148C', fontWeight: 'bold' }}>Ko-fi</a>
      <a href="https://cafecito.app/zimtech" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#4A148C', fontWeight: 'bold' }}>Cafecito</a>
    </div>
  );
}

export default Donation;