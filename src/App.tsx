import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Signup from './pages/SignUp';  // <-- import here
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import HealthRecords from './pages/HealthRecords';
import AnalyzeDocuments from './pages/AnalyzeDocuments';
import Analysis from './pages/Analysis';

// Components
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />  {/* <-- add here */}

          {/* Protected Routes wrapped in PrivateRoute */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="records" element={<HealthRecords />} />
            <Route path="analyze" element={<AnalyzeDocuments />} />
            <Route path="analysis" element={<Analysis />} />
          </Route>

          {/* Catch-all redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
