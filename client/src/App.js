import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AuthInitializer from './components/AuthInitializer';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Issues from './pages/Issues';
import CreateProject from './pages/CreateProject';
import CreateIssue from './pages/CreateIssue';
import ProjectDetails from './pages/ProjectDetails';
import IssueDetails from './pages/IssueDetails';
import useAuthStore from './store/useAuthStore';
import './App.css';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <AuthInitializer />
      <div className="App">
        {isAuthenticated && <Navbar />}
        <Routes>
          {/* Public routes - only accessible when not authenticated */}
          {!isAuthenticated ? (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              {/* Protected routes - only accessible when authenticated */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/projects" element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              } />
              <Route path="/projects/new" element={
                <ProtectedRoute>
                  <CreateProject />
                </ProtectedRoute>
              } />
              <Route path="/projects/:id" element={
                <ProtectedRoute>
                  <ProjectDetails />
                </ProtectedRoute>
              } />
              <Route path="/issues" element={
                <ProtectedRoute>
                  <Issues />
                </ProtectedRoute>
              } />
              <Route path="/issues/new" element={
                <ProtectedRoute>
                  <CreateIssue />
                </ProtectedRoute>
              } />
              <Route path="/issues/:id" element={
                <ProtectedRoute>
                  <IssueDetails />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;