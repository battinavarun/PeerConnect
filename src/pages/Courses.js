import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Tab, Tabs, Modal, ProgressBar, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faClock, faUsers, faStar } from '@fortawesome/free-solid-svg-icons';
import './Courses.css';

const courses = [
  {
    id: 1,
    title: 'Web Development Bootcamp',
    description: 'Master HTML, CSS, JavaScript, and React to build modern web applications.',
    imageUrl: 'https://example.com/web-dev-image.jpg',
    instructor: 'John Doe',
    rating: 4.8,
    studentsEnrolled: 10500,
    modules: [
      { id: 1, title: 'Introduction to HTML', duration: '2 hours' },
      { id: 2, title: 'CSS Basics', duration: '3 hours' },
      { id: 3, title: 'JavaScript Fundamentals', duration: '4 hours' },
    ],
    demoTutorials: [
      { id: 1, title: 'Building Your First Webpage', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Styling with CSS', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    ],
  },

  {
    id: 2,
    title: 'Data Science Fundamentals',
    description: 'Learn the basics of data analysis, machine learning, and statistical modeling.',
    imageUrl: 'https://example.com/data-science-image.jpg',
    instructor: 'Jane Smith',
    rating: 4.7,
    studentsEnrolled: 8200,
    modules: [
      { id: 1, title: 'Introduction to Python', duration: '3 hours' },
      { id: 2, title: 'Data Manipulation with Pandas', duration: '4 hours' },
      { id: 3, title: 'Machine Learning Basics', duration: '5 hours' },
    ],
    demoTutorials: [
      { id: 1, title: 'Exploratory Data Analysis', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Building a Simple ML Model', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    ],
  },

  {
    id: 3,
    title: 'Mobile App Development with React Native',
    description: 'Create cross-platform mobile apps using React Native and JavaScript.',
    imageUrl: 'https://example.com/react-native-image.jpg',
    instructor: 'Alex Johnson',
    rating: 4.9,
    studentsEnrolled: 6800,
    modules: [
      { id: 1, title: 'React Native Basics', duration: '3 hours' },
      { id: 2, title: 'Building UI Components', duration: '4 hours' },
      { id: 3, title: 'State Management with Redux', duration: '3 hours' },
    ],
    demoTutorials: [
      { id: 1, title: 'Creating Your First React Native App', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Implementing Navigation', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    ],
  },  
  {
    id: 4,
    title: 'Cloud Computing with AWS',
    description: 'Learn to design, deploy, and manage applications on Amazon Web Services.',
    imageUrl: 'https://example.com/aws-image.jpg',
    instructor: 'Sarah Lee',
    rating: 4.6,
    studentsEnrolled: 5500,
    modules: [
      { id: 1, title: 'AWS Core Services', duration: '4 hours' },
      { id: 2, title: 'Serverless Architecture', duration: '3 hours' },
      { id: 3, title: 'DevOps on AWS', duration: '5 hours' },
    ],
    demoTutorials: [
      { id: 1, title: 'Setting Up an EC2 Instance', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Creating a Lambda Function', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    ],
  },



  
];

function Courses() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTutorial, setSelectedTutorial] = useState(null);

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
  };

  const handleShowTutorial = (tutorial) => {
    setSelectedTutorial(tutorial);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTutorial(null);
  };

  return (
    <div className="courses-page">
      {/* Hero Section */}
      <div className="courses-hero">
        <Container>
          <h1 className="hero-title">Elevate Your Career with Our Professional Courses</h1>
          <p className="hero-description">
            Unlock your potential with industry-leading courses designed to give you the skills you need to succeed in today's competitive job market.
          </p>
          <Button variant="light" size="lg" className="mt-4">Explore Courses</Button>
        </Container>
      </div>

      {/* Courses Section */}
      <Container className="courses-container">
        <Tabs defaultActiveKey="courses" id="courses-tabs" className="mb-4">
          <Tab eventKey="courses" title="Available Courses">
            <Row>
              {courses.map((course) => (
                <Col key={course.id} md={6} lg={4} className="course-col mb-4">
                  <Card className="course-card h-100">
                    <div className="course-image-wrapper">
                      <Card.Img variant="top" src={course.imageUrl} className="course-image" />
                      <div className="course-overlay">
                        <Button variant="light" onClick={() => handleViewDetails(course)}>View Details</Button>
                      </div>
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="course-title">{course.title}</Card.Title>
                      <Card.Text className="course-text flex-grow-1">{course.description}</Card.Text>
                      <div className="course-meta">
                        <span className="instructor"><FontAwesomeIcon icon={faUsers} /> {course.instructor}</span>
                        <span className="rating"><FontAwesomeIcon icon={faStar} /> {course.rating}</span>
                        <span className="enrolled"><FontAwesomeIcon icon={faUsers} /> {course.studentsEnrolled.toLocaleString()} students</span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Tab>
          <Tab eventKey="details" title="Course Details" disabled={!selectedCourse}>
            {selectedCourse && (
              <div className="course-details">
                <Row>
                  <Col md={8}>
                    <h2>{selectedCourse.title}</h2>
                    <p className="lead">{selectedCourse.description}</p>
                    <div className="course-meta mb-4">
                      <Badge bg="primary" className="me-2"><FontAwesomeIcon icon={faUsers} /> {selectedCourse.instructor}</Badge>
                      <Badge bg="success" className="me-2"><FontAwesomeIcon icon={faStar} /> {selectedCourse.rating}</Badge>
                      <Badge bg="info"><FontAwesomeIcon icon={faUsers} /> {selectedCourse.studentsEnrolled.toLocaleString()} students</Badge>
                    </div>
                    <h3>Course Modules</h3>
                    <div className="module-list">
                      {selectedCourse.modules.map((module, index) => (
                        <div key={module.id} className="module-item">
                          <div className="module-header">
                            <span className="module-number">{index + 1}</span>
                            <h4 className="module-title">{module.title}</h4>
                            <span className="module-duration"><FontAwesomeIcon icon={faClock} /> {module.duration}</span>
                          </div>
                          <ProgressBar now={30} label={`30%`} className="module-progress" />
                        </div>
                      ))}
                    </div>
                  </Col>
                  <Col md={4}>
                    <Card className="course-cta-card">
                      <Card.Body>
                        <h3>Enroll Now</h3>
                        <p className="lead mb-4">Start your learning journey today!</p>
                        <Button variant="primary" size="lg" block className="mb-3">Enroll in Course</Button>
                        <p className="text-muted">30-day money-back guarantee</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                <h3 className="mt-5">Demo Tutorials</h3>
                <Row>
                  {selectedCourse.demoTutorials.map((tutorial) => (
                    <Col key={tutorial.id} md={6} lg={4} className="mb-4">
                      <Card className="tutorial-card">
                        <Card.Body>
                          <Card.Title>{tutorial.title}</Card.Title>
                          <Button
                            variant="outline-primary"
                            onClick={() => handleShowTutorial(tutorial)}
                          >
                            <FontAwesomeIcon icon={faPlay} className="me-2" />
                            Watch Tutorial
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </Tab>
        </Tabs>
      </Container>

      {/* Tutorial Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedTutorial?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="embed-responsive embed-responsive-16by9">
            <iframe
              className="embed-responsive-item"
              src={selectedTutorial?.videoUrl}
              allowFullScreen
              title={selectedTutorial?.title}
            ></iframe>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Courses;