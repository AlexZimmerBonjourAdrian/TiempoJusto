'use client'

import React, { useState } from 'react';
import Header from './Header';
import Home from '../features/Home';
import TaskBoard from '../features/tasks/TaskBoard';
import ProjectBoard from '../features/projects/ProjectBoard';
import AnalyticsView from '../features/analytics/AnalyticsView';
import PomodoroTimer from '../features/pomodoro/PomodoroTimer';
import Donation from '../features/Donation';
import DataManager from '../ui/DataManager';
import ProductivityNotification from '../ui/ProductivityNotification';

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
      case 'pomodoro':
        return <PomodoroTimer />;
      case 'analytics':
        return <AnalyticsView />;
      case 'data-manager':
        return <DataManager />;
      default:
        return <Home onToolChange={setActiveTool} />;
    }
  };

  return (
    <div className="main-view">
      <ProductivityNotification />
      <Header activeTool={activeTool} onToolChange={setActiveTool} />
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {renderActiveTool()}
      </div>
      <Donation />
    </div>
  );
}

export default MainView; 