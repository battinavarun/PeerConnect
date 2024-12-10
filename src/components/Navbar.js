import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import styled from 'styled-components';

const navbarStyle = {
  backgroundColor: '#4285F4',
  padding: '15px',
  color: '#FAF9F6',
};

const navLinkStyle = {
  color: '#FAF9F6',
  textDecoration: 'none',
  fontSize: '1.2rem',
  margin: '0 12px',
  display: 'flex',
  alignItems: 'center',
};

const brandStyle = {
  color: '#FAF9F6',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '2rem',
};

function CombinedNavbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
      const adminStatus = localStorage.getItem('isAdmin') === 'true';
      
      setIsLoggedIn(loggedInStatus);
      setIsAdmin(adminStatus);
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate('/');
  };

  return (
    <Navbar expand="lg" style={navbarStyle}>
      <Container fluid>
        <Navbar.Brand as={Link} to="/" style={brandStyle}>
          PeerConnect
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            {!isLoggedIn ? (
              <>
                <Nav.Link as={Link} to="/login" style={navLinkStyle}>
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" style={navLinkStyle}>
                  Register
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/home" style={navLinkStyle}>
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/projects" style={navLinkStyle}>
                  Projects
                </Nav.Link>
                <Nav.Link as={Link} to="/peerreview" style={navLinkStyle}>
                  Peer Review
                </Nav.Link>
                <Nav.Link as={Link} to="/assignments" style={navLinkStyle}>
                  Assignments
                </Nav.Link>
                <Nav.Link as={Link} to="/courses" style={navLinkStyle}>
                  Courses
                </Nav.Link>
                {isAdmin && (
                  <>
                    <Nav.Link as={Link} to="/dashboard" style={navLinkStyle}>
                      Dashboard
                    </Nav.Link>
                    <Nav.Link as={Link} to="/newstudents" style={navLinkStyle}>
                      New Students
                    </Nav.Link>
                  </>
                )}
                <Nav.Link onClick={handleLogout} style={{...navLinkStyle, cursor: 'pointer', color: '#FF6B6B'}}>
                  Logout
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CombinedNavbar;