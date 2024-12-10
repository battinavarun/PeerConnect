import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate(); // Add useNavigate hook

  // State management
  const [authMode, setAuthMode] = useState('user'); // 'user', 'admin', 'recover'
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    recoveryCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimer, setBlockTimer] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Constants
  const MAX_LOGIN_ATTEMPTS = 5;
  const BLOCK_DURATION = 300; // 5 minutes in seconds
  const ADMIN_CREDENTIALS = {
    username: 'varun_admin',
    password: 'admin@11'
  };

  // Effects
  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
      setFormData(prev => ({ ...prev, username: savedUsername }));
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    let timer;
    if (isBlocked && blockTimer > 0) {
      timer = setInterval(() => {
        setBlockTimer((prev) => prev - 1);
      }, 1000);
    } else if (blockTimer === 0) {
      setIsBlocked(false);
      setLoginAttempts(0);
    }
    return () => clearInterval(timer);
  }, [isBlocked, blockTimer]);
  
  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);

    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (password.match(/[a-z]+/)) strength += 20;
    if (password.match(/[A-Z]+/)) strength += 20;
    if (password.match(/[0-9]+/)) strength += 20;
    if (password.match(/[$@#&!]+/)) strength += 20;
    setPasswordStrength(strength);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };
    
    switch (name) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors.email = 'Invalid email format';
        } else {
          delete newErrors.email;
        }
        break;
      case 'password':
        if (value.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        } else {
          delete newErrors.password;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || isBlocked) return;

    setLoading(true);
    setErrors({});

    try {
      if (Object.keys(errors).length > 0) {
        throw new Error('Please fix all errors before submitting');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (authMode === 'admin') {
        if (formData.username !== ADMIN_CREDENTIALS.username || 
            formData.password !== ADMIN_CREDENTIALS.password) {
          throw new Error('Invalid admin credentials');
        }
        // Successful admin login
        handleAdminLogin();
      } else {
        // Regular user login simulation
        if (!formData.username || !formData.password) {
          throw new Error('Please fill in all fields');
        }
        handleUserLogin();
      }
    } catch (error) {
      handleFailedLogin(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUserLogin = () => {
    // Set login state for user
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('isAdmin', 'false');
    localStorage.setItem('userEmail', formData.username);

    if (rememberMe) {
      localStorage.setItem('rememberedUsername', formData.username);
    } else {
      localStorage.removeItem('rememberedUsername');
    }

    // Navigate to home page for regular users
    navigate('/home');
  };

  const handleAdminLogin = () => {
    // Set login state for admin
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('isAdmin', 'true');
    localStorage.setItem('userEmail', formData.username);

    // Navigate to dashboard for admin
    navigate('/dashboard');
  };

  const handleFailedLogin = (errorMessage) => {
    setLoginAttempts(prev => prev + 1);
    if (loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS) {
      setIsBlocked(true);
      setBlockTimer(BLOCK_DURATION);
      setErrors({ general: 'Too many failed attempts. Please try again later.' });
    } else {
      setErrors({ general: errorMessage });
    }
    
    // Error animation
    const form = document.querySelector('.login-form');
    form.classList.add('shake');
    setTimeout(() => form.classList.remove('shake'), 500);
  };

  const renderPasswordStrength = () => {
    return (
      <div className="password-strength">
        <div className="strength-bar">
          <div 
            className="strength-fill"
            style={{ 
              width: `${passwordStrength}%`,
              backgroundColor: 
                passwordStrength < 40 ? '#dc2626' :
                passwordStrength < 70 ? '#f59e0b' : '#10b981'
            }}
          />
        </div>
        <span className="strength-text">
          {passwordStrength < 40 ? 'Weak' :
           passwordStrength < 70 ? 'Medium' : 'Strong'}
        </span>
      </div>
    );
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h2>{authMode === 'recover' ? 'Account Recovery' : 
              authMode === 'admin' ? 'Admin Login' : 'User Login'}</h2>
          <div className="auth-toggle">
            <button
              className={`toggle-btn ${authMode === 'user' ? 'active' : ''}`}
              onClick={() => setAuthMode('user')}
            >
              User
            </button>
            <button
              className={`toggle-btn ${authMode === 'admin' ? 'active' : ''}`}
              onClick={() => setAuthMode('admin')}
            >
              Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {errors.general && (
            <div className="error-message">{errors.general}</div>
          )}

          {isBlocked && (
            <div className="blocked-message">
              Account temporarily blocked. Try again in {Math.floor(blockTimer / 60)}:
              {(blockTimer % 60).toString().padStart(2, '0')}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <span className="input-icon"></span>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={isBlocked}
                placeholder={authMode === 'admin' ? "Enter admin username" : "Enter username"}
                className={errors.username ? 'error' : ''}
              />
            </div>
            {errors.username && (
              <span className="error-text">{errors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon"></span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isBlocked}
                placeholder={authMode === 'admin' ? "Enter admin password" : "Enter password"}
                className={errors.password ? 'error' : ''}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
            {formData.password && renderPasswordStrength()}
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isBlocked}
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              className="forgot-password"
              onClick={() => setAuthMode('recover')}
              disabled={isBlocked}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={loading || isBlocked}
          >
            {loading ? (
              <span className="loading-spinner">
                <span className="spinner"></span>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>

          {authMode === 'user' && (
            <p className="signup-text">
              Don't have an account?{' '}
              <a href="/register" className="signup-link">
                Sign Up
              </a>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;