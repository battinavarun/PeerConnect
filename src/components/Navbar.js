import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Button } from 'react-bootstrap';
import styled, { keyframes } from 'styled-components';

// Inline styles for the Navbar components
const navbarStyle = {
  backgroundColor: '#4285F4',
  padding: '10px',
};

const navLinkStyle = {
  color: '#FAF9F6',
  textDecoration: 'none',
  fontSize: '1.2rem',
};

const brandStyle = {
  color: '#FAF9F6',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '1.8rem',
};

// Keyframes for the blinking effect
const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
`;

// Styled component for the blinking logout button
const BlinkingLogout = styled(Nav.Link)`
  animation: ${blink} 2s linear infinite;
`;

function MyNavbar() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loggedInStatus);
    };

    // Check login status immediately
    checkLoginStatus();

    // Set up an interval to check login status periodically
    const intervalId = setInterval(checkLoginStatus, 1000); // Check every second

    // Set up event listener for storage changes
    window.addEventListener('storage', checkLoginStatus);

    if (isLoggedIn) {
      const blinkInterval = setInterval(() => {
        setIsBlinking((prev) => !prev);
      }, 5000); // Toggle blinking every 5 seconds

      return () => {
        clearInterval(blinkInterval);
        clearInterval(intervalId);
        window.removeEventListener('storage', checkLoginStatus);
      };
    }

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, [isLoggedIn]);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPassword');
    setIsLoggedIn(false);
    setShowLogoutModal(false);
    navigate('/login');
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const LogoutButton = isBlinking ? BlinkingLogout : Nav.Link;

  return (
    <>
      <Navbar expand="lg" style={navbarStyle}>
        <Container fluid>
          <Navbar.Brand as={Link} to="/" style={brandStyle} className="ms-0">
            PeerConnect
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link
                as={Link}
                to="/"
                style={navLinkStyle}
                onMouseOver={(e) => (e.target.style.color = '#FFC107')}
                onMouseOut={(e) => (e.target.style.color = '#FAF9F6')}
              >
                Home
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/projects"
                style={navLinkStyle}
                onMouseOver={(e) => (e.target.style.color = '#FFC107')}
                onMouseOut={(e) => (e.target.style.color = '#FAF9F6')}
              >
                Projects
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/reviews"
                style={navLinkStyle}
                onMouseOver={(e) => (e.target.style.color = '#FFC107')}
                onMouseOut={(e) => (e.target.style.color = '#FAF9F6')}
              >
                Reviews
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/peerreview"
                style={navLinkStyle}
                onMouseOver={(e) => (e.target.style.color = '#FFC107')}
                onMouseOut={(e) => (e.target.style.color = '#FAF9F6')}
              >
                Peer Review
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/assignments"
                style={navLinkStyle}
                onMouseOver={(e) => (e.target.style.color = '#FFC107')}
                onMouseOut={(e) => (e.target.style.color = '#FAF9F6')}
              >
                Assignments
              </Nav.Link>
              {isLoggedIn ? (
                <LogoutButton
                  as={Button}
                  variant="link"
                  style={navLinkStyle}
                  onClick={handleLogoutClick}
                  onMouseOver={(e) => (e.target.style.color = '#FFC107')}
                  onMouseOut={(e) => (e.target.style.color = '#FAF9F6')}
                >
                  Logout
                </LogoutButton>
              ) : (
                <>
                  <Nav.Link
                    as={Link}
                    to="/login"
                    style={navLinkStyle}
                    onMouseOver={(e) => (e.target.style.color = '#FFC107')}
                    onMouseOut={(e) => (e.target.style.color = '#FAF9F6')}
                  >
                    Login
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/register"
                    style={navLinkStyle}
                    onMouseOver={(e) => (e.target.style.color = '#FFC107')}
                    onMouseOut={(e) => (e.target.style.color = '#FAF9F6')}
                  >
                    Register
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={showLogoutModal} onHide={handleLogoutCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleLogoutCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleLogoutConfirm}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MyNavbar;