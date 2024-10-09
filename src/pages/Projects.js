import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, Plus, Calendar, Users, Clock, CheckCircle, Send, BarChart2, Trash2, Edit, Eye, AlertCircle, X } from 'lucide-react';
import './Projects.css';

const ProjectDashboard = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem('projects');
    return savedProjects ? JSON.parse(savedProjects) : [
      { id: 1, name: 'Website Redesign', email: 'manager1@company.com', status: 'in-progress', description: 'Overhaul of company website with modern design', dueDate: '2024-11-15', team: 4, progress: 65 },
      { id: 2, name: 'Mobile App Development', email: 'manager2@company.com', status: 'in-progress', description: 'Creating a new mobile app for client engagement', dueDate: '2024-12-31', team: 6, progress: 40 },
      { id: 3, name: 'Data Migration', email: 'manager3@company.com', status: 'completed', description: 'Migrating legacy data to new cloud-based system', dueDate: '2024-09-30', team: 3, progress: 100 },
      { id: 4, name: 'AI Integration', email: 'manager4@company.com', status: 'pending', description: 'Implementing AI-driven analytics in existing products', dueDate: '2025-03-01', team: 5, progress: 10 },
    ];
  });
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('latest');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const filteredProjects = projects
    .filter(project => {
      if (filter === 'all') return true;
      return project.status === filter;
    })
    .filter(project => 
      (project.name && project.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sort === 'latest') return new Date(b.dueDate) - new Date(a.dueDate);
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === 'in-progress').length,
    completed: projects.filter(p => p.status === 'completed').length,
    pending: projects.filter(p => p.status === 'pending').length,
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    const form = e.target;
    const newProject = {
      id: Date.now(),
      name: form.name.value,
      email: form.email.value, // Collect email input
      description: form.description.value,
      dueDate: form.dueDate.value,
      team: parseInt(form.team.value),
      status: form.status.value,
      progress: 0
    };
    setProjects([...projects, newProject]);
    setShowCreateForm(false);
    form.reset();
  };

  const handleDeleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
    if (selectedProject && selectedProject.id === id) {
      setSelectedProject(null);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCollabClick = (project) => {
    setSelectedProject(project);
  };

  return (
    <div className="projects-page">
      <header className="projects-header">
        <h1>Project Dashboard</h1>
        <button className="create-project-btn" onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus size={20} />
          Create Project
        </button>
      </header>

      {showCreateForm && (
        <form className="create-project-form" onSubmit={handleCreateProject}>
          <input type="text" name="name" placeholder="Project Name" required />
          <input type="email" name="email" placeholder="Project Manager Email" required />
          <textarea name="description" placeholder="Project Description" required />
          <input type="date" name="dueDate" placeholder="Due Date" required />
          <input type="number" name="team" placeholder="Team Size" min="1" required />
          <select name="status" required>
            <option value="">Select Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <div className="form-actions">
            <button type="button" onClick={() => setShowCreateForm(false)}>Cancel</button>
            <button type="submit">Create Project</button>
          </div>
        </form>
      )}

      <div className="projects-tools">
        <div className="search-bar">
          <Search size={20} />
          <input 
            type="text" 
            placeholder="Search projects" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-sort">
          <div className="dropdown">
            <Filter size={20} />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Projects</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
            <ChevronDown size={20} />
          </div>
          <div className="dropdown">
            <Clock size={20} />
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="latest">Latest Due Date</option>
              <option value="oldest">Oldest Due Date</option>
            </select>
            <ChevronDown size={20} />
          </div>
        </div>
      </div>

      <div className="projects-container">
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-header">
                <h3>{project.name}</h3>
                <span className={`project-status ${getStatusColor(project.status)}`}>
                  {project.status ? project.status.replace('-', ' ') : 'N/A'}
                </span>
              </div>
              <p>{project.description}</p>
              <div className="project-meta">
                <span><Calendar size={16} /> Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                <span><Users size={16} /> Team: {project.team}</span>
              </div>
              <div className="project-meta">
                <span><strong>Email:</strong> {project.email}</span>
              </div>
              <div className="project-progress">
                <div className="progress-bar">
                  <div className="progress" style={{width: `${project.progress}%`}}></div>
                </div>
                <span>{project.progress}% Complete</span>
              </div>
              <div className="project-actions">
                <button className="action-btn view"><Eye size={16} /> View</button>
                <button className="action-btn edit" onClick={() => handleCollabClick(project)}>
                  <Edit size={16} /> Collab
                </button>
                <button className="action-btn delete" onClick={() => handleDeleteProject(project.id)}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedProject && (
          <div className="collaboration-section">
            <div className="collaboration-header">
              <h2>Collaborating on: {selectedProject.name}</h2>
              <button onClick={() => setSelectedProject(null)}><X size={24} /></button>
            </div>
            <div className="collaboration-content">
              <h3>Project Details</h3>
              <p><strong>Description:</strong> {selectedProject.description}</p>
              <p><strong>Due Date:</strong> {new Date(selectedProject.dueDate).toLocaleDateString()}</p>
              <p><strong>Team Size:</strong> {selectedProject.team}</p>
              <p><strong>Email:</strong> {selectedProject.email}</p>
              <p><strong>Status:</strong> {selectedProject.status}</p>
              <p><strong>Progress:</strong> {selectedProject.progress}%</p>
              
              <h3>Collaboration Tools</h3>
              <div className="collaboration-tools">
                <button>Drop a mail</button>
                <button>Open Shared Document</button>
                <button>Chat with Team</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {filteredProjects.length === 0 && (
        <div className="no-results">
          <AlertCircle size={48} />
          <h3>No projects found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}

      {showChatbot && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <h3>
              <div className="ai-icon"><Send size={20} /></div>
              Project Assistant
            </h3>
            <button onClick={() => setShowChatbot(false)}>&times;</button>
          </div>
          <div className="chatbot-messages">
            <div className="message ai">How can I assist you with your projects today?</div>
          </div>
          <div className="chatbot-input">
            <input type="text" placeholder="Type your message..." />
            <button><Send size={20} /></button>
          </div>
        </div>
      )}

      {!showChatbot && (
        <button 
          className="chatbot-toggle"
          onClick={() => setShowChatbot(true)}
        >
          <Send size={24} />
        </button>
      )}
    </div>
  );
};

export default ProjectDashboard;
