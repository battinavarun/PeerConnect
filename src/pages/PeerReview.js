import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './PeerReview.css';

const PeerReview = () => {
  const [submissions, setSubmissions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [newSubmission, setNewSubmission] = useState({ title: '', description: '', files: [] });
  const [activeTab, setActiveTab] = useState('submissions');
  const [stats, setStats] = useState([]);
  const [alert, setAlert] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [viewingFile, setViewingFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Simulated data fetching
    setUsers(['Alice', 'Bob', 'Charlie', 'David', 'Eva']);
    setSubmissions([
      { id: 1, title: 'AI Ethics Research', author: 'Alice', status: 'Pending Review', files: [
        { name: 'ethics.pdf', content: 'PDF content here' },
        { name: 'data.csv', content: 'CSV content here' }
      ], date: '2024-09-15', description: 'A comprehensive study on ethical considerations in AI development.' },
      { id: 2, title: 'Quantum Computing Algorithm', author: 'Bob', status: 'Under Review', files: [
        { name: 'quantum_algo.py', content: 'Python code here' },
        { name: 'results.txt', content: 'Text content here' }
      ], date: '2024-09-20', description: 'Novel algorithm for optimizing quantum circuits.' },
    ]);
    setReviews([
      { id: 1, submissionId: 1, reviewer: 'Charlie', status: 'Pending', comments: '' },
      { id: 2, submissionId: 2, reviewer: 'David', status: 'Completed', comments: 'Innovative approach, needs more benchmarking.' },
    ]);
    setStats([
      { name: 'Jan', submissions: 4, completedReviews: 3 },
      { name: 'Feb', submissions: 6, completedReviews: 5 },
      { name: 'Mar', submissions: 8, completedReviews: 7 },
      { name: 'Apr', submissions: 10, completedReviews: 8 },
    ]);
  }, []);

  const handleSubmission = (e) => {
    e.preventDefault();
    const submission = {
      id: submissions.length + 1,
      ...newSubmission,
      author: 'Current User',
      status: 'Pending Review',
      date: new Date().toISOString().split('T')[0]
    };
    setSubmissions([...submissions, submission]);
    setNewSubmission({ title: '', description: '', files: [] });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setAlert({ type: 'success', message: 'Submission added successfully!' });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).map(file => ({
      name: file.name,
      content: URL.createObjectURL(file)
    }));
    setNewSubmission(prev => ({ ...prev, files }));
  };

  const assignReviewer = (submissionId) => {
    const availableReviewers = users.filter(user => 
      !reviews.some(review => review.submissionId === submissionId && review.reviewer === user)
    );
    if (availableReviewers.length > 0) {
      const reviewer = availableReviewers[Math.floor(Math.random() * availableReviewers.length)];
      const newReview = {
        id: reviews.length + 1,
        submissionId,
        reviewer,
        status: 'Pending',
        comments: ''
      };
      setReviews([...reviews, newReview]);
      const updatedSubmissions = submissions.map(sub =>
        sub.id === submissionId ? { ...sub, status: 'Under Review' } : sub
      );
      setSubmissions(updatedSubmissions);
      setAlert({ type: 'success', message: `Reviewer ${reviewer} assigned successfully!` });
    } else {
      setAlert({ type: 'error', message: 'No available reviewers found.' });
    }
  };

  const handleReviewSubmit = (reviewId, comments) => {
    const updatedReviews = reviews.map(review =>
      review.id === reviewId ? { ...review, status: 'Completed', comments } : review
    );
    setReviews(updatedReviews);
    setAlert({ type: 'success', message: 'Review submitted successfully!' });
    setSelectedReview(null);
  };

  const handleFileSelect = (file) => {
    setSelectedFiles(prev => 
      prev.includes(file) 
        ? prev.filter(f => f !== file) 
        : [...prev, file]
    );
  };

  const handleFileView = (file) => {
    setViewingFile(file);
  };

  const ReviewModal = ({ review, onClose, onSubmit }) => {
    const [comments, setComments] = useState(review.comments);
    const submission = submissions.find(sub => sub.id === review.submissionId);

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
            <button onClick={onClose} className="cancel-button">Close</button>
          </div>
        </div>
      </div>
    );
  };

  const FileViewer = ({ file, onClose }) => {
    return (
      <div className="file-viewer-overlay" onClick={onClose}>
        <div className="file-viewer-content" onClick={e => e.stopPropagation()}>
          <div className="file-viewer-header">
            <span className="file-viewer-title">{file.name}</span>
            <button className="file-viewer-close" onClick={onClose}>&times;</button>
          </div>
          {file.name.endsWith('.pdf') ? (
            <iframe src={file.content} width="100%" height="500px" />
          ) : file.name.match(/\.(jpeg|jpg|gif|png)$/) ? (
            <img src={file.content} alt={file.name} style={{ maxWidth: '100%' }} />
          ) : (
            <pre>{file.content}</pre>
          )}
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
          <button onClick={() => setAlert(null)} className="close-alert">&times;</button>
        </div>
      )}
      
      <nav className="tab-navigation">
        <button className={`tab-button ${activeTab === 'submissions' ? 'active' : ''}`} onClick={() => setActiveTab('submissions')}>Submissions</button>
        <button className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews</button>
        <button className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>Statistics</button>
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
                onChange={(e) => setNewSubmission({...newSubmission, title: e.target.value})}
                required
              />
              <textarea
                placeholder="Description"
                value={newSubmission.description}
                onChange={(e) => setNewSubmission({...newSubmission, description: e.target.value})}
                required
              />
              <div className="file-input-wrapper">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  required
                />
                <span className="file-input-text">Choose files or folder</span>
              </div>
              <ul className="file-list">
                {newSubmission.files.map((file, index) => (
                  <li key={index} className="file-item">
                    <span className="file-icon">📄</span>
                    <span className="file-name">{file.name}</span>
                  </li>
                ))}
              </ul>
              <button type="submit" className="submit-button">Submit for Review</button>
            </form>

            <h2>Submissions</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Files</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map(submission => (
                  <tr key={submission.id}>
                    <td>
                      <button className="link-button" onClick={() => {
                        setAlert({
                          type: 'info',
                          message: (
                            <div>
                              <h3>{submission.title}</h3>
                              <p><strong>Author:</strong> {submission.author}</p>
                              <p><strong>Status:</strong> {submission.status}</p>
                              <p><strong>Description:</strong> {submission.description}</p>
                            </div>
                          )
                        });
                      }}>
                        {submission.title}
                      </button>
                    </td>
                    <td>{submission.author}</td>
                    <td>{submission.date}</td>
                    <td>
                      <span className={`status-badge ${submission.status.replace(' ', '-').toLowerCase()}`}>
                        {submission.status}
                      </span>
                    </td>
                    <td>
                      <ul className="file-list">
                        {submission.files.map((file, index) => (
                          <li 
                            key={index} 
                            className={`file-item ${selectedFiles.includes(file) ? 'selected' : ''}`}
                            onClick={() => handleFileSelect(file)}
                          >
                            <span className="file-icon">📄</span>
                            <span className="file-name">{file.name}</span>
                            <button className="file-action" onClick={() => handleFileView(file)}>👁️</button>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      {submission.status === 'Pending Review' && (
                        <button onClick={() => assignReviewer(submission.id)} className="action-button">
                          Assign Reviewer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {activeTab === 'reviews' && (
          <section className="reviews-section">
            <h2>Reviews</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Submission</th>
                  <th>Reviewer</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map(review => {
                  const submission = submissions.find(sub => sub.id === review.submissionId);
                  return (
                    <tr key={review.id}>
                      <td>{submission?.title}</td>
                      <td>{review.reviewer}</td>
                      <td>
                        <span className={`status-badge ${review.status.toLowerCase()}`}>{review.status}</span>
                      </td>
                      <td>
                        <button onClick={() => setSelectedReview(review)} className="action-button">
                          {review.status === 'Completed' ? 'View Review' : 'Add Review'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        )}

        {activeTab === 'stats' && (
          <section className="stats-section">
            <h2>Review Statistics</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="submissions" fill="#8884d8" />
                  <Bar dataKey="completedReviews" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
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