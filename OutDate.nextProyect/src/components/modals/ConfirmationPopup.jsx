import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

function ConfirmationPopup({ message, onConfirm, onCancel, visible }) {
  return (
    <Dialog
      header="Confirmación"
      visible={visible}
      onHide={onCancel}
      footer={
        <div>
          <Button label="Confirmar" icon="pi pi-check" className="p-button-success" onClick={onConfirm} autoFocus />
          <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={onCancel} />
        </div>
      }
      modal
      closable={false}
      style={{ minWidth: 320 }}
    >
      <p>{message}</p>
    </Dialog>
  );
}

ConfirmationPopup.propTypes = {
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default ConfirmationPopup; 