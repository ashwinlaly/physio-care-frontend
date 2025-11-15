import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './features/auth/LoginPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { AppLayout } from './components/AppLayout';
import { CssBaseline, ThemeProvider, createTheme, Typography } from '@mui/material';
import Home from './webpage/components/Home';

import {PatientSearchAndSelect} from './features/patients/PatientSearchAndSelect';
import { NewPatientForm } from './features/patients/NewPatientForm';
import { AssessmentForm } from './features/patients/AssessmentForm';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {Bounce, ToastContainer} from "react-toastify";
import {Profile} from "./components/Profile";
import {PatientAppointments} from "./features/patients/appointments/PatientAppointments";
import {FinancialDashboard} from "./features/Financial/FinancialDashboard";

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
  const isAuthenticated = localStorage.getItem("login"); 

  if (isAuthenticated != 'true') {
    // return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  console.log("-----------",process.env.REACT_APP_API_URL);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Bounce}
      />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard"  element={<DashboardPage />} />
              <Route path="/masters" element={<div>Masters Page</div>} />

              <Route path="/patients" element={<PatientSearchAndSelect />} />
              <Route path="/patients/new" element={<NewPatientForm/>} />
              <Route path="/patients/:patientId/assessment" element={<AssessmentForm />} />
              <Route path="/patients/:patientId/appointments/new" element={<AssessmentForm />} />
              <Route path="/patients/:patientId/appointments/:appointmentId/edit" element={<AssessmentForm />} />

              <Route path="/appointments" element={<div>Appointments Page</div>} />
              <Route path="/financial" element={<FinancialDashboard/>} />

              <Route path="/me/profile" element={<Profile/>} />

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
