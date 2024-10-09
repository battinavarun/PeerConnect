import React, { useState, useEffect, useMemo } from 'react';
import { Star, Send, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

export default function Reviews() {
  const [projects, setProjects] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAddReview, setShowAddReview] = useState(false);
  const [expandedProject, setExpandedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
      (review.content && review.content.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [reviews, searchTerm]);

  // Get most recent reviews
  const recentReviews = useMemo(() => {
    return [...filteredReviews].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  }, [filteredReviews]);

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
        </div>
      </header>

      <div className="recent-reviews">
        <h2>Most Recent Reviews</h2>
        {recentReviews.length > 0 ? (
          recentReviews.map(review => (
            <ReviewCard key={review.date} review={review} projectTitle={projects.find(p => p.id === review.projectId)?.name || "Unknown Project"} />
          ))
        ) : (
          <p>No recent reviews found.</p>
        )}
      </div>

      <div className="project-list">
        {projects.map(project => (
          <div key={project.id} className="project-item">
            <div className="project-summary" onClick={() => toggleProjectExpansion(project.id)}>
              <h3>{project.name}</h3>
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
                    {filteredReviews.filter(review => review.projectId === project.id).map((review) => (
                      <ReviewCard key={review.date} review={review} projectTitle={project.name} />
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
            projectTitle={selectedProject.name}
            onSubmit={handleAddReview}
            onCancel={() => setShowAddReview(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
