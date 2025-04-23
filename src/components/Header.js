import React from 'react';
import { Menubar } from 'primereact/menubar';

function Header() {
  const items = [
    { label: 'Inicio', icon: 'pi pi-home' },
    { label: 'Tareas', icon: 'pi pi-list' },
    { label: 'Perfil', icon: 'pi pi-user' },
  ];

  return (
    <header className="App-header">
      <Menubar model={items} />
    </header>
  );
}

export default Header;