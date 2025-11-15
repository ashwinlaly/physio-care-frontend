import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Edit, Print, Delete } from '@mui/icons-material';
import { showToast } from "../../../common/util";
import { apiRequest } from "../../../common/api";

export const PatientAppointments = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const endpoint = process.env.REACT_APP_API_URL;

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, [patientId]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await apiRequest(
        `${endpoint}/patients/${patientId}/appointments`,
        {
          method: 'GET',
          auth: true,
        }
      );
      setAppointments(data);
    } catch (error) {
      showToast(error.message, 'error');
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAppointment = () => {
    navigate(`/patients/${patientId}/appointments/new`);
  };

  const handleEditAppointment = (appointmentId) => {
    navigate(`/patients/${patientId}/appointments/${appointmentId}/edit`);
  };

  const handlePrintAppointment = (appointment) => {
    window.print();
    // You can customize print content as needed
  };

  const handleDeleteClick = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await apiRequest(
        `${endpoint}/patients/${patientId}/appointments/${selectedAppointmentId}`,
        {
          method: 'DELETE',
          auth: true,
        }
      );
      showToast('Appointment deleted successfully', 'success');
      setDeleteDialogOpen(false);
      fetchAppointments();
    } catch (error) {
      showToast(error.message, 'error');
      console.error('Error deleting appointment:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Patient Appointments</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateAppointment}
        >
          Create New Appointment
        </Button>
      </Box>

      {loading ? (
        <Typography>Loading appointments...</Typography>
      ) : appointments.length === 0 ? (
        <Typography color="textSecondary">No appointments found for this patient.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map(appointment => (
                <TableRow key={appointment.id}>
                  <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.type}</TableCell>
                  <TableCell>{appointment.status}</TableCell>
                  <TableCell>{appointment.doctorName}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Button
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => handleEditAppointment(appointment.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Print />}
                        onClick={() => handlePrintAppointment(appointment)}
                      >
                        Print
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDeleteClick(appointment.id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this appointment?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};