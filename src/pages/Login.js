import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isAdmin) {
      const adminEmail = process.env.REACT_APP_ADMIN_EMAIL;
      const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;

      if (email === adminEmail && password === adminPassword) {
        localStorage.setItem('isAdmin', 'true');
        navigate('/admin-dashboard');
      } else {
        setError('Invalid admin credentials');
      }
    } else {
      const storedEmail = localStorage.getItem('userEmail');
      const storedPassword = localStorage.getItem('userPassword');

      if (email === storedEmail && password === storedPassword) {
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
    }
  };

  return (
    <div className="login-container">
      <form className={`login-form ${isAdmin ? 'admin-mode' : ''}`} onSubmit={handleSubmit}>
        <h2>{isAdmin ? 'Admin Login' : 'User Login'}</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group password-group">
          <label htmlFor="password">Password:</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </button>
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={() => setIsAdmin(!isAdmin)}
            />
            <span>Login as Admin</span>
          </label>
        </div>
        <button type="submit" className={`login-button ${isAdmin ? 'admin' : ''}`}>
          {isAdmin ? 'Admin Login' : 'User Login'}
        </button>
        {!isAdmin && (
          <div className="footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register">Register here</Link>
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;