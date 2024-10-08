import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MyNavbar from './components/Navbar';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Reviews from './pages/Reviews';
import Login from './pages/Login';
import Register from './pages/Register';
import PeerReview from './pages/PeerReview';
import Assignments from './pages/Assignments';
import Dashboard from './pages/Dashboard';


function App() {
  return (
    <Router>
      <MyNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/peerreview" element={<PeerReview />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        
      </Routes>
    </Router>
  );
}

export default App;
