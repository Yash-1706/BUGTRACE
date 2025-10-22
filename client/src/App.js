import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Issues from './pages/Issues';
import CreateProject from './pages/CreateProject';
import CreateIssue from './pages/CreateIssue';
import ProjectDetails from './pages/ProjectDetails';
import IssueDetails from './pages/IssueDetails';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/new" element={<CreateProject />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/issues" element={<Issues />} />
          <Route path="/issues/new" element={<CreateIssue />} />
          <Route path="/issues/:id" element={<IssueDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;