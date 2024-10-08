import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Tab, Tabs } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './Assignments.css';

const Assignments = () => {
  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem('projects');
    return savedProjects ? JSON.parse(savedProjects) : [];
  });
  const [reviews, setReviews] = useState(() => {
    const savedReviews = localStorage.getItem('reviews');
    return savedReviews ? JSON.parse(savedReviews) : [];
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    dueDate: new Date(),
    groupSize: 1,
    reviewersPerProject: 2
  });

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('reviews', JSON.stringify(reviews));
  }, [reviews]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleDateChange = (date) => {
    setNewItem({ ...newItem, dueDate: date });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItemWithId = { ...newItem, id: Date.now(), dueDate: newItem.dueDate.toISOString() };
    if (modalType === 'project') {
      setProjects(prevProjects => [...prevProjects, newItemWithId]);
    } else {
      setReviews(prevReviews => [...prevReviews, newItemWithId]);
    }
    setShowModal(false);
    setNewItem({
      title: '',
      description: '',
      dueDate: new Date(),
      groupSize: 1,
      reviewersPerProject: 2
    });
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const renderCards = (items, type) => {
    return items.map((item) => (
      <Col md={6} lg={4} key={item.id} className="mb-4">
        <Card className="assignment-card">
          <Card.Body>
            <Card.Title>{item.title}</Card.Title>
            <Card.Text>Due Date: {new Date(item.dueDate).toLocaleDateString()}</Card.Text>
            {type === 'project' ? (
              <Card.Text>Group Size: {item.groupSize}</Card.Text>
            ) : (
              <Card.Text>Reviewers per Project: {item.reviewersPerProject}</Card.Text>
            )}
            <Button variant="outline-primary" size="sm">View Details</Button>
          </Card.Body>
        </Card>
      </Col>
    ));
  };

  return (
    <Container className="assignments-container">
      <h1 className="assignments-title">Project Assignments and Peer Reviews</h1>
      <Tabs defaultActiveKey="projects" id="assignment-tabs" className="mb-3">
        <Tab eventKey="projects" title="Project Assignments">
          <Button variant="primary" className="mb-3" onClick={() => openModal('project')}>
            Create New Project Assignment
          </Button>
          <Row>{renderCards(projects, 'project')}</Row>
        </Tab>
        <Tab eventKey="reviews" title="Peer Reviews">
          <Button variant="primary" className="mb-3" onClick={() => openModal('review')}>
            Create New Peer Review
          </Button>
          <Row>{renderCards(reviews, 'review')}</Row>
        </Tab>
      </Tabs>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'project' ? 'Create New Project Assignment' : 'Create New Peer Review'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newItem.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newItem.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <DatePicker
                selected={newItem.dueDate}
                onChange={handleDateChange}
                className="form-control"
                required
              />
            </Form.Group>
            {modalType === 'project' ? (
              <Form.Group className="mb-3">
                <Form.Label>Group Size</Form.Label>
                <Form.Control
                  type="number"
                  name="groupSize"
                  value={newItem.groupSize}
                  onChange={handleInputChange}
                  min={1}
                  max={5}
                  required
                />
              </Form.Group>
            ) : (
              <Form.Group className="mb-3">
                <Form.Label>Reviewers per Project</Form.Label>
                <Form.Control
                  type="number"
                  name="reviewersPerProject"
                  value={newItem.reviewersPerProject}
                  onChange={handleInputChange}
                  min={1}
                  max={5}
                  required
                />
              </Form.Group>
            )}
            <Button variant="primary" type="submit">
              Create {modalType === 'project' ? 'Project Assignment' : 'Peer Review'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Assignments;