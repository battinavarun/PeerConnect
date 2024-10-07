import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Filter, BarChart2, MessageSquare, Users, Eye, ChevronDown, Calendar, Clock, X, Bot, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Projects.css';

const ProjectCard = ({ project, onViewProject }) => (
  <motion.div 
    className="project-card"
    whileHover={{ y: -5, boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)' }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <div className="project-header">
      <h3>{project.title}</h3>
      <div className={`project-status ${project.status.toLowerCase().replace(' ', '-')}`}>{project.status}</div>
    </div>
    <p>{project.description}</p>
    <div className="project-meta">
      <span><Users size={16} /> {project.members} members</span>
      <span><MessageSquare size={16} /> {project.reviews} reviews</span>
      <span><Calendar size={16} /> Due: {project.dueDate}</span>
    </div>
    <button className="view-project-btn" onClick={() => onViewProject(project)}>View Project</button>
  </motion.div>
);

const ProjectDetailsModal = ({ project, onClose }) => (
  <motion.div 
    className="modal-overlay"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div 
      className="modal-content"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
    >
      <button className="close-btn" onClick={onClose}><X size={24} /></button>
      <h2>{project.title}</h2>
      <div className={`project-status ${project.status.toLowerCase().replace(' ', '-')}`}>{project.status}</div>
      <p className="project-description">{project.description}</p>
      <div className="project-details">
        <div className="detail-item">
          <Users size={20} />
          <span>Members: {project.members}</span>
        </div>
        <div className="detail-item">
          <MessageSquare size={20} />
          <span>Reviews: {project.reviews}</span>
        </div>
        <div className="detail-item">
          <Calendar size={20} />
          <span>Due Date: {project.dueDate}</span>
        </div>
      </div>
      <div className="project-progress">
        <h3>Progress</h3>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${project.progress || 0}%` }}></div>
        </div>
        <span>{project.progress || 0}% Complete</span>
      </div>
      <div className="project-tasks">
        <h3>Recent Tasks</h3>
        <ul>
          {project.tasks && project.tasks.map((task, index) => (
            <li key={index}>{task}</li>
          ))}
        </ul>
      </div>
    </motion.div>
  </motion.div>
);

const Dropdown = ({ options, value, onChange, icon: Icon }) => (
  <div className="dropdown">
    <Icon size={20} />
    <select value={value} onChange={onChange}>
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
    <ChevronDown size={20} />
  </div>
);

const CreateProjectForm = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState(1);
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, members, dueDate });
  };

  return (
    <form onSubmit={handleSubmit} className="create-project-form">
      <input
        type="text"
        placeholder="Project Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Project Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Number of Members"
        value={members}
        onChange={(e) => setMembers(parseInt(e.target.value))}
        min="1"
        required
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />
      <div className="form-actions">
        <button type="submit">Create Project</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

const Chatbot = ({ isOpen, onClose, projects }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const generateAIResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('project status') || lowerInput.includes('progress')) {
      const inProgressProjects = projects.filter(p => p.status === 'In Progress');
      return `Currently, we have ${inProgressProjects.length} projects in progress. The average completion rate is ${calculateAverageProgress(inProgressProjects)}%. Would you like more details on any specific project?`;
    }
    
    if (lowerInput.includes('deadline') || lowerInput.includes('due date')) {
      const upcomingDeadlines = findUpcomingDeadlines(projects);
      return `The next upcoming deadline is for the project "${upcomingDeadlines[0].title}" on ${upcomingDeadlines[0].dueDate}. There are ${upcomingDeadlines.length} projects due in the next 30 days. Would you like me to list them?`;
    }
    
    if (lowerInput.includes('team') || lowerInput.includes('members')) {
      const totalMembers = projects.reduce((sum, project) => sum + project.members, 0);
      const largestTeam = findLargestTeam(projects);
      return `We currently have a total of ${totalMembers} team members across all projects. The largest team is on the "${largestTeam.title}" project with ${largestTeam.members} members. How else can I assist you with team information?`;
    }
    
    if (lowerInput.includes('create') || lowerInput.includes('new project')) {
      return `To create a new project, click the "Create New Project" button at the top of the dashboard. You'll need to provide a title, description, number of team members, and due date. Is there any specific information you need help with for creating a new project?`;
    }
    
    if (lowerInput.includes('review') || lowerInput.includes('feedback')) {
      const pendingReviewProjects = projects.filter(p => p.status === 'Pending Review');
      return `There are currently ${pendingReviewProjects.length} projects pending review. The project with the most reviews is "${findMostReviewedProject(projects).title}" with ${findMostReviewedProject(projects).reviews} reviews. Would you like me to summarize the review status for you?`;
    }
    
    return `I understand you're asking about "${userInput}". While I don't have specific information on that, I can provide details about project statuses, deadlines, team members, creating new projects, or review processes. What specific aspect of project management would you like to know more about?`;
  };

  const calculateAverageProgress = (projects) => {
    const total = projects.reduce((sum, project) => sum + project.progress, 0);
    return (total / projects.length).toFixed(2);
  };

  const findUpcomingDeadlines = (projects) => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return projects
      .filter(p => new Date(p.dueDate) <= thirtyDaysFromNow)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  };

  const findLargestTeam = (projects) => {
    return projects.reduce((largest, project) => 
      project.members > largest.members ? project : largest
    , { members: 0 });
  };

  const findMostReviewedProject = (projects) => {
    return projects.reduce((mostReviewed, project) => 
      project.reviews > mostReviewed.reviews ? project : mostReviewed
    , { reviews: 0 });
  };

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      setTimeout(() => {
        const aiResponse = generateAIResponse(input);
        setMessages(prev => [...prev, { text: aiResponse, sender: 'ai' }]);
      }, 1000);
    }
  };

  return (
    <motion.div 
      className={`chatbot-container ${isOpen ? 'open' : ''}`}
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="chatbot-header">
        <h3><Bot size={20} /> AI Project Assistant</h3>
        <button onClick={onClose}><X size={20} /></button>
      </div>
      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chatbot-input">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your projects..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}><Send size={20} /></button>
      </div>
    </motion.div>
  );
};

