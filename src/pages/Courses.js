import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBook, 
  FaVideo, 
  FaFilter, 
  FaSearch, 
  FaChalkboardTeacher, 
  FaClock, 
  FaStar 
} from 'react-icons/fa';
import './Courses.css';

// Mock Course Service (replace with actual API calls)
const CourseService = {
  async getAllCourses() {
    // Simulating API delay and potential error
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: '1',
        title: 'Advanced React Development',
        description: 'Master advanced React patterns and performance optimization',
        instructor: 'Jane Doe',
        difficulty: 'Advanced',
        duration: '6 weeks',
        category: 'Web Development',
        rating: 4.8,
        resources: [
          { 
            id: 'r1', 
            title: 'React Hooks Deep Dive', 
            type: 'pdf', 
            url: 'https://drive.google.com/file/d/1agUmTMhLTYUAoylUcN1DrSCitq3irGQZ/view'
          },
          { 
            id: 'r2', 
            title: 'React Performance Optimization', 
            type: 'youtube', 
            videoId: 'https://www.youtube.com/watch?v=SqcY0GlETPk&t=1994s'
          }
        ]
      },
      {
        id: '2',
        title: 'Node.js Backend Mastery',
        description: 'Complete backend development with Node.js and Express',
        instructor: 'John Smith',
        difficulty: 'Intermediate',
        duration: '8 weeks',
        category: 'Backend Development',
        rating: 4.7,
        resources: [
          { 
            id: 'r3', 
            title: 'Node.js API Design', 
            type: 'pdf', 
            url: '/resources/nodejs-api-design.pdf'
          },
          { 
            id: 'r4', 
            title: 'Express.js Fundamentals', 
            type: 'youtube', 
            videoId: 'Oe421EPjpVE'
          }
        ]
      },
      {
        id: '3',
        title: 'Python Data Science Bootcamp',
        description: 'Comprehensive data science training with Python and Machine Learning',
        instructor: 'Sarah Johnson',
        difficulty: 'Intermediate',
        duration: '10 weeks',
        category: 'Data Science',
        rating: 4.9,
        resources: [
          { 
            id: 'r5', 
            title: 'Python Data Analysis Guide', 
            type: 'pdf', 
            url: '/resources/python-data-science.pdf'
          },
          { 
            id: 'r6', 
            title: 'Machine Learning Fundamentals', 
            type: 'youtube', 
            videoId: 'tPYj3fFBfIs'
          }
        ]
      }
    ];
  },

  async getCourseById(courseId) {
    const courses = await this.getAllCourses();
    return courses.find(course => course.id === courseId);
  }
};

// Advanced Error Handling Component
const CourseErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert" className="error-fallback">
      <h2>Oops! Something went wrong</h2>
      <pre className="error-message">{error.message}</pre>
      <button onClick={resetErrorBoundary} className="reset-btn">
        Try again
      </button>
    </div>
  );
};

// Memoized Resource Component
const CourseResourceItem = React.memo(({ resource, onResourceAccess }) => {
  const handleClick = useCallback(() => {
    onResourceAccess(resource);
  }, [resource, onResourceAccess]);

  return (
    <motion.div 
      className="resource-item"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="resource-header">
        <h4>{resource.title}</h4>
        <span className={`resource-type ${resource.type}`}>
          {resource.type === 'pdf' ? <FaBook /> : <FaVideo />}
          {resource.type.toUpperCase()}
        </span>
      </div>
      <button 
        className="resource-access-btn" 
        onClick={handleClick}
        aria-label={`Access ${resource.title}`}
      >
        {resource.type === 'pdf' ? 'View Resource' : 'Watch Tutorial'}
      </button>
    </motion.div>
  );
});

