import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Analytic from '../pages/Analytic';
import Dashboard from '../pages/Dashboard';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/analytic" element={<Analytic />} />
    </Routes>
  );
};

export default AppRoutes;

// React Router library, to manage navigation and rendering of components based on the current URL.