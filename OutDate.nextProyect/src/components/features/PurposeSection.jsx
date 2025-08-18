import React from 'react';

function PurposeSection() {
  return (
    <div className="minimal-card" style={{ maxWidth: 520 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 8 }}>Propósito de la Aplicación</h2>
      <p style={{ color: 'var(--color-text-soft)', marginBottom: 18 }}>
        "Tiempo Justo" es una herramienta para gestionar tus tareas diarias de forma eficiente y significativa. Inspirada en Brian Tracy y Jordan Peterson, te ayuda a enfocarte en lo importante y avanzar hacia tus metas con claridad y propósito.
      </p>
      <h3 style={{ color: 'var(--color-accent)', marginTop: 18 }}>Enfoque Principal</h3>
      <ul style={{ color: 'var(--color-text)', fontSize: '1.05rem', margin: 0, paddingLeft: 18 }}>
        <li><strong>Prioriza lo importante:</strong> Completa primero las tareas más significativas.</li>
        <li><strong>Responsabilidad personal:</strong> Lleva un registro de tus logros diarios.</li>
        <li><strong>Gestión del tiempo:</strong> Limita tus tareas diarias a 8 para mantener el foco.</li>
      </ul>
      <h3 style={{ color: 'var(--color-accent)', marginTop: 18 }}>Filosofías Inspiradoras</h3>
      <ul style={{ color: 'var(--color-text)', fontSize: '1.05rem', margin: 0, paddingLeft: 18 }}>
        <li><strong>Brian Tracy:</strong> "Come That Frog" te anima a abordar primero las tareas más difíciles.</li>
        <li><strong>Jordan Peterson:</strong> "Poner tu casa en orden" fomenta la responsabilidad personal y el progreso diario.</li>
      </ul>
      <h3 style={{ color: 'var(--color-accent)', marginTop: 18 }}>Beneficios</h3>
      <ul style={{ color: 'var(--color-text)', fontSize: '1.05rem', margin: 0, paddingLeft: 18 }}>
        <li>Aumenta tu productividad enfocándote en lo que importa.</li>
        <li>Reduce el estrés limitando el número de tareas diarias.</li>
        <li>Fomenta el sentido de logro y responsabilidad personal.</li>
        <li>Ayuda a crear hábitos positivos a largo plazo.</li>
      </ul>
    </div>
  );
}

export default PurposeSection; 