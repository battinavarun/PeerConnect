import React, { useState, useEffect } from 'react';
import './Assignments.css';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', dueDate: '' });
  const [submissions, setSubmissions] = useState({});
  const [reviews, setReviews] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [activeTab, setActiveTab] = useState('pending');
  const [newReviews, setNewReviews] = useState({});
  const [editingAssignment, setEditingAssignment] = useState(null);

  useEffect(() => {
    setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    setCurrentUser(localStorage.getItem('userEmail'));
    
    const storedAssignments = JSON.parse(localStorage.getItem('assignments')) || [
      { id: 1, title: 'React Basics', description: 'Create a simple React component', dueDate: '2023-12-31' },
      { id: 2, title: 'State Management', description: 'Implement state management using hooks', dueDate: '2024-01-15' },
    ];
    setAssignments(storedAssignments);

    const storedSubmissions = JSON.parse(localStorage.getItem('submissions')) || {};
    setSubmissions(storedSubmissions);

    const storedReviews = JSON.parse(localStorage.getItem('reviews')) || {};
    setReviews(storedReviews);

    const initialNewReviews = {};
    storedAssignments.forEach(assignment => {
      initialNewReviews[assignment.id] = {};
      Object.keys(storedSubmissions[assignment.id] || {}).forEach(user => {
        if (user !== currentUser) {
          initialNewReviews[assignment.id][user] = { rating: 0, comment: '' };
        }
      });
    });
    setNewReviews(initialNewReviews);
  }, [currentUser]);

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    if (isAdmin) {
      const newAssignmentWithId = { ...newAssignment, id: Date.now() };
      const updatedAssignments = [...assignments, newAssignmentWithId];
      setAssignments(updatedAssignments);
      localStorage.setItem('assignments', JSON.stringify(updatedAssignments));
      setNewAssignment({ title: '', description: '', dueDate: '' });
    }
  };

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setNewAssignment(assignment);
  };

  const handleUpdateAssignment = (e) => {
    e.preventDefault();
    const updatedAssignments = assignments.map(a => 
      a.id === editingAssignment.id ? { ...newAssignment, id: a.id } : a
    );
    setAssignments(updatedAssignments);
    localStorage.setItem('assignments', JSON.stringify(updatedAssignments));
    setEditingAssignment(null);
    setNewAssignment({ title: '', description: '', dueDate: '' });
  };

  const handleDeleteAssignment = (id) => {
    const updatedAssignments = assignments.filter(a => a.id !== id);
    setAssignments(updatedAssignments);
    localStorage.setItem('assignments', JSON.stringify(updatedAssignments));
  };

  const handleFileSelection = (assignmentId, file) => {
    setSelectedFiles(prev => ({
      ...prev,
      [assignmentId]: file
    }));
  };

  const handleFileSubmission = (assignmentId) => {
    const file = selectedFiles[assignmentId];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result;
        const updatedSubmissions = {
          ...submissions,
          [assignmentId]: { 
            ...submissions[assignmentId],
            [currentUser]: { 
              file: file.name, 
              status: 'Submitted', 
              submittedAt: new Date().toISOString(),
              content: fileContent
            }
          }
        };
        setSubmissions(updatedSubmissions);
        localStorage.setItem('submissions', JSON.stringify(updatedSubmissions));
        setSelectedFiles(prev => ({
          ...prev,
          [assignmentId]: null
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReviewSubmission = (assignmentId, reviewedUser) => {
    const review = newReviews[assignmentId][reviewedUser];
    if (review.rating && review.comment) {
      const updatedReviews = {
        ...reviews,
        [assignmentId]: {
          ...reviews[assignmentId],
          [reviewedUser]: {
            ...reviews[assignmentId]?.[reviewedUser],
            [currentUser]: {
              rating: review.rating,
              comment: review.comment,
              reviewedAt: new Date().toISOString()
            }
          }
        }
      };
      setReviews(updatedReviews);
      localStorage.setItem('reviews', JSON.stringify(updatedReviews));
      
      setNewReviews(prev => ({
        ...prev,
        [assignmentId]: {
          ...prev[assignmentId],
          [reviewedUser]: { rating: 0, comment: '' }
        }
      }));
    }
  };

  const handleReviewChange = (assignmentId, reviewedUser, field, value) => {
    setNewReviews(prev => ({
      ...prev,
      [assignmentId]: {
        ...prev[assignmentId],
        [reviewedUser]: {
          ...prev[assignmentId][reviewedUser],
          [field]: value
        }
      }
    }));
  };

  const getAssignmentStatus = (assignmentId) => {
    const submission = submissions[assignmentId]?.[currentUser];
    return submission ? submission.status : 'Pending';
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (activeTab === 'pending') {
      return getAssignmentStatus(assignment.id) === 'Pending';
    } else if (activeTab === 'submitted') {
      return getAssignmentStatus(assignment.id) === 'Submitted';
    } else {
      return true;
    }
  });

  return (
    <div className="assignments-container">
      <header className="assignments-header">
        <h1 className="assignments-title">Assignments Dashboard</h1>
        {!isAdmin && (
          <div className="tab-navigation">
            <button 
              className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending
            </button>
            <button 
              className={`tab-button ${activeTab === 'submitted' ? 'active' : ''}`}
              onClick={() => setActiveTab('submitted')}
            >
              Submitted
            </button>
            <button 
              className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
          </div>
        )}
      </header>
      
      {isAdmin && (
        <div className="admin-panel">
          <h2>{editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}</h2>
          <form onSubmit={editingAssignment ? handleUpdateAssignment : handleCreateAssignment}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                placeholder="Assignment Title"
                value={newAssignment.title}
                onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                placeholder="Assignment Description"
                value={newAssignment.description}
                onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                id="dueDate"
                type="date"
                value={newAssignment.dueDate}
                onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="submit-button">
              {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
            </button>
            {editingAssignment && (
              <button type="button" className="cancel-button" onClick={() => setEditingAssignment(null)}>
                Cancel Edit
              </button>
            )}
          </form>
        </div>
      )}

      <div className="assignments-list">
        {filteredAssignments.map((assignment) => (
          <div key={assignment.id} className="assignment-card">
            <div className="assignment-header">
              <h2>{assignment.title}</h2>
              <span className={`due-date ${new Date(assignment.dueDate) < new Date() ? 'overdue' : ''}`}>
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </span>
            </div>
            <p className="assignment-description">{assignment.description}</p>
            
            {isAdmin && (
              <div className="admin-controls">
                <button onClick={() => handleEditAssignment(assignment)} className="edit-button">Edit</button>
                <button onClick={() => handleDeleteAssignment(assignment.id)} className="delete-button">Delete</button>
              </div>
            )}

            {!isAdmin && (
              <div className="submission-section">
                <div className="status-bar">
                  <span className={`status ${getAssignmentStatus(assignment.id).toLowerCase()}`}>
                    {getAssignmentStatus(assignment.id)}
                  </span>
                </div>
                <div className="file-upload-area">
                  <input
                    type="file"
                    id={`file-${assignment.id}`}
                    onChange={(e) => handleFileSelection(assignment.id, e.target.files[0])}
                    className="file-input"
                    accept=".pdf,.doc,.docx,.txt"
                  />
                  <label htmlFor={`file-${assignment.id}`} className="file-label">
                    {selectedFiles[assignment.id] ? selectedFiles[assignment.id].name : 'Choose file'}
                  </label>
                  <button 
                    onClick={() => handleFileSubmission(assignment.id)}
                    disabled={!selectedFiles[assignment.id]}
                    className="submit-button"
                  >
                    Submit
                  </button>
                </div>
                {submissions[assignment.id]?.[currentUser] && (
                  <div className="submitted-file">
                    <p>Submitted: {submissions[assignment.id][currentUser].file}</p>
                    <a 
                      href={submissions[assignment.id][currentUser].content}
                      download={submissions[assignment.id][currentUser].file}
                      className="view-file-link"
                    >
                      Download Submitted File
                    </a>
                  </div>
                )}
              </div>
            )}

            {!isAdmin && submissions[assignment.id] && (
              <div className="peer-review-section">
                <h3>Peer Reviews</h3>
                {Object.entries(submissions[assignment.id]).map(([user, submission]) => {
                  if (user !== currentUser) {
                    return (
                      <div key={user} className="peer-submission">
                        <p>{user}'s submission</p>
                        <a 
                          href={submission.content}
                          download={submission.file}
                          className="view-file-link"
                        >
                          Download Submission
                        </a>
                        {reviews[assignment.id]?.[user]?.[currentUser] ? (
                          <div className="review-submitted">
                            <p>Your review: {reviews[assignment.id][user][currentUser].rating}/5</p>
                            <p>{reviews[assignment.id][user][currentUser].comment}</p>
                          </div>
                        ) : (
                          <div className="review-form">
                            <input
                              type="number"
                              min="1"
                              max="5"
                              value={newReviews[assignment.id][user].rating}
                              onChange={(e) => handleReviewChange(assignment.id, user, 'rating', parseInt(e.target.value))}
                              placeholder="Rating (1-5)"
                            />
                            <textarea
                              value={newReviews[assignment.id][user].comment}
                              onChange={(e) => handleReviewChange(assignment.id, user, 'comment', e.target.value)}
                              placeholder="Your review comment"
                            />
                            <button onClick={() => handleReviewSubmission(assignment.id, user)}>
                              Submit Review
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}

            {isAdmin && (
              <div className="submissions-overview">
                <h3>Submissions and Reviews</h3>
                {Object.entries(submissions[assignment.id] || {}).map(([user, submission]) => (
                  <div key={user} className="submission-entry">
                    <p>{user}: {submission.file} - {submission.status}</p>
                    <p>Submitted at: {new Date(submission.submittedAt).toLocaleString()}</p>
                    <a 
                      href={submission.content}
                      download={submission.file}
                      className="view-file-link"
                    >
                      Download Submitted File
                    </a>
                    <div className="reviews">
                      <h4>Reviews for this submission:</h4>
                      {Object.entries(reviews[assignment.id]?.[user] || {}).map(([reviewer, review]) => (
                        <div key={reviewer} className="review">
                          <p>{reviewer}: {review.rating}/5</p>
                          <p>{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assignments;