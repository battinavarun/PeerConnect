import React, { useState, useEffect, useMemo } from 'react';
import { Star, Send, ChevronDown, ChevronUp, Search, Filter, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Reviews.css';

const ReviewCard = ({ review, projectTitle }) => (
  <motion.div 
    className="review-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <div className="review-header">
      <h4>{projectTitle}</h4>
      <div className="rating">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} fill={i < review.rating ? "#ffc107" : "none"} stroke={i < review.rating ? "#ffc107" : "#ccc"} />
        ))}
      </div>
    </div>
    <div className="review-meta">
      <span className="reviewer">{review.reviewer}</span>
      <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
    </div>
    <p>{review.content}</p>
  </motion.div>
);

const AddReviewForm = ({ projectId, projectTitle, onSubmit, onCancel }) => {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ projectId, content, rating, reviewer: 'Anonymous', date: new Date().toISOString() });
    setContent('');
    setRating(0);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="add-review-form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h4>Add Review for {projectTitle}</h4>
      <textarea
        placeholder="Write your review..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <div className="rating-input">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={24}
            onClick={() => setRating(i + 1)}
            fill={i < rating ? "#ffc107" : "none"}
            stroke={i < rating ? "#ffc107" : "#ccc"}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </div>
      <div className="form-actions">
        <button type="submit">Submit Review</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </motion.form>
  );
};

const ReviewStats = ({ reviews }) => {
  const averageRating = useMemo(() => {
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const ratingCounts = useMemo(() => {
    return reviews.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    }, {});
  }, [reviews]);

  const chartData = useMemo(() => {
    return Object.entries(ratingCounts).map(([rating, count]) => ({
      rating: Number(rating),
      count,
    })).sort((a, b) => a.rating - b.rating);
  }, [ratingCounts]);

  return (
    <div className="review-stats">
      <div className="stat-card">
        <h3>Average Rating</h3>
        <div className="average-rating">
          <span>{averageRating}</span>
          <div className="rating">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} fill={i < Math.round(averageRating) ? "#ffc107" : "none"} stroke={i < Math.round(averageRating) ? "#ffc107" : "#ccc"} />
            ))}
          </div>
        </div>
      </div>
      <div className="stat-card">
        <h3>Rating Distribution</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="rating" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default function Reviews() {
  const [projects, setProjects] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAddReview, setShowAddReview] = useState(false);
  const [expandedProject, setExpandedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState(0);

  useEffect(() => {
    // Load projects and reviews from localStorage
    const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    const storedReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    setProjects(storedProjects);
    setReviews(storedReviews);
  }, []);

  const handleAddReview = (newReview) => {
    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));

    // Update the project's review count
    const updatedProjects = projects.map(project => 
      project.id === newReview.projectId 
        ? { ...project, reviews: (project.reviews || 0) + 1 }
        : project
    );
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));

    setShowAddReview(false);
  };

  const toggleProjectExpansion = (projectId) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  const filteredReviews = useMemo(() => {
    return reviews.filter(review => 
      (review.content && review.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterRating === 0 || review.rating === filterRating)
    );
  }, [reviews, searchTerm, filterRating]);

  return (
    <div className="reviews-page">
      <header className="reviews-header">
        <h1>Project Reviews</h1>
        <div className="review-tools">
          <div className="search-bar">
            <Search size={20} />
            <input 
              type="text" 
              placeholder="Search reviews..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-dropdown">
            <Filter size={20} />
            <select value={filterRating} onChange={(e) => setFilterRating(Number(e.target.value))}>
              <option value={0}>All Ratings</option>
              {[1, 2, 3, 4, 5].map(rating => (
                <option key={rating} value={rating}>{rating} Star{rating !== 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <ReviewStats reviews={filteredReviews} />

      <div className="project-list">
        {projects.map(project => (
          <div key={project.id} className="project-item">
            <div className="project-summary" onClick={() => toggleProjectExpansion(project.id)}>
              <h3>{project.title}</h3>
              <span>{project.reviews || 0} reviews</span>
              {expandedProject === project.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            <AnimatePresence>
              {expandedProject === project.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="project-reviews">
                    {filteredReviews.filter(review => review.projectId === project.id).map((review, index) => (
                      <ReviewCard key={index} review={review} projectTitle={project.title} />
                    ))}
                    {filteredReviews.filter(review => review.projectId === project.id).length === 0 && (
                      <p>No reviews found for this project.</p>
                    )}
                    <button 
                      className="add-review-btn"
                      onClick={() => {
                        setSelectedProject(project);
                        setShowAddReview(true);
                      }}
                    >
                      <Send size={16} /> Add Review
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showAddReview && selectedProject && (
          <AddReviewForm
            projectId={selectedProject.id}
            projectTitle={selectedProject.title}
            onSubmit={handleAddReview}
            onCancel={() => setShowAddReview(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}