export default function EnhancedProjects() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  useEffect(() => {
    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
      setIsLoading(false);
    } else {
      // Simulating API call for initial data
      setTimeout(() => {
        const initialProjects = [
          { id: 1, title: "AI Ethics Research", description: "Exploring ethical implications of AI in society", members: 5, reviews: 12, status: "In Progress", dueDate: "2024-10-15", progress: 60, tasks: ["Literature review", "Stakeholder interviews", "Draft ethical guidelines"] },
          { id: 2, title: "Sustainable Energy Solutions", description: "Developing innovative renewable energy technologies", members: 4, reviews: 8, status: "Pending Review", dueDate: "2024-11-30", progress: 85, tasks: ["Prototype testing", "Cost analysis", "Environmental impact assessment"] },
          { id: 3, title: "Global Health Initiatives", description: "Addressing worldwide health challenges through technology", members: 6, reviews: 15, status: "Completed", dueDate: "2024-09-01", progress: 100, tasks: ["Data analysis", "Report writing", "Presentation preparation"] },
          { id: 4, title: "Quantum Computing Advancements", description: "Pushing the boundaries of quantum computing applications", members: 3, reviews: 5, status: "In Progress", dueDate: "2025-02-28", progress: 30, tasks: ["Algorithm design", "Quantum circuit optimization", "Error correction techniques"] },
          { id: 5, title: "Urban Planning Innovations", description: "Reimagining city designs for sustainability and livability", members: 7, reviews: 20, status: "Pending Review", dueDate: "2024-12-31", progress: 75, tasks: ["Community surveys", "3D modeling", "Environmental impact studies"] },
        ];
        setProjects(initialProjects);
        localStorage.setItem('projects', JSON.stringify(initialProjects));
        setIsLoading(false);
      }, 1500);
    }
  }, []);

  const handleCreateProject = (newProject) => {
    const projectToAdd = {
      ...newProject,
      id: Date.now(),
      reviews: 0,
      status: 'In Progress',
      progress: 0,
      tasks: []
    };
    const updatedProjects = [...projects, projectToAdd];
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    setShowCreateForm(false);
  };

  const handleViewProject = (project) => {
    setSelectedProject(project);
  };

  const handleCloseProjectDetails = () => {
    setSelectedProject(null);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilter = (event) => {
    setFilter(event.target.value);
  };

  const handleSort = (event) => {
    setSort(event.target.value);
  };

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filter === 'All' || project.status === filter)
  ).sort((a, b) => {
    if (sort === 'newest') return new Date(b.dueDate) - new Date(a.dueDate);
    if (sort === 'oldest') return new Date(a.dueDate) - new Date(b.dueDate);
    if (sort === 'most-reviews') return b.reviews - a.reviews;
    return 0;
  });

  return (
    <div className="projects-page">
      <header className="projects-header">
        <h1>Projects Dashboard</h1>
        <div className="header-actions">
          <button className="create-project-btn" onClick={() => setShowCreateForm(true)}>
            <Plus size={16} /> Create New Project
          </button>
          <button className="open-chatbot-btn" onClick={() => setIsChatbotOpen(true)}>
            <Bot size={16} /> AI Assistant
          </button>
        </div>
      </header>

      {showCreateForm && (
        <CreateProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <div className="projects-tools">
        <div className="search-bar">
          <Search size={20} />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="filter-sort">
          <Dropdown 
            options={[
              { value: 'All', label: 'All Projects' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Pending Review', label: 'Pending Review' },
              { value: 'Completed', label: 'Completed' }
            ]}
            value={filter}
            onChange={handleFilter}
            icon={Filter}
          />
          <Dropdown 
            options={[
              { value: 'newest', label: 'Newest First' },
              { value: 'oldest', label: 'Oldest First' },
              { value: 'most-reviews', label: 'Most Reviews' }
            ]}
            value={sort}
            onChange={handleSort}
            icon={Clock}
          />
        </div>
      </div>

      <div className="projects-stats">
        <motion.div className="stat-card" whileHover={{ y: -5 }}>
          <BarChart2 size={24} />
          <h3>Total Projects</h3>
          <p>{projects.length}</p>
        </motion.div>
        <motion.div className="stat-card" whileHover={{ y: -5 }}>
          <MessageSquare size={24} />
          <h3>Total Reviews</h3>
          <p>{projects.reduce((sum, project) => sum + project.reviews, 0)}</p>
        </motion.div>
        <motion.div className="stat-card" whileHover={{ y: -5 }}>
          <Users size={24} />
          <h3>Active Members</h3>
          <p>{projects.reduce((sum, project) => sum + project.members, 0)}</p>
        </motion.div>
      </div>

      {isLoading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading projects...</p>
        </div>
      ) : (
        <AnimatePresence>
          <div className="projects-grid">
            {filteredProjects.map(project => (
              <ProjectCard key={project.id} project={project} onViewProject={handleViewProject} />
            ))}
          </div>
        </AnimatePresence>
      )}

      {!isLoading && filteredProjects.length === 0 && (
        <motion.div 
          className="no-results"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }} 
          transition={{ duration: 0.3 }}
        >
          <h2>No projects found</h2>
          <p>Try adjusting your search or filter settings.</p>
        </motion.div>
      )}

      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailsModal project={selectedProject} onClose={handleCloseProjectDetails} />
        )}
      </AnimatePresence>

      <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} projects={projects} />
    </div>
  );
}