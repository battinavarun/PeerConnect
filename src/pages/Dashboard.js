import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeProjects, setActiveProjects] = useState(150);
  const [totalUsers, setTotalUsers] = useState(1000);
  const [reviewsCompleted, setReviewsCompleted] = useState(450);
  const [averageFeedbackScore, setAverageFeedbackScore] = useState(4.2);
  const [searchTerm, setSearchTerm] = useState('');

  const projectData = [
    { name: 'Computer Science', projects: 50, completionRate: 75 },
    { name: 'Engineering', projects: 40, completionRate: 80 },
    { name: 'Business', projects: 30, completionRate: 60 },
    { name: 'Arts', projects: 20, completionRate: 90 },
    { name: 'Others', projects: 10, completionRate: 70 },
  ];

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'Submitted project', timestamp: '2 hours ago', project: 'AI Ethics' },
    { id: 2, user: 'Jane Smith', action: 'Completed peer review', timestamp: '3 hours ago', project: 'Sustainable Energy' },
    { id: 3, user: 'Bob Johnson', action: 'Created new project', timestamp: '5 hours ago', project: 'Mobile App Development' },
    { id: 4, user: 'Alice Brown', action: 'Provided feedback', timestamp: '1 day ago', project: 'Marketing Strategy' },
    { id: 5, user: 'Charlie Wilson', action: 'Joined project team', timestamp: '1 day ago', project: 'Data Analysis' },
  ];

  const topPerformers = [
    { id: 1, name: 'Emma Watson', projects: 8, avgScore: 4.9 },
    { id: 2, name: 'Liam Neeson', projects: 7, avgScore: 4.8 },
    { id: 3, name: 'Olivia Wilde', projects: 6, avgScore: 4.7 },
  ];

  const filteredActivities = recentActivities.filter(activity =>
    activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewProjects = () => {
    navigate('/projects');
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <div className="user-info">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgrVFePu4-8tLo1L4ew5XFoS44RVlJsWVKnA&s" alt="Admin" className="user-avatar" />
          <span className="user-name">Admin User</span>
        </div>
      </header>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <h2 className="metric-title">Active Projects</h2>
          <p className="metric-value">{activeProjects}</p>
        </div>
        <div className="metric-card">
          <h2 className="metric-title">Total Users</h2>
          <p className="metric-value">{totalUsers}</p>
        </div>
        <div className="metric-card">
          <h2 className="metric-title">Reviews Completed</h2>
          <p className="metric-value">{reviewsCompleted}</p>
        </div>
        <div className="metric-card">
          <h2 className="metric-title">Avg. Feedback Score</h2>
          <p className="metric-value">{averageFeedbackScore.toFixed(1)}/5.0</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2 className="card-title">Projects by Department</h2>
          <div className="project-list">
            {projectData.map((dept, index) => (
              <div key={index} className="project-item">
                <span>{dept.name}</span>
                <div className="project-stats">
                  <span className="project-count">{dept.projects}</span>
                  <div className="completion-bar" style={{width: `${dept.completionRate}%`}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="dashboard-card">
          <h2 className="card-title">Recent Activities</h2>
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <table className="activity-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Action</th>
                <th>Project</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.map((activity) => (
                <tr key={activity.id}>
                  <td>{activity.user}</td>
                  <td>{activity.action}</td>
                  <td>{activity.project}</td>
                  <td>{activity.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2 className="card-title">Top Performers</h2>
          <table className="performer-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Projects</th>
                <th>Avg Score</th>
              </tr>
            </thead>
            <tbody>
              {topPerformers.map((performer) => (
                <tr key={performer.id}>
                  <td>{performer.name}</td>
                  <td>{performer.projects}</td>
                  <td>{performer.avgScore.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="dashboard-card">
          <h2 className="card-title">Quick Actions</h2>
          <div className="action-buttons">
            <button className="dashboard-button primary">Create New Project</button>
            <button className="dashboard-button secondary">Manage Users</button>
            <button className="dashboard-button tertiary">Review Reports</button>
            <button className="dashboard-button quaternary" onClick={handleViewProjects}>View All Projects</button>
          </div>
        </div>
      </div>

      <footer className="dashboard-footer">
        <p>&copy; 2024 Student Collaboration Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;