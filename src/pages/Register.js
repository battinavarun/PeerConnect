import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    isAdmin: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const validateForm = useCallback(() => {
    const { email, password, confirmPassword } = formData;
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasNonAlphas = /\W/.test(password);
    if (!(hasUpperCase && hasLowerCase && hasNumbers && hasNonAlphas)) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return false;
    }

    return true;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    const { email, password, isAdmin } = formData;

    try {
      // Simulating an API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real application, you would send this data to your backend
      // For this example, we're using localStorage
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userPassword', password);
      localStorage.setItem('userIsAdmin', isAdmin);

      navigate('/login', { state: { registrationSuccess: true } });
    } catch (error) {
      setError('An error occurred during registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, navigate]);

  useEffect(() => {
    // Clear any existing user data on component mount
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPassword');
    localStorage.removeItem('userIsAdmin');
  }, []);

  return (
    <div className="register-container">
      <form className={`register-form ${formData.isAdmin ? 'admin-mode' : ''}`} onSubmit={handleSubmit}>
        <h2>Register for Peer Review Platform</h2>
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <div className="password-input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
            />
            <button 
              type="button" 
              className="password-toggle" 
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <div className="password-input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>
        </div>

        <div className="form-group checkbox-group">
          <label htmlFor="isAdmin">
            <input
              type="checkbox"
              id="isAdmin"
              name="isAdmin"
              checked={formData.isAdmin}
              onChange={handleChange}
            />
            Register as Admin
          </label>
        </div>

        <button 
          type="submit" 
          className={`register-button ${formData.isAdmin ? 'admin' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registering...' : `Register as ${formData.isAdmin ? 'Admin' : 'User'}`}
        </button>

        <div className="login-link">
          Already have an account? <Link to="/login">Log in here</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;