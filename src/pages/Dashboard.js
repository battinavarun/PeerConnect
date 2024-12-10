import React, { useState, useEffect } from 'react';  
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';  
import './Dashboard.css';  
  
const Dashboard = () => {  
  const [assignments, setAssignments] = useState([]);  
  const [submissions, setSubmissions] = useState({});  
  const [isAdmin, setIsAdmin] = useState(false);  
  const [selectedAssignment, setSelectedAssignment] = useState(null);  
  
  useEffect(() => {  
    // Check if user is admin  
    const adminStatus = localStorage.getItem('isAdmin') === 'true';  
    setIsAdmin(adminStatus);  
  
    // Retrieve data from localStorage  
    const storedAssignments = JSON.parse(localStorage.getItem('assignments')) || [];  
    const storedSubmissions = JSON.parse(localStorage.getItem('submissions')) || {};  
  
    setAssignments(storedAssignments);  
    setSubmissions(storedSubmissions);  
  }, []);  
  
  // Calculate submission statistics  
  const getSubmissionStats = () => {  
    return assignments.map(assignment => {  
      const totalSubmissions = Object.keys(submissions[assignment.id] || {}).length;  
      const submittedCount = Object.values(submissions[assignment.id] || {})  
        .filter(submission => submission.status === 'Submitted').length;  
      const overduePending = Object.values(submissions[assignment.id] || {})  
        .filter(submission =>   
          submission.status === 'Pending' &&   
          new Date(assignment.dueDate) < new Date()  
        ).length;  
  
      return {  
        name: assignment.title,  
        totalSubmissions,  
        submittedCount,  
        overduePending  
      };  
    });  
  };  
  
  // Overall submission summary  
  const calculateOverallSummary = () => {  
    const submissionStats = getSubmissionStats();  
    return {  
      totalAssignments: assignments.length,  
      totalSubmissions: submissionStats.reduce((sum, stat) => sum + stat.totalSubmissions, 0),  
      overdueAssignments: submissionStats.filter(stat => stat.overduePending > 0).length  
    };  
  };  
  
  // Get detailed student submissions for selected assignment  
  const getStudentSubmissions = (assignmentId) => {  
    const assignmentSubmissions = submissions[assignmentId] || {};  
    return Object.entries(assignmentSubmissions).map(([student, submission]) => {  
      return {  
        student,  
        fileName: submission.file,  
        status: submission.status,  
        submittedAt: new Date(submission.submittedAt).toLocaleString()  
      };  
    });  
  };  
  
  // Render detailed submission information  
  const renderStudentSubmissionDetails = () => {  
    if (!selectedAssignment) return null;  
  
    const studentSubmissions = getStudentSubmissions(selectedAssignment.id);  
  
    return (  
      <div className="student-submissions-section">  
        <h2>Student Submissions for {selectedAssignment.title}</h2>  
        <table className="student-submissions-table">  
          <thead>  
            <tr>  
              <th>Student</th>  
              <th>File Name</th>  
              <th>Status</th>  
              <th>Submitted At</th>  
            </tr>  
          </thead>  
          <tbody>  
            {studentSubmissions.map((submission, index) => (  
              <tr key={index}>  
                <td>{submission.student}</td>  
                <td>{submission.fileName}</td>  
                <td>  
                  <span   
                    className={`status-badge ${submission.status.toLowerCase()}`}  
                  > 
{submission.status}  
                  </span>  
                </td>  
                <td>{submission.submittedAt}</td>  
              </tr>  
            ))}  
          </tbody>  
        </table>  
      </div>  
    );  
  };  
  
  // Render nothing if not admin  
  if (!isAdmin) {  
    return <div className="access-denied">Access Denied</div>;  
  }  
  
  const submissionData = getSubmissionStats();  
  const summary = calculateOverallSummary();  
  
  return (  
    <div className="dashboard-container">
<h1 className="dashboard-title">Assignment Dashboard</h1>  
        
      <div className="summary-section">  
        <div className="summary-cards">  
          <div className="summary-card">  
            <h3>Total Assignments</h3>  
            <p className="summary-value">{summary.totalAssignments}</p>  
          </div>  
          <div className="summary-card">  
            <h3>Total Submissions</h3>  
            <p className="summary-value">{summary.totalSubmissions}</p>  
          </div>  
          <div className="summary-card">  
            <h3>Overdue Assignments</h3>  
            <p className="summary-value overdue">{summary.overdueAssignments}</p>  
          </div>  
        </div>  
      </div>  
  
      <div className="assignments-overview">  
        <h2>Submission Overview</h2>  
        <div className="chart-container">  
          <BarChart width={800} height={400} data={submissionData}>  
            <CartesianGrid strokeDasharray="3 3" />  
            <XAxis dataKey="name" />  
            <YAxis />  
            <Tooltip />  
            <Legend />  
            <Bar dataKey="totalSubmissions" fill="#8884d8" name="Total Submissions" />  
            <Bar dataKey="overduePending" fill="#82ca9d" name="Overdue Pending" />  
          </BarChart>  
        </div>  
      </div>  
  
      <div className="assignment-selection">  
        <h2>Select Assignment for Detailed View</h2>  
        <div className="assignment-list">  
          {assignments.map(assignment => (  
            <div   
              key={assignment.id}   
              className={`assignment-item ${selectedAssignment?.id === assignment.id ? 'selected' : ''}`}  
              onClick={() => setSelectedAssignment(assignment)}  
            >  
              <span>{assignment.title}</span>  
              <span>{new Date(assignment.dueDate).toLocaleDateString()}</span>  
            </div>  
          ))}  
        </div>  
      </div>  
  
      {/* Detailed Student Submissions Section */}  
      {selectedAssignment && renderStudentSubmissionDetails()}  
    </div>  
  );  
};  
  
export default Dashboard;