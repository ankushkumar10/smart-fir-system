import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Pages
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import CitizenDashboard from './pages/CitizenDashboard/CitizenDashboard';
import FileFIR from './pages/CitizenDashboard/FileFIR';
import StatusCheck from './pages/CitizenDashboard/StatusCheck';
import PoliceDashboard from './pages/PoliceDashboard/PoliceDashboard';
import FIRManagement from './pages/PoliceDashboard/FIRManagement';
import Analytics from './pages/PoliceDashboard/Analytics';
import Profile from './pages/Profile/Profile';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';

// Context
import { AuthProvider } from './context/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Citizen Routes - Protected for citizens */}
            <Route path="/citizen" element={
              <ProtectedRoute requiredRole="citizen">
                <CitizenDashboard />
              </ProtectedRoute>
            } />
            <Route path="/citizen/file-fir" element={
              <ProtectedRoute requiredRole="citizen">
                <FileFIR />
              </ProtectedRoute>
            } />
            <Route path="/citizen/status" element={
              <ProtectedRoute requiredRole="citizen">
                <StatusCheck />
              </ProtectedRoute>
            } />
            
            {/* Police Routes - Protected for police officers */}
            <Route path="/police" element={
              <ProtectedRoute requiredRole="police">
                <PoliceDashboard />
              </ProtectedRoute>
            } />
            <Route path="/police/fir-management" element={
              <ProtectedRoute requiredRole="police">
                <FIRManagement />
              </ProtectedRoute>
            } />
            <Route path="/police/analytics" element={
              <ProtectedRoute requiredRole="police">
                <Analytics />
              </ProtectedRoute>
            } />
            
            {/* Profile Route - Accessible to both citizens and police */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;