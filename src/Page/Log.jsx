import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

function Log({ closedTasks }) {

  return (
    <div>
      <h1>Log</h1>
      <DataTable value={closedTasks} responsiveLayout="scroll">
        <Column field="name" header="Name" />
        <Column field="importance" header="Importance" />
        <Column field="date" header="Date" body={(rowData) => {
           const date = new Date(rowData.date);
           return date.toLocaleDateString();
        }}/>
      </DataTable>
    </div>
  );
}

export default Log;