// Custom Hook for Advanced Course Management
const useCourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchParams, setSearchParams] = useState({
    searchTerm: '',
    category: 'All',
    difficulty: 'All'
  });
  const [status, setStatus] = useState({
    loading: true,
    error: null
  });

  // Centralized data fetching and state management
  const loadCourses = useCallback(async () => {
    try {
      setStatus({ loading: true, error: null });
      const fetchedCourses = await CourseService.getAllCourses();
      setCourses(fetchedCourses);
      setFilteredCourses(fetchedCourses);
    } catch (err) {
      setStatus({ 
        loading: false, 
        error: err.message || 'Failed to load courses' 
      });
    } finally {
      setStatus(prev => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // Advanced filtering with memoized computation
  const applyFilters = useCallback(() => {
    let result = courses;

    // Category filtering
    if (searchParams.category !== 'All') {
      result = result.filter(course => 
        course.category === searchParams.category
      );
    }

    // Difficulty filtering
    if (searchParams.difficulty !== 'All') {
      result = result.filter(course => 
        course.difficulty === searchParams.difficulty
      );
    }

    // Search filtering
    if (searchParams.searchTerm) {
      result = result.filter(course => 
        course.title.toLowerCase().includes(searchParams.searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchParams.searchTerm.toLowerCase())
      );
    }

    setFilteredCourses(result);
  }, [courses, searchParams]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Memoized derived data
  const categories = useMemo(() => 
    ['All', ...new Set(courses.map(course => course.category))], 
    [courses]
  );

  const difficulties = useMemo(() => 
    ['All', ...new Set(courses.map(course => course.difficulty))], 
    [courses]
  );

  return {
    courses: filteredCourses,
    status,
    searchParams,
    setSearchParams,
    categories,
    difficulties,
    reloadCourses: loadCourses
  };
};

// Main Courses Component
const Courses = () => {
  const navigate = useNavigate();
  const {
    courses,
    status,
    searchParams,
    setSearchParams,
    categories,
    difficulties,
    reloadCourses
  } = useCourseManagement();

  const handleResourceAccess = useCallback((resource) => {
    const accessMap = {
      'pdf': () => window.open(resource.url, '_blank'),
      'youtube': () => window.open(`https://www.youtube.com/watch?v=${resource.videoId}`, '_blank')
    };
    
    (accessMap[resource.type] || (() => {}))();
  }, []);

  const handleViewCourseDetails = useCallback((courseId) => {
    navigate(`/course/${courseId}`);
  }, [navigate]);

  const handleSearchParamChange = useCallback((key, value) => {
    setSearchParams(prev => ({ ...prev, [key]: value }));
  }, []);

  if (status.loading) return (
    <motion.div 
      className="loading" 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      Loading courses...
    </motion.div>
  );

  if (status.error) return (
    <div className="error">
      Error: {status.error}
      <button onClick={reloadCourses}>Retry</button>
    </div>
  );

  return (
    <ErrorBoundary 
      FallbackComponent={CourseErrorFallback}
      onReset={reloadCourses}
    >
      <motion.div 
        className="courses-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="page-header">
          <h1 className="page-title">Professional Learning Pathways</h1>
          <p className="page-subtitle">Curated, expert-led courses for your career growth</p>
        </div>

        <div className="courses-filter">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Discover your next skill..." 
              className="search-input"
              value={searchParams.searchTerm}
              onChange={(e) => handleSearchParamChange('searchTerm', e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <div className="filter-select-container">
              <FaFilter className="filter-icon" />
              <select 
                className="filter-select"
                value={searchParams.category}
                onChange={(e) => handleSearchParamChange('category', e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="filter-select-container">
              <FaChalkboardTeacher className="filter-icon" />
              <select 
                className="filter-select"
                value={searchParams.difficulty}
                onChange={(e) => handleSearchParamChange('difficulty', e.target.value)}
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {courses.length === 0 ? (
            <motion.div 
              key="no-courses"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="no-courses"
            >
              No courses found. Try adjusting your search or filters.
            </motion.div>
          ) : (
            <motion.div 
              key="courses-list" 
              className="courses-list"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { 
                  opacity: 1,
                  transition: { 
                    delayChildren: 0.2,
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {courses.map(course => (
                <motion.div 
                  key={course.id} 
                  className="course-card"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="course-header">
                    <h2>{course.title}</h2>
                    <span className={`difficulty-badge ${course.difficulty.toLowerCase()}`}>
                      {course.difficulty}
                    </span>
                  </div>

                  <p className="course-description">{course.description}</p>

                  <div className="course-details">
                    <div className="course-meta">
                      <span><FaChalkboardTeacher /> {course.instructor}</span>
                      <span><FaClock /> {course.duration}</span>
                      <span><FaStar /> {course.rating}/5</span>
                    </div>

                    <div className="course-resources">
                      <h3>Learning Resources</h3>
                      <div className="resources-grid">
                        {course.resources.map(resource => (
                          <CourseResourceItem 
                            key={resource.id} 
                            resource={resource}
                            onResourceAccess={handleResourceAccess}
                          />
                        ))}
                      </div>
                    </div>

                    <button 
                      className="details-btn" 
                      onClick={() => handleViewCourseDetails(course.id)}
                    >
                      View Course Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </ErrorBoundary>
  );
};

export default Courses;