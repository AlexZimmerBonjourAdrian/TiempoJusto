import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

function Footer({ hasADHD, toggleADHDMode }) {
  return (
    <Card className="footer" style={{ textAlign: 'center', padding: 0, background: 'none', boxShadow: 'none', border: 'none' }}>
      <p>&copy; 2025 ZimTech. Todos los derechos reservados.</p>
      <Button
        label={`Cambiar a ${hasADHD ? 'Versión Normal' : 'Modo ADHD'}`}
        icon={hasADHD ? 'pi pi-times-circle' : 'pi pi-bolt'}
        className={hasADHD ? 'p-button-danger' : 'p-button-success'}
        style={{ marginTop: 10 }}
        onClick={toggleADHDMode}
      />
    </Card>
  );
}

Footer.propTypes = {
  hasADHD: PropTypes.bool.isRequired,
  toggleADHDMode: PropTypes.func.isRequired,
};

export default Footer; 