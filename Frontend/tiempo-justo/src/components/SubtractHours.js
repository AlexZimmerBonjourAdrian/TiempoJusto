import React, { useState } from 'react';

function SubtractHours({ onSubtract }) {
  const [hoursToSubtract, setHoursToSubtract] = useState(0);

  const handleSubtract = () => {
    onSubtract(hoursToSubtract);
  };

  return (
    <div>
      <input
        type="number"
        value={hoursToSubtract}
        onChange={(e) => setHoursToSubtract(Number(e.target.value))}
        placeholder="Horas a restar"
      />
      <button onClick={handleSubtract}>Restar horas</button>
    </div>
  );
}

export default SubtractHours;