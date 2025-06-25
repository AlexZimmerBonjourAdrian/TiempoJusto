import React from 'react';
import Hero from '../ui/Hero';
import TaskBoard from '../features/tasks/TaskBoard';
import Donation from '../features/Donation';
import HourCalculator from '../features/calculator/HourCalculator';

function MainView() {
  return (
    <div className="main-view">
      <Hero />
      <HourCalculator />
      <TaskBoard />
      <Donation />
    </div>
  );
}

export default MainView; 