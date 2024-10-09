import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaProjectDiagram, FaClipboardList, FaSignOutAlt } from 'react-icons/fa';
import './Dashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt className="logout-icon" /> Logout
        </button>
      </header>
      
      <main className="admin-content">
        <div className="admin-summary">
          <div className="summary-card">
            <FaUser className="summary-icon" />
            <h3>Users</h3>
            <p>Manage user accounts and settings</p>
          </div>
          <div className="summary-card">
            <FaProjectDiagram className="summary-icon" />
            <h3>Projects</h3>
            <p>Review and manage ongoing projects</p>
          </div>
          <div className="summary-card">
            <FaClipboardList className="summary-icon" />
            <h3>Assignments</h3>
            <p>Assign and track progress</p>
          </div>
        </div>
        
        <section className="admin-details">
          <h2>Recent Activity</h2>
          <ul>
            <li>John Doe added a new project: <strong>AI Research</strong></li>
            <li>Jane Smith updated the assignment: <strong>Web Development</strong></li>
            <li>Admin approved a new user: <strong>Michael Scott</strong></li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;