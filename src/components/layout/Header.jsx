import React from 'react';
import { Card } from 'primereact/card';

function Header() {
  return (
    <Card className="app-header" style={{ background: 'var(--color-accent)', color: '#F3E5F5', textAlign: 'center', border: 'none', boxShadow: 'none', borderRadius: 8 }}>
      <h1 className="app-title">Cómete esos sapos: Filosofías de Productividad</h1>
    </Card>
  );
}

export default Header; 