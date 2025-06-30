'use client'

import React, { useState } from 'react';
import Header from './Header';
import Home from '../features/Home';
import TaskBoard from '../features/tasks/TaskBoard';
import ProjectBoard from '../features/projects/ProjectBoard';
import HourCalculator from '../features/calculator/HourCalculator';
import AnalyticsView from '../features/analytics/AnalyticsView';
import PomodoroTimer from '../features/pomodoro/PomodoroTimer';
import Donation from '../features/Donation';

function MainView() {
  const [activeTool, setActiveTool] = useState('home');

  const renderActiveTool = () => {
    switch (activeTool) {
      case 'home':
        return <Home onToolChange={setActiveTool} />;
      case 'tasks':
        return <TaskBoard />;
      case 'projects':
        return <ProjectBoard />;
      case 'calculator':
        return <HourCalculator />;
      case 'analytics':
        return <AnalyticsView />;
      case 'pomodoro':
        return <PomodoroTimer />;
      default:
        return <Home onToolChange={setActiveTool} />;
    }
  };

  return (
    <div className="main-view">
      <Header activeTool={activeTool} onToolChange={setActiveTool} />
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {renderActiveTool()}
      </div>
      <Donation />
    </div>
  );
}

export default MainView; 