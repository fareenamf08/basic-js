import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="d-flex flex-column flex-shrink-0 p-3 bg-light" style={{ width: '280px', height: '700px'}}>
        <Link to="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
          <span className="fs-4">Sidebar</span>
        </Link>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <Link to="/" className="nav-link active" aria-current="page">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/analytic" className="nav-link">
              Analytic page
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/comment" className="nav-link">
              Comment
            </Link>
          </li>
        </ul>
        <hr />
      </div>
    </div>
  );
}

export default Sidebar;
