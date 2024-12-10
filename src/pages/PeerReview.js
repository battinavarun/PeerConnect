import React, { useState, useEffect, useRef } from 'react';
import './PeerReview.css';

const PeerReview = () => {
  const [submissions, setSubmissions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [newSubmission, setNewSubmission] = useState({ title: '', description: '', files: [] });
  const [activeTab, setActiveTab] = useState('submissions');
  const [alert, setAlert] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [viewingFile, setViewingFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Simulated data fetching
    setUsers(['Alice', 'Bob', 'Charlie', 'David', 'Eva']);
    setSubmissions([
      {
        id: 1,
        title: 'AI Ethics Research',
        author: 'Alice',
        status: 'Pending Review',
        files: [
          { name: 'ethics.pdf', content: 'PDF content here' },
          { name: 'data.csv', content: 'CSV content here' },
        ],
        date: '2024-09-15',
        description: 'A comprehensive study on ethical considerations in AI development.',
      },
      {
        id: 2,
        title: 'Quantum Computing Algorithm',
        author: 'Bob',
        status: 'Under Review',
        files: [
          { name: 'quantum_algo.py', content: 'Python code here' },
          { name: 'results.txt', content: 'Text content here' },
        ],
        date: '2024-09-20',
        description: 'Novel algorithm for optimizing quantum circuits.',
      },
    ]);
    setReviews([
      { id: 1, submissionId: 1, reviewer: 'Charlie', status: 'Pending', comments: '' },
      {
        id: 2,
        submissionId: 2,
        reviewer: 'David',
        status: 'Completed',
        comments: 'Innovative approach, needs more benchmarking.',
      },
    ]);
  }, []);

  const handleSubmission = (e) => {
    e.preventDefault();
    const submission = {
      id: submissions.length + 1,
      ...newSubmission,
      author: 'Current User',
      status: 'Pending Review',
      date: new Date().toISOString().split('T')[0],
    };
    setSubmissions([...submissions, submission]);
    setNewSubmission({ title: '', description: '', files: [] });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setAlert({ type: 'success', message: 'Submission added successfully!' });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      name: file.name,
      content: URL.createObjectURL(file),
    }));
    setNewSubmission((prev) => ({ ...prev, files }));
  };

  const assignReviewer = (submissionId) => {
    const availableReviewers = users.filter(
      (user) => !reviews.some((review) => review.submissionId === submissionId && review.reviewer === user)
    );
    if (availableReviewers.length > 0) {
      const reviewer = availableReviewers[Math.floor(Math.random() * availableReviewers.length)];
      const newReview = {
        id: reviews.length + 1,
        submissionId,
        reviewer,
        status: 'Pending',
        comments: '',
      };
      setReviews([...reviews, newReview]);
      const updatedSubmissions = submissions.map((sub) =>
        sub.id === submissionId ? { ...sub, status: 'Under Review' } : sub
      );
      setSubmissions(updatedSubmissions);
      setAlert({ type: 'success', message: `Reviewer ${reviewer} assigned successfully!` });
    } else {
      setAlert({ type: 'error', message: 'No available reviewers found.' });
    }
  };

  const handleReviewSubmit = (reviewId, comments) => {
    const updatedReviews = reviews.map((review) =>
      review.id === reviewId ? { ...review, status: 'Completed', comments } : review
    );
    setReviews(updatedReviews);
    setAlert({ type: 'success', message: 'Review submitted successfully!' });
    setSelectedReview(null);
  };

  const ReviewModal = ({ review, onClose, onSubmit }) => {
    const [comments, setComments] = useState(review.comments);
    const submission = submissions.find((sub) => sub.id === review.submissionId);

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>{review.status === 'Completed' ? 'View Review' : 'Add Review'}</h2>
          <h3>Submission: {submission?.title}</h3>
          <p>Reviewer: {review.reviewer}</p>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Enter your review comments here..."
            rows="6"
            className="review-textarea"
          />
          <div className="modal-actions">
            <button onClick={() => onSubmit(review.id, comments)} className="submit-button">
              {review.status === 'Completed' ? 'Update Review' : 'Submit Review'}
            </button>
            <button onClick={onClose} className="cancel-button">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const FileViewer = ({ file, onClose }) => {
    return (
      <div className="file-viewer-overlay" onClick={onClose}>
        <div 
          className="file-viewer-content" 
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '90vw',
            height: '90vh',
            maxWidth: '1600px',
            maxHeight: '1200px',
            margin: 'auto',
            position: 'relative',
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div className="file-viewer-header" style={{ marginBottom: '16px' }}>
            <span className="file-viewer-title" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {file.name}
            </span>
            <button 
              className="file-viewer-close" 
              onClick={onClose}
              style={{
                position: 'absolute',
                right: '20px',
                top: '20px',
                fontSize: '24px',
                border: 'none',
                background: 'none',
                cursor: 'pointer'
              }}
            >
              &times;
            </button>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {file.name.endsWith('.pdf') ? (
              <iframe 
                src={file.content} 
                style={{
                  width: '100%',
                  height: 'calc(90vh - 100px)',
                  border: 'none'
                }}
              />
            ) : file.name.match(/\.(jpeg|jpg|gif|png)$/) ? (
              <img 
                src={file.content} 
                alt={file.name} 
                style={{
                  maxWidth: '100%',
                  maxHeight: 'calc(90vh - 100px)',
                  objectFit: 'contain',
                  margin: 'auto',
                  display: 'block'
                }}
              />
            ) : (
              <pre 
                style={{
                  width: '100%',
                  height: 'calc(90vh - 100px)',
                  overflow: 'auto',
                  backgroundColor: '#f5f5f5',
                  padding: '20px',
                  margin: 0,
                  fontSize: '16px',
                  lineHeight: '1.5',
                  fontFamily: 'monospace'
                }}
              >
                {file.content}
              </pre>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="peer-review-container">
      <header className="main-header">
        <h1 className="main-title">Advanced Peer Review System</h1>
      </header>

      {alert && (
        <div className={`alert ${alert.type}`}>
          {alert.message}
          <button onClick={() => setAlert(null)} className="close-alert">
            &times;
          </button>
        </div>
      )}

      <nav className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'submissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('submissions')}
        >
          Submissions
        </button>
        <button
          className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews
        </button>
      </nav>

      <main className="content-area">
        {activeTab === 'submissions' && (
          <section className="submission-section">
            <h2>Submit Work for Review</h2>
            <form onSubmit={handleSubmission} className="submission-form">
              <input
                type="text"
                placeholder="Title"
                value={newSubmission.title}
                onChange={(e) => setNewSubmission({ ...newSubmission, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                value={newSubmission.description}
                onChange={(e) => setNewSubmission({ ...newSubmission, description: e.target.value })}
                required
              />
              <div className="file-input-wrapper">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple required />
                <button type="submit" className="submit-button">Submit</button>
              </div>
            </form>

            <h3>Existing Submissions</h3>
            <ul className="submission-list">
              {submissions.map((submission) => (
                <li key={submission.id} className="submission-item">
                  <h4>{submission.title}</h4>
                  <p>Author: {submission.author}</p>
                  <p>Status: {submission.status}</p>
                  <p>{submission.description}</p>
                  <p>Date Submitted: {submission.date}</p>
                  <div className="file-list">
                    {submission.files.map((file) => (
                      <span
                        key={file.name}
                        className="file-link"
                        onClick={() => setViewingFile(file)}
                      >
                        {file.name}
                      </span>
                    ))}
                  </div>
                  <button onClick={() => assignReviewer(submission.id)} className="assign-button">
                    Assign Reviewer
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {activeTab === 'reviews' && (
          <section className="reviews-section">
            <h2>Review Submissions</h2>
            <ul className="review-list">
              {reviews.map((review) => {
                const submission = submissions.find((sub) => sub.id === review.submissionId);
                return (
                  <li key={review.id} className="review-item">
                    <h4>{submission?.title} - {submission?.author}</h4>
                    <p>Reviewer: {review.reviewer}</p>
                    <p>Status: {review.status}</p>
                    {review.status === 'Pending' && (
                      <button
                        onClick={() => setSelectedReview(review)}
                        className="review-button"
                      >
                        Add Review
                      </button>
                    )}
                    {review.status === 'Completed' && (
                      <button
                        onClick={() => setSelectedReview(review)}
                        className="view-review-button"
                      >
                        View Review
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </main>

      {selectedReview && (
        <ReviewModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
          onSubmit={handleReviewSubmit}
        />
      )}

      {viewingFile && (
        <FileViewer
          file={viewingFile}
          onClose={() => setViewingFile(null)}
        />
      )}
    </div>
  );
};

export default PeerReview;