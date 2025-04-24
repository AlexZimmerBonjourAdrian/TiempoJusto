import React from 'react';
import Hero from './Hero';
import TaskBoard from './TaskBoard';
import Donation from './Donation';
import Footer from './Footer';
import HourCalculator from './HourCalculator';

function MainView() {
  return (
    <div className="main-view">
  
      <Hero />
      <HourCalculator />
      <TaskBoard />
      <Donation />
      <Footer />
    </div>
  );
}

export default MainView;