'use client'

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function ScrumBoard() {
  const [projects, setProjects] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [currentSprint, setCurrentSprint] = useState(null);
  const [showSprintForm, setShowSprintForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);

  // Estados para formularios
  const [sprintData, setSprintData] = useState({
    name: '',
    duration: 14,
    goal: '',
    startDate: ''
  });

  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    priority: 'medium',
    storyPoints: 0,
    status: 'backlog'
  });

  useEffect(() => {
    // Cargar datos guardados
    try {
      const savedProjects = Cookies.get('scrumProjects');
      const savedSprints = Cookies.get('scrumSprints');
      const savedCurrentSprint = Cookies.get('currentSprint');
      
      if (savedProjects) setProjects(JSON.parse(savedProjects));
      if (savedSprints) setSprints(JSON.parse(savedSprints));
      if (savedCurrentSprint) setCurrentSprint(JSON.parse(savedCurrentSprint));
    } catch (error) {
      console.error('Error loading scrum data:', error);
    }
  }, []);

  useEffect(() => {
    // Guardar datos
    try {
      Cookies.set('scrumProjects', JSON.stringify(projects), { expires: 182 });
      Cookies.set('scrumSprints', JSON.stringify(sprints), { expires: 182 });
      if (currentSprint) {
        Cookies.set('currentSprint', JSON.stringify(currentSprint), { expires: 182 });
      }
    } catch (error) {
      console.error('Error saving scrum data:', error);
    }
  }, [projects, sprints, currentSprint]);

  const createSprint = () => {
    if (!sprintData.name || !sprintData.goal || !sprintData.startDate) {
      alert('Por favor completa todos los campos del sprint.');
      return;
    }

    const newSprint = {
      id: Date.now(),
      ...sprintData,
      status: 'active',
      createdAt: new Date().toISOString(),
      endDate: new Date(new Date(sprintData.startDate).getTime() + sprintData.duration * 24 * 60 * 60 * 1000).toISOString(),
      velocity: 0,
      completedPoints: 0,
      totalPoints: 0
    };

    setSprints([...sprints, newSprint]);
    setCurrentSprint(newSprint);
    setSprintData({ name: '', duration: 14, goal: '', startDate: '' });
    setShowSprintForm(false);
  };

  const addProjectToSprint = (projectId, sprintId) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedProject = { ...project, status: 'in-progress', sprintId };
    setProjects(projects.map(p => p.id === projectId ? updatedProject : p));

    // Actualizar estadísticas del sprint
    const sprint = sprints.find(s => s.id === sprintId);
    if (sprint) {
      const updatedSprint = {
        ...sprint,
        totalPoints: sprint.totalPoints + project.storyPoints
      };
      setSprints(sprints.map(s => s.id === sprintId ? updatedSprint : s));
    }
  };

  const moveProject = (projectId, newStatus) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    let updatedProject = { ...project, status: newStatus };

    // Si se completa, actualizar estadísticas del sprint
    if (newStatus === 'done' && project.sprintId) {
      const sprint = sprints.find(s => s.id === project.sprintId);
      if (sprint) {
        const updatedSprint = {
          ...sprint,
          completedPoints: sprint.completedPoints + project.storyPoints,
          velocity: (sprint.completedPoints + project.storyPoints) / sprint.duration
        };
        setSprints(sprints.map(s => s.id === project.sprintId ? updatedSprint : s));
      }
    }

    setProjects(projects.map(p => p.id === projectId ? updatedProject : p));
  };

  const createProject = () => {
    if (!projectData.name || !projectData.description) {
      alert('Por favor completa todos los campos del proyecto.');
      return;
    }

    const newProject = {
      id: Date.now(),
      ...projectData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sprintId: null
    };

    setProjects([...projects, newProject]);
    setProjectData({ name: '', description: '', priority: 'medium', storyPoints: 0, status: 'backlog' });
    setShowProjectForm(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      'backlog': '#6c757d',
      'in-progress': '#ffc107',
      'review': '#17a2b8',
      'done': '#28a745'
    };
    return colors[status] || '#6c757d';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'low': '#28a745',
      'medium': '#ffc107',
      'high': '#dc3545'
    };
    return colors[priority] || '#6c757d';
  };

  const getSprintStatus = (sprint) => {
    const now = new Date();
    const endDate = new Date(sprint.endDate);
    
    if (now > endDate) return 'completed';
    if (sprint.status === 'active') return 'active';
    return 'planned';
  };

  const columns = [
    { id: 'backlog', title: '📋 Backlog', color: '#6c757d' },
    { id: 'in-progress', title: '🔄 En Progreso', color: '#ffc107' },
    { id: 'review', title: '👀 En Revisión', color: '#17a2b8' },
    { id: 'done', title: '✅ Completado', color: '#28a745' }
  ];

  return (
    <div className="minimal-card" style={{ maxWidth: 1200 }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: 'var(--color-accent)', marginBottom: '10px' }}>
          🚀 Scrum Board - Gestión Ágil de Proyectos
        </h2>
        <p style={{ color: 'var(--color-muted)' }}>
          Implementa metodología Scrum para gestionar tus proyectos de manera eficiente
        </p>
      </div>

      {/* Sprint actual */}
      {currentSprint && (
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          padding: '20px',
          color: 'white',
          marginBottom: '30px'
        }}>
          <h3 style={{ marginBottom: '15px' }}>🎯 Sprint Actual: {currentSprint.name}</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '15px',
            marginBottom: '15px'
          }}>
            <div>
              <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{currentSprint.completedPoints}/{currentSprint.totalPoints}</div>
              <div style={{ fontSize: '0.9em' }}>Story Points</div>
            </div>
            <div>
              <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{currentSprint.velocity.toFixed(1)}</div>
              <div style={{ fontSize: '0.9em' }}>Velocidad (pts/día)</div>
            </div>
            <div>
              <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                {Math.ceil((new Date(currentSprint.endDate) - new Date()) / (1000 * 60 * 60 * 24))}
              </div>
              <div style={{ fontSize: '0.9em' }}>Días Restantes</div>
            </div>
            <div>
              <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                {currentSprint.totalPoints > 0 ? ((currentSprint.completedPoints / currentSprint.totalPoints) * 100).toFixed(1) : 0}%
              </div>
              <div style={{ fontSize: '0.9em' }}>Progreso</div>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: '0.95em', fontStyle: 'italic' }}>
            <strong>Objetivo:</strong> {currentSprint.goal}
          </p>
        </div>
      )}

      {/* Controles */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setShowSprintForm(true)}
          style={{
            padding: '10px 20px',
            background: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🚀 Crear Sprint
        </button>
        <button
          onClick={() => setShowProjectForm(true)}
          style={{
            padding: '10px 20px',
            background: 'var(--color-accent)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          📋 Agregar Proyecto
        </button>
        {currentSprint && (
          <button
            onClick={() => {
              if (window.confirm('¿Estás seguro de que quieres finalizar el sprint actual?')) {
                setCurrentSprint(null);
              }
            }}
            style={{
              padding: '10px 20px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🏁 Finalizar Sprint
          </button>
        )}
      </div>

      {/* Kanban Board */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        {columns.map(column => (
          <div key={column.id} style={{ 
            background: '#f8f9fa', 
            borderRadius: '8px', 
            padding: '15px',
            minHeight: '400px'
          }}>
            <h3 style={{ 
              color: column.color, 
              marginBottom: '15px',
              textAlign: 'center',
              fontSize: '1.1em'
            }}>
              {column.title}
            </h3>
            
            <div style={{ 
              display: 'grid', 
              gap: '10px',
              maxHeight: '350px',
              overflowY: 'auto'
            }}>
              {projects
                .filter(project => project.status === column.id)
                .map(project => (
                  <div
                    key={project.id}
                    style={{
                      background: 'white',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      padding: '15px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onDragStart={(e) => {
                      e.dataTransfer.setData('projectId', project.id);
                    }}
                    draggable
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const projectId = e.dataTransfer.getData('projectId');
                      if (projectId && projectId !== project.id.toString()) {
                        moveProject(parseInt(projectId), column.id);
                      }
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h4 style={{ margin: 0, fontSize: '1em' }}>{project.name}</h4>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: '8px',
                          fontSize: '0.7em',
                          color: 'white',
                          background: getPriorityColor(project.priority)
                        }}>
                          {project.priority}
                        </span>
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: '8px',
                          fontSize: '0.7em',
                          color: 'white',
                          background: '#6c757d'
                        }}>
                          {project.storyPoints} pts
                        </span>
                      </div>
                    </div>
                    <p style={{ 
                      margin: '0 0 10px 0', 
                      fontSize: '0.9em', 
                      color: '#666',
                      lineHeight: '1.4'
                    }}>
                      {project.description}
                    </p>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      {column.id === 'backlog' && currentSprint && (
                        <button
                          onClick={() => addProjectToSprint(project.id, currentSprint.id)}
                          style={{
                            padding: '4px 8px',
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8em'
                          }}
                        >
                          Agregar al Sprint
                        </button>
                      )}
                      {column.id === 'in-progress' && (
                        <button
                          onClick={() => moveProject(project.id, 'review')}
                          style={{
                            padding: '4px 8px',
                            background: '#17a2b8',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8em'
                          }}
                        >
                          Mover a Revisión
                        </button>
                      )}
                      {column.id === 'review' && (
                        <button
                          onClick={() => moveProject(project.id, 'done')}
                          style={{
                            padding: '4px 8px',
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8em'
                          }}
                        >
                          Completar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Historial de Sprints */}
      {sprints.length > 0 && (
        <div>
          <h3 style={{ color: 'var(--color-accent)', marginBottom: '15px' }}>📊 Historial de Sprints</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '15px' 
          }}>
            {sprints.map(sprint => (
              <div
                key={sprint.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '15px',
                  background: 'white'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0 }}>{sprint.name}</h4>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.8em',
                    color: 'white',
                    background: getSprintStatus(sprint) === 'completed' ? '#28a745' : 
                               getSprintStatus(sprint) === 'active' ? '#ffc107' : '#6c757d'
                  }}>
                    {getSprintStatus(sprint) === 'completed' ? 'Completado' : 
                     getSprintStatus(sprint) === 'active' ? 'Activo' : 'Planificado'}
                  </span>
                </div>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.9em', color: '#666' }}>
                  {sprint.goal}
                </p>
                <div style={{ fontSize: '0.85em', color: '#666' }}>
                  <div>Duración: {sprint.duration} días</div>
                  <div>Story Points: {sprint.completedPoints}/{sprint.totalPoints}</div>
                  <div>Velocidad: {sprint.velocity.toFixed(1)} pts/día</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal para crear Sprint */}
      {showSprintForm && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div className="minimal-card" style={{ maxWidth: 400, width: '90%' }}>
            <h3 style={{ marginBottom: '20px' }}>🚀 Crear Nuevo Sprint</h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Nombre del Sprint</label>
                <input
                  type="text"
                  value={sprintData.name}
                  onChange={(e) => setSprintData({...sprintData, name: e.target.value})}
                  placeholder="Sprint 1"
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Duración (días)</label>
                <input
                  type="number"
                  value={sprintData.duration}
                  onChange={(e) => setSprintData({...sprintData, duration: parseInt(e.target.value)})}
                  min="1"
                  max="30"
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Fecha de Inicio</label>
                <input
                  type="date"
                  value={sprintData.startDate}
                  onChange={(e) => setSprintData({...sprintData, startDate: e.target.value})}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Objetivo del Sprint</label>
                <textarea
                  value={sprintData.goal}
                  onChange={(e) => setSprintData({...sprintData, goal: e.target.value})}
                  placeholder="¿Qué queremos lograr en este sprint?"
                  rows="3"
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={createSprint}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Crear Sprint
                </button>
                <button
                  onClick={() => setShowSprintForm(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para crear Proyecto */}
      {showProjectForm && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div className="minimal-card" style={{ maxWidth: 400, width: '90%' }}>
            <h3 style={{ marginBottom: '20px' }}>📋 Agregar Nuevo Proyecto</h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Nombre del Proyecto</label>
                <input
                  type="text"
                  value={projectData.name}
                  onChange={(e) => setProjectData({...projectData, name: e.target.value})}
                  placeholder="Implementar nueva funcionalidad"
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Descripción</label>
                <textarea
                  value={projectData.description}
                  onChange={(e) => setProjectData({...projectData, description: e.target.value})}
                  placeholder="Describe el proyecto y sus objetivos"
                  rows="3"
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Prioridad</label>
                  <select
                    value={projectData.priority}
                    onChange={(e) => setProjectData({...projectData, priority: e.target.value})}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px' }}>Story Points</label>
                  <input
                    type="number"
                    value={projectData.storyPoints}
                    onChange={(e) => setProjectData({...projectData, storyPoints: parseInt(e.target.value)})}
                    min="1"
                    max="21"
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={createProject}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: 'var(--color-accent)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Agregar Proyecto
                </button>
                <button
                  onClick={() => setShowProjectForm(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScrumBoard; 