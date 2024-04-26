import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Analytic from './pages/Analytic'; 
import Dashboard from './pages/Dashboard';
import AppRoutes from './routing/AppRoutes';

const App = () => {
  return (
    <Router>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <Sidebar />
          </div>
          <div className="col-md-9">
            <AppRoutes/>
          </div>
        </div>
      </div>
    </Router>
  );
};



export default App;
