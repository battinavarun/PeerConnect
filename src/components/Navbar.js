import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

// Inline styles for the Navbar components
const navbarStyle = {
  backgroundColor: '#4285F4',
  padding: '10px',
};

const navLinkStyle = {
  color: '#FAF9F6',
  textDecoration: 'none',
  fontSize: '1.2rem',  // Adjusted font size for nav links
};

const brandStyle = {
  color: '#FAF9F6',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '1.8rem',  // Adjusted font size specifically for PeerConnect
};

// Component definition with inline styles
function MyNavbar() {
  const navigate = useNavigate();
  
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('userEmail') !== null;

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPassword');
    // Redirect to login page
    navigate('/login');
  };

  return (
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
              to="/courses"  // New link for Courses page
              style={navLinkStyle}
              onMouseOver={(e) => (e.target.style.color = '#FFC107')}
              onMouseOut={(e) => (e.target.style.color = '#FAF9F6')}
            >
              Courses
            </Nav.Link>
            {isLoggedIn ? (
              <>
                <Nav.Link
                  as={Link}
                  to="#"
                  style={navLinkStyle}
                  onClick={handleLogout}
                >
                  Logout
                </Nav.Link>
              </>
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
  );
}

export default MyNavbar;
