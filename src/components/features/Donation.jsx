import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

function Donation() {
  const handleWatchAd = () => {
    alert('Gracias por tu apoyo. Aquí se mostraría un anuncio.');
    // Aquí se integraría un servicio de anuncios como Google AdSense o similar.
  };

  return (
    <Card className="donation-section" title="Apóyanos">
      <p>Si te gusta esta aplicación, considera apoyarnos con un café o viendo un anuncio:</p>
      <div style={{ marginBottom: 12 }}>
        <Button
          label="Ko-fi"
          icon="pi pi-heart"
          className="p-button-text p-button-rounded"
          style={{ marginRight: 10 }}
          onClick={() => window.open('https://ko-fi.com/zimtech', '_blank', 'noopener noreferrer')}
        />
        <Button
          label="Cafecito"
          icon="pi pi-coffee"
          className="p-button-text p-button-rounded"
          onClick={() => window.open('https://cafecito.app/zimtech', '_blank', 'noopener noreferrer')}
        />
      </div>
      <Button
        label="Ver un anuncio para apoyarnos"
        icon="pi pi-video"
        className="p-button-success p-button-rounded"
        onClick={handleWatchAd}
      />
    </Card>
  );
}

export default Donation; 