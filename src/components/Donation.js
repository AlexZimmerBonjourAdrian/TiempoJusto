import React from 'react';
import './Donation.css';

function Donation() {
  const handleWatchAd = () => {
    alert('Gracias por tu apoyo. Aquí se mostraría un anuncio.');
    // Aquí se integraría un servicio de anuncios como Google AdSense o similar.
  };

  return (
    <div className="donation-section" style={{ textAlign: 'center', padding: '15px', backgroundColor: '#F3E5F5', borderRadius: '8px' }}>
      <h3>Apóyanos</h3>
      <p>Si te gusta esta aplicación, considera apoyarnos con un café o viendo un anuncio:</p>
      <a href="https://ko-fi.com/zimtech" target="_blank" rel="noopener noreferrer" style={{ marginRight: '10px', textDecoration: 'none', color: '#4A148C', fontWeight: 'bold' }}>Ko-fi</a>
      <a href="https://cafecito.app/zimtech" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#4A148C', fontWeight: 'bold' }}>Cafecito</a>
      <button onClick={handleWatchAd} className="watch-ad-button" style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#4A148C', color: '#FFFFFF', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Ver un anuncio para apoyarnos</button>
    </div>
  );
}

export default Donation;