import React from 'react';

function About() {
  return (
    <div className="about-section">
      {/* Línea separadora entre la lista de tareas y la leyenda */}
      <hr className="hr-separator" />

      <div className="legend">
        <h1>Tasks for your day</h1>
        <p>Focus on what's important</p>
      </div>
        {/* Línea separadora entre la lista de tareas y la leyenda */}
        <hr className="hr-separator" />

<div className="legend">
  <h1>Tasks for your day</h1>
  <p>Focus on what's important</p>
</div>

{/* Línea separadora azul */}
<hr className="hr-blue-separator" />

    {/* Línea separadora entre la leyenda y la información del diseño */}
    <hr className="hr-separator" />

    <div className="layout-info">
    <h2>Application Purpose</h2>
    <p>"Tiempo Justo" is a tool designed to help you manage your daily tasks efficiently and meaningfully. Inspired by the productivity philosophies of Brian Tracy and the principles of personal responsibility of Jordan Peterson, this application seeks to empower you to focus on what really matters and move towards your goals with clarity and purpose.</p>

    <h3>Main Focus</h3>
    <ul>
        <li><strong>Prioritize what's important:</strong> Identify and complete the most important and meaningful tasks first.</li>
        <li><strong>Personal Responsibility:</strong> Keep a record of your daily achievements to build a positive narrative about your progress.</li>
        <li><strong>Time Management:</strong> Limit your daily tasks to 8 to maintain a clear focus on your priorities.</li>
        </ul>

        <h3>Filosofías Inspiradoras</h3>
        <ul>
        <li><strong>Brian Tracy:</strong> "Come That Frog" te anima a abordar primero las tareas más difíciles y significativas.</li>
        <li><strong>Jordan Peterson:</strong> "Poner tu casa en orden" fomenta la responsabilidad personal y el progreso diario.</li>
        </ul>

        <h3>Benefits</h3>
        <ul>
        <li>Increase your productivity by focusing on what really matters.</li>
        <li>Reduce stress by limiting the number of daily tasks.</li>
        <li>Foster a sense of accomplishment and personal responsibility.</li>
        <li>Helps you build positive habits that impact your life in the long term.</li>
        </ul>
    </div>

    {/* Línea separadora entre la información del diseño y la sección Acerca de */}
    <hr style={{ border: '1px solid #ccc', margin: '20px 0' }} />

    {/* Sección Acerca de */}
    <div className="about-section">
        <h2>About "Tiempo Justo"</h2>
        <p>"Tiempo Justo" is an application designed to help you manage your daily tasks efficiently. Prioritize what's important, keep a record of your achievements, and move towards your goals with clarity and purpose.</p>
        <p>Use the available tools to add, complete, and delete tasks, and consult the productivity log to evaluate your daily progress.</p>
    </div>
    </div>
  );
}

export default About;