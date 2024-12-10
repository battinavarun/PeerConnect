import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Button } from 'react-bootstrap';
import styled, { keyframes } from 'styled-components';

const navbarStyle = {
  backgroundColor: '#4285F4',
  padding: '15px',
  color: '#FAF9F6',
  width: '100%',
  zIndex: 1000,
  position: 'sticky',
  top: 0
};

const navLinkStyle = {
  color: '#FAF9F6',
  textDecoration: 'none',
  fontSize: '1.2rem',
  margin: '0 12px',
  display: 'flex',
  alignItems: 'center',
  fontWeight: '500'
};

const brandStyle = {
  color: '#FAF9F6',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '2rem',
  marginRight: '30px'
};

const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const BlinkingLogout = styled(Nav.Link)`
  animation: ${blink} 2s linear infinite;
  color: #FAF9F6 !important;
  font-weight: bold;
`;

function CombinedNavbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
      const adminStatus = localStorage.getItem('isAdmin') === 'true';
      
      if (loggedInStatus) {
        setIsLoggedIn(true);
        setIsAdmin(adminStatus);
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
        navigate('/login');
      }
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, [navigate]);

  const handleLogoutClick = () => setShowLogoutModal(true);

  const handleLogoutConfirm = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setShowLogoutModal(false);
    navigate('/login');
  };

  const handleLogoutCancel = () => setShowLogoutModal(false);

  if (!isLoggedIn) return null;

  return (
    <>
      <Navbar expand="lg" style={navbarStyle}>
        <Container fluid>
          <Navbar.Brand as={Link} to="/home" style={brandStyle}>
            PeerConnect
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <div className="d-flex align-items-center">
                <Nav.Link
                  as={Link}
                  to={isAdmin ? "/home" : "/home"}
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
                <Nav.Link
                  as={Link}
                  to="/courses"
                  style={navLinkStyle}
                  onMouseOver={(e) => (e.target.style.color = '#FFC107')}
                  onMouseOut={(e) => (e.target.style.color = '#FAF9F6')}
                >
                  Courses
                </Nav.Link>
                {isAdmin && (
                  <>
                    <Nav.Link
                      as={Link}
                      to="/dashboard"
                      style={navLinkStyle}
                      onMouseOver={(e) => (e.target.style.color = '#FFC107')}
                      onMouseOut={(e) => (e.target.style.color = '#FAF9F6')}
                    >
                      Dashboard
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/newstudents"
                      style={navLinkStyle}
                      onMouseOver={(e) => (e.target.style.color = '#FFC107')}
                      onMouseOut={(e) => (e.target.style.color = '#FAF9F6')}
                    >
                      New Students
                    </Nav.Link>
                  </>
                )}
                <BlinkingLogout
                  as={Button}
                  variant="link"
                  style={{...navLinkStyle, marginLeft: '20px', color: '#FF6B6B'}}
                  onClick={handleLogoutClick}
                  onMouseOver={(e) => (e.target.style.color = '#FF4757')}
                  onMouseOut={(e) => (e.target.style.color = '#FF6B6B')}
                >
                  Logout
                </BlinkingLogout>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={showLogoutModal} onHide={handleLogoutCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to logout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleLogoutCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLogoutConfirm}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CombinedNavbar;