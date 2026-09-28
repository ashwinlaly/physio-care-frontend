import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './features/auth/LoginPage';
import { SignupPage } from './features/auth/SignupPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { AppLayout } from './components/AppLayout';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Home from './webpage/components/Home';

import {PatientSearchAndSelect} from './features/patients/PatientSearchAndSelect';
import { NewPatientForm } from './features/patients/NewPatientForm';
import { AssessmentForm } from './features/patients/AssessmentForm';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {Bounce, ToastContainer} from "react-toastify";
import {Profile} from "./components/Profile";
import { DoctorsPage } from './features/doctors/DoctorsPage';
import { AppointmentsPage } from './features/appointment/AppointmentsPage';
import {FinancialDashboard} from "./features/Financial/FinancialDashboard";
import {ProductsPage} from "./features/products/ProductsPage";
import {SalesPage} from "./features/sales/SalesPage";
import {ExpensesPage} from "./features/expense/ExpensesPage";
import {RegisterPage} from "./features/register/RegisterPage";
import {AttendanceMarking} from "./features/attendance/AttendanceMarking";
import {MonthlyAttendanceReport} from './features/attendance/MonthlyAttendanceReport';
import { UsersAccessPage } from './features/users/UsersAccessPage';
import { RolesPage } from './features/roles/RolesPage';
import { UserRolesPage } from './features/users/UserRolesPage';
import AuditLogsPage from './features/audit/AuditLogsPage';
import { getPermissions } from './common/sessionManager';


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
  components: {
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          color: '#d32f2f',
        },
      },
    },
  },
});

// A simple component to protect routes
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = Boolean(localStorage.getItem('authToken'));
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PermissionRoute = ({ permission, children }) => {
  const permissions = getPermissions();
  if (!permissions.includes(permission)) {
    return <Navigate to="/dashboard" replace />;
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
            <Route path="/signup" element={<SignupPage />} />
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard"  element={<PermissionRoute permission="dashboard"><DashboardPage /></PermissionRoute>} />
              <Route path="/masters" element={<div>Masters Page</div>} />

              <Route path="/patients" element={<PermissionRoute permission="patients"><PatientSearchAndSelect /></PermissionRoute>} />
              <Route path="/patients/new" element={<PermissionRoute permission="patients"><NewPatientForm/></PermissionRoute>} />
              <Route path="/patients/:patientId/assessment" element={<PermissionRoute permission="patients"><AssessmentForm /></PermissionRoute>} />
              <Route path="/patients/:patientId/appointments/new" element={<PermissionRoute permission="patients"><AssessmentForm /></PermissionRoute>} />
              <Route path="/patients/:patientId/appointments/:appointmentId/edit" element={<PermissionRoute permission="patients"><AssessmentForm /></PermissionRoute>} />

              <Route path="/financial" element={<PermissionRoute permission="financial"><FinancialDashboard/></PermissionRoute>} />

              <Route path="/me/profile" element={<PermissionRoute permission="profile"><Profile/></PermissionRoute>} />
              <Route path="/doctors" element={<PermissionRoute permission="doctors"><DoctorsPage /></PermissionRoute>} />
              <Route path="/appointments" element={<PermissionRoute permission="appointments"><AppointmentsPage /></PermissionRoute>} />

               <Route path="/products" element={<PermissionRoute permission="products"><ProductsPage /></PermissionRoute>} />
               <Route path="/sales" element={<PermissionRoute permission="sales"><SalesPage /></PermissionRoute>} />
               <Route path="/expenses" element={<PermissionRoute permission="expenses"><ExpensesPage /></PermissionRoute>} />
               <Route path="/register" element={<PermissionRoute permission="register"><RegisterPage /></PermissionRoute>} />
               <Route path="/attendance" element={<PermissionRoute permission="attendance"><AttendanceMarking /></PermissionRoute>} />
               <Route path="/attendance/report" element={<PermissionRoute permission="attendance_report"><MonthlyAttendanceReport /></PermissionRoute>} />
               <Route path="/users-access" element={<PermissionRoute permission="users_access"><UsersAccessPage /></PermissionRoute>} />
               <Route path="/roles" element={<PermissionRoute permission="roles.read"><RolesPage /></PermissionRoute>} />
               <Route path="/users-roles" element={<PermissionRoute permission="users.update"><UserRolesPage /></PermissionRoute>} />
               <Route path="/audit" element={<PermissionRoute permission="audit_logs.read"><AuditLogsPage /></PermissionRoute>} />

               <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;