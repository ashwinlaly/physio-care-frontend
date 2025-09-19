import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './features/auth/LoginPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { AppLayout } from './components/AppLayout';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f4f6f8',
    }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

// A simple component to protect routes
const ProtectedRoute = ({ children }) => {
  // To test the login flow, set this to false. Go to /, you'll be redirected
  // to /login. After "logging in," you'll be sent back to /.
  const isAuthenticated = true; 

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="masters" element={<div>Masters Page</div>} />
            <Route path="patient" element={<div>Patient Management Page</div>} />
            <Route path="patients" element={<div>Patients Management Page</div>} />
            <Route path="appointments" element={<div>Appointments Page</div>} />
            <Route path="financial" element={<div>Financial Page</div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
