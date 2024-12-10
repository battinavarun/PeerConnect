import React, { useState } from 'react';
import './Students.css';

const Students = () => {
    const [students, setStudents] = useState([]);
    const initialFormState = {
        name: '',
        cgpa: '',
        place: '',
        email: '',
        studentId: ''
    };

    const [formData, setFormData] = useState(initialFormState);
    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    const validateForm = () => {
        let tempErrors = {};
        if (!formData.name.trim()) {
            tempErrors.name = 'Name is required';
        } else if (formData.name.length < 3) {
            tempErrors.name = 'Name must be at least 3 characters long';
        }

        if (!formData.cgpa) {
            tempErrors.cgpa = 'CGPA is required';
        } else if (formData.cgpa < 0 || formData.cgpa > 10) {
            tempErrors.cgpa = 'CGPA must be between 0 and 10';
        }

        if (!formData.place.trim()) {
            tempErrors.place = 'Place is required';
        } else if (formData.place.length < 2) {
            tempErrors.place = 'Place must be at least 2 characters long';
        }

        if (!formData.email.trim()) {
            tempErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = 'Email is invalid';
        }

        if (!formData.studentId.trim()) {
            tempErrors.studentId = 'Student ID is required';
        } else if (!/^22000\d{5}$/.test(formData.studentId)) {
            tempErrors.studentId = 'Student ID must be in format: 22000XXXXX';
        } else {
            const duplicateId = students.find(
                student => student.studentId === formData.studentId && student.id !== editingId
            );
            if (duplicateId) {
                tempErrors.studentId = 'This Student ID already exists';
            }
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const resetForm = () => {
        setFormData(initialFormState);
        setEditingId(null);
        setErrors({});
    };

    const handleAdd = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const newStudent = {
                id: Date.now(),
                ...formData,
                createdAt: new Date().toISOString()
            };

            setStudents(prev => [...prev, newStudent]);
            resetForm();
        }
    };

    const handleEdit = (student) => {
        setEditingId(student.id);
        setFormData({
            name: student.name,
            cgpa: student.cgpa,
            place: student.place,
            email: student.email,
            studentId: student.studentId
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setStudents(prev =>
                prev.map(student =>
                    student.id === editingId
                        ? {
                            ...student,
                            ...formData,
                            updatedAt: new Date().toISOString()
                        }
                        : student
                )
            );
            resetForm();
        }
    };

    const handleDelete = (id) => {
        try {
            if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
                setStudents(prev => prev.filter(student => student.id !== id));
            }
        } catch (error) {
            console.error('Error deleting student:', error);
            alert('Failed to delete student. Please try again.');
        }
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const filteredAndSortedStudents = React.useMemo(() => {
        let tempStudents = [...students];
        
        if (searchTerm) {
            tempStudents = tempStudents.filter(student =>
                Object.values(student).some(value =>
                    String(value).toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        if (sortConfig.key) {
            tempStudents.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        return tempStudents;
    }, [students, searchTerm, sortConfig]);

    return (
        <div className="students-container">
            <header className="header">
                <h1>Student Management System</h1>
                <p className="student-count">Total Students: {students.length}</p>
            </header>
            
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by name, ID, place, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <form onSubmit={editingId ? handleUpdate : handleAdd} className="form-container">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="studentId">Student ID</label>
                        <input
                            id="studentId"
                            type="text"
                            name="studentId"
                            placeholder="22000XXXXX"
                            value={formData.studentId}
                            onChange={handleInputChange}
                            className={`form-input ${errors.studentId ? 'error' : ''}`}
                            maxLength={10}
                        />
                        {errors.studentId && <span className="error-message">{errors.studentId}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Enter full name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`form-input ${errors.name ? 'error' : ''}`}
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="cgpa">CGPA</label>
                        <input
                            id="cgpa"
                            type="number"
                            name="cgpa"
                            placeholder="Enter CGPA"
                            value={formData.cgpa}
                            onChange={handleInputChange}
                            className={`form-input ${errors.cgpa ? 'error' : ''}`}
                            min="0"
                            max="10"
                            step="0.01"
                        />
                        {errors.cgpa && <span className="error-message">{errors.cgpa}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="place">Place</label>
                        <input
                            id="place"
                            type="text"
                            name="place"
                            placeholder="Enter place"
                            value={formData.place}
                            onChange={handleInputChange}
                            className={`form-input ${errors.place ? 'error' : ''}`}
                        />
                        {errors.place && <span className="error-message">{errors.place}</span>}
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter email address"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`form-input ${errors.email ? 'error' : ''}`}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                </div>

                <div className="button-group">
                    <button type="submit" className={`btn ${editingId ? 'update-btn' : 'add-btn'}`}>
                        {editingId ? 'Update Student' : 'Add Student'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={resetForm} className="btn cancel-btn">
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div className="table-container">
                {filteredAndSortedStudents.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('studentId')}>Student ID</th>
                                <th onClick={() => handleSort('name')}>Name</th>
                                <th onClick={() => handleSort('cgpa')}>CGPA</th>
                                <th onClick={() => handleSort('place')}>Place</th>
                                <th onClick={() => handleSort('email')}>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedStudents.map(student => (
                                <tr key={student.id}>
                                    <td>{student.studentId}</td>
                                    <td>{student.name}</td>
                                    <td>{student.cgpa}</td>
                                    <td>{student.place}</td>
                                    <td>{student.email}</td>
                                    <td className="action-buttons">
                                        <button 
                                            onClick={() => handleEdit(student)}
                                            className="btn edit-btn"
                                            title="Edit student"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(student.id)}
                                            className="btn delete-btn"
                                            title="Delete student"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="no-data">
                        {searchTerm ? 'No matching students found' : 'No students added yet'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Students;