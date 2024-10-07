import React, { useState, useEffect } from 'react';
import { ArrowRight, Users, MessageSquare, BarChart2, BookOpen, Award, Globe, Clock, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import './Home.css';
import heroImage from '../assets/hero-image.jpg';
import partnerLogo1 from '../assets/partner-logo-1.jpeg';
import partnerLogo2 from '../assets/partner-logo-2.jpg';
import partnerLogo3 from '../assets/partner-logo-3.jpg';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    className="feature-card"
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Icon size={32} className="feature-icon" />
    <h3>{title}</h3>
    <p>{description}</p>
  </motion.div>
);

const TestimonialCard = ({ quote, author, role, image }) => (
  <div className="testimonial-card">
    <img src={image} alt={author} className="testimonial-image" />
    <blockquote>"{quote}"</blockquote>
    <div className="testimonial-author">
      <strong>{author}</strong>
      <span>{role}</span>
    </div>
  </div>
);

const StatCard = ({ value, label, icon: Icon }) => (
  <motion.div 
    className="stat-card"
    whileHover={{ y: -5 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Icon size={24} className="stat-icon" />
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </motion.div>
);

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="faq-item">
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        {question}
        <span className={`faq-icon ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      {isOpen && <p className="faq-answer">{answer}</p>}
    </div>
  );
};

export default function Home() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonials = [
    { quote: "PeerConnect has revolutionized the way I learn and collaborate with my classmates. The peer review system is incredibly helpful!", author: "Sarah J.", role: "Computer Science Student", image: "path/to/sarah-image.jpg" },
    { quote: "As an educator, I've seen a significant improvement in student engagement and performance. PeerConnect is a game-changer in education.", author: "Prof. Michael R.", role: "University Professor", image: "path/to/michael-image.jpg" },
    { quote: "The peer review system has helped me refine my work and gain valuable insights. I've grown so much as a student thanks to PeerConnect.", author: "Alex T.", role: "Engineering Student", image: "path/to/alex-image.jpg" },
    { quote: "PeerConnect's collaborative tools have made group projects a breeze. It's improved my teamwork skills tremendously.", author: "Emily L.", role: "Business Student", image: "path/to/emily-image.jpg" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <main className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Elevate Your Learning with PeerConnect</h1>
          <p>Harness the power of collaborative learning and peer feedback to accelerate your academic growth.</p>
          <button className="cta-button">
            Get Started <ArrowRight size={16} />
          </button>
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="Students collaborating" />
        </div>
      </section>

      <section className="features">
        <h2>Empowering Features</h2>
        <div className="feature-grid">
          <FeatureCard 
            icon={Users} 
            title="Collaborative Projects" 
            description="Work together on assignments and projects in real-time with intuitive collaboration tools." 
          />
          <FeatureCard 
            icon={MessageSquare} 
            title="Peer Reviews" 
            description="Give and receive valuable feedback from your peers to improve your work and understanding." 
          />
          <FeatureCard 
            icon={BarChart2} 
            title="Progress Tracking" 
            description="Monitor your learning journey with detailed analytics and personalized insights." 
          />
          <FeatureCard 
            icon={BookOpen} 
            title="Resource Sharing" 
            description="Access and share a wide range of learning materials within our knowledge ecosystem." 
          />
          <FeatureCard 
            icon={Globe} 
            title="Global Community" 
            description="Connect with students and educators from around the world, expanding your network and perspectives." 
          />
          <FeatureCard 
            icon={Clock} 
            title="Time Management" 
            description="Utilize built-in scheduling and reminder tools to stay on top of your assignments and deadlines." 
          />
          <FeatureCard 
            icon={Shield} 
            title="Plagiarism Detection" 
            description="Ensure academic integrity with our advanced plagiarism detection system." 
          />
          <FeatureCard 
            icon={Award} 
            title="Skill Endorsements" 
            description="Receive endorsements for your skills from peers and instructors, building a verifiable portfolio." 
          />
        </div>
      </section>

      <section className="testimonials">
        <h2>Success Stories</h2>
        <div className="testimonial-carousel">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className={`testimonial-slide ${index === activeTestimonial ? 'active' : ''}`}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: index === activeTestimonial ? 1 : 0, x: index === activeTestimonial ? 0 : 100 }}
              transition={{ duration: 0.5 }}
            >
              <TestimonialCard {...testimonial} />
            </motion.div>
          ))}
        </div>
        <div className="carousel-indicators">
          {testimonials.map((_, index) => (
            <button 
              key={index} 
              className={`indicator ${index === activeTestimonial ? 'active' : ''}`}
              onClick={() => setActiveTestimonial(index)}
            />
          ))}
        </div>
      </section>

      <section className="stats">
        <h2>PeerConnect Impact</h2>
        <div className="stats-grid">
          <StatCard value="50,000+" label="Active Users" icon={Users} />
          <StatCard value="250,000+" label="Peer Reviews" icon={MessageSquare} />
          <StatCard value="98%" label="User Satisfaction" icon={Award} />
          <StatCard value="35%" label="Average Grade Improvement" icon={BarChart2} />
          <StatCard value="1,000+" label="Partnered Institutions" icon={BookOpen} />
          <StatCard value="100+" label="Countries Represented" icon={Globe} />
        </div>
      </section>

      <section className="faq">
        <h2>Frequently Asked Questions</h2>
        <FAQItem 
          question="How does PeerConnect ensure the quality of peer reviews?"
          answer="PeerConnect uses a combination of AI-powered review matching, rubric-based assessments, and instructor oversight to maintain high-quality peer reviews. We also provide comprehensive training for students on how to give constructive feedback."
        />
        <FAQItem 
          question="Can PeerConnect integrate with my institution's existing LMS?"
          answer="Yes, PeerConnect offers seamless integration with major Learning Management Systems (LMS) such as Canvas, Blackboard, and Moodle. Our team can also work on custom integrations for other platforms."
        />
        <FAQItem 
          question="Is PeerConnect suitable for all academic disciplines?"
          answer="Absolutely! While PeerConnect was initially developed for STEM fields, it has been successfully adapted for use in humanities, social sciences, business, and arts programs. Our platform is highly customizable to suit the needs of various disciplines."
        />
        <FAQItem 
          question="How does PeerConnect protect student privacy and data?"
          answer="We take privacy very seriously. PeerConnect is FERPA compliant and employs state-of-the-art encryption and security measures. All student data is anonymized for peer review processes, and we never share or sell user information."
        />
      </section>

      <section className="partners">
        <h2>Trusted by Leading Institutions</h2>
        <div className="partner-logos">
          <img src={partnerLogo1} alt="Partner University 1" />
          <img src={partnerLogo2} alt="Partner University 2" />
          <img src={partnerLogo3} alt="Partner University 3" />
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Transform Your Learning Experience?</h2>
        <p>Join thousands of students and educators who are already benefiting from collaborative learning on PeerConnect.</p>
        <button className="cta-button">
          Start Your Journey <ArrowRight size={16} />
        </button>
      </section>
    </main>
  );
}