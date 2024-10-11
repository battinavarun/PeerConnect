import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Star, BarChart2, MessageSquare, User, Calendar, Award, TrendingUp, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import './Reviews.css';

const Reviews = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [statistics, setStatistics] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    recentTrend: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const itemsPerPage = 5;

  useEffect(() => {
    // Fetch projects from localStorage
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      const parsedProjects = JSON.parse(savedProjects).map(project => ({
        ...project,
        reviews: project.reviews || []
      }));
      setProjects(parsedProjects);
    }
  }, []);

  useEffect(() => {
    if (selectedProject) {
      calculateStatistics(selectedProject.reviews);
    }
  }, [selectedProject]);

  const calculateStatistics = useCallback((reviews) => {
    const totalReviews = reviews.length;
    const sumRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalReviews > 0 ? sumRatings / totalReviews : 0;
    
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });

    // Calculate recent trend (last 10 reviews)
    const recentReviews = reviews.slice(-10).reverse();
    const recentTrend = recentReviews.map((review, index) => ({
      id: index + 1,
      rating: review.rating
    }));

    setStatistics({
      averageRating: averageRating.toFixed(1),
      totalReviews,
      ratingDistribution: distribution,
      recentTrend
    });
  }, []);

  const handleProjectSelect = useCallback((project) => {
    setSelectedProject(project);
    setCurrentPage(1);
    setSearchTerm('');
  }, []);

  const handleRatingChange = useCallback((rating) => {
    setNewReview(prev => ({ ...prev, rating }));
  }, []);

  const handleCommentChange = useCallback((e) => {
    setNewReview(prev => ({ ...prev, comment: e.target.value }));
  }, []);

  const handleSubmitReview = useCallback(() => {
    if (newReview.rating === 0 || !newReview.comment.trim()) {
      alert('Please provide both a rating and a comment.');
      return;
    }

    const updatedProject = {
      ...selectedProject,
      reviews: [
        ...selectedProject.reviews,
        { ...newReview, date: new Date().toISOString(), user: 'Anonymous User' }
      ]
    };

    const updatedProjects = projects.map(p =>
      p.id === updatedProject.id ? updatedProject : p
    );

    setProjects(updatedProjects);
    setSelectedProject(updatedProject);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    setNewReview({ rating: 0, comment: '' });
    calculateStatistics(updatedProject.reviews);
  }, [newReview, selectedProject, projects, calculateStatistics]);

  const filteredReviews = useMemo(() => {
    if (!selectedProject) return [];
    return selectedProject.reviews.filter(review =>
      review.comment.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [selectedProject, searchTerm]);

  const sortedReviews = useMemo(() => {
    return [...filteredReviews].sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'rating') {
        return sortOrder === 'asc' 
          ? a.rating - b.rating
          : b.rating - a.rating;
      }
      return 0;
    });
  }, [filteredReviews, sortBy, sortOrder]);

  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedReviews.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedReviews, currentPage]);

  const totalPages = Math.ceil(sortedReviews.length / itemsPerPage);

  const RatingStars = ({ rating, onRatingChange = null }) => {
    return (
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            onClick={() => onRatingChange && onRatingChange(star)}
            fill={star <= rating ? '#FFD700' : 'none'}
            stroke={star <= rating ? '#FFD700' : '#CBD5E0'}
            style={{ cursor: onRatingChange ? 'pointer' : 'default' }}
          />
        ))}
      </div>
    );
  };

  const BarChart = ({ data }) => {
    const maxValue = Math.max(...Object.values(data));
    return (
      <div className="bar-chart">
        {Object.entries(data).map(([rating, count]) => (
          <div key={rating} className="bar-chart-item">
            <div className="bar-label">{rating}</div>
            <div className="bar-container">
              <div
                className="bar"
                style={{ width: `${(count / maxValue) * 100}%` }}
              ></div>
            </div>
            <div className="bar-value">{count}</div>
          </div>
        ))}
      </div>
    );
  };

  const LineChart = ({ data }) => {
    const maxRating = 5;
    const chartHeight = 100;
    const pointRadius = 4;

    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - (item.rating / maxRating) * 100;
      return `${x},${y}`;
    });

    return (
      <svg className="line-chart" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke="#4299E1"
          strokeWidth="2"
          points={points.join(' ')}
        />
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - (item.rating / maxRating) * 100;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r={pointRadius}
              fill="#4299E1"
            />
          );
        })}
      </svg>
    );
  };

  return (
    <div className="reviews-page">
      <h1 className="page-title">Project Reviews Dashboard</h1>
      
      <div className="dashboard-layout">
        <aside className="project-list">
          <h2>Select a Project</h2>
          {projects.map(project => (
            <button
              key={project.id}
              className={`project-item ${selectedProject?.id === project.id ? 'selected' : ''}`}
              onClick={() => handleProjectSelect(project)}
            >
              {project.name}
            </button>
          ))}
        </aside>

        {selectedProject && (
          <main className="project-reviews">
            <h2>{selectedProject.name} - Reviews</h2>
            
            <div className="statistics-grid">
              <div className="stat-card">
                <div className="stat-icon"><Star size={24} /></div>
                <div className="stat-content">
                  <h3>Average Rating</h3>
                  <p className="stat-value">{statistics.averageRating}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><MessageSquare size={24} /></div>
                <div className="stat-content">
                  <h3>Total Reviews</h3>
                  <p className="stat-value">{statistics.totalReviews}</p>
                </div>
              </div>
              <div className="stat-card wide">
                <h3>Rating Distribution</h3>
                <BarChart data={statistics.ratingDistribution} />
              </div>
              <div className="stat-card wide">
                <h3>Recent Trend</h3>
                <LineChart data={statistics.recentTrend} />
              </div>
            </div>

            <div className="review-controls">
              <div className="search-box">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="sort-controls">
                <label>Sort by:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="date">Date</option>
                  <option value="rating">Rating</option>
                </select>
                <button onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}>
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>

            <div className="review-list">
              <h3>Reviews</h3>
              {paginatedReviews.map((review, index) => (
                <div key={index} className="review-item">
                  <div className="review-header">
                    <RatingStars rating={review.rating} />
                    <span className="review-user"><User size={16} /> {review.user}</span>
                    <span className="review-date"><Calendar size={16} /> {new Date(review.date).toLocaleDateString()}</span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>

            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={20} />
              </button>
              <span>{currentPage} / {totalPages}</span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="new-review">
              <h3>Add Your Review</h3>
              <RatingStars rating={newReview.rating} onRatingChange={handleRatingChange} />
              <textarea
                value={newReview.comment}
                onChange={handleCommentChange}
                placeholder="Write your review here..."
              />
              <button onClick={handleSubmitReview} className="submit-button">Submit Review</button>
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default Reviews;