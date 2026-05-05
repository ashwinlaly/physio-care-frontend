// src/features/patients/PatientSearchAndSelect.jsx
import React, { useCallback, useEffect, useState } from 'react';
import { TextField, Button, List, ListItem, ListItemText, Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { Edit, Print, Delete } from '@mui/icons-material';
import { showToast, fireBaseDate } from "../../common/util";
import { apiRequest } from "../../common/api";

export const PatientSearchAndSelect = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const endpoint = process.env.REACT_APP_API_URL;

  const fetchAppointments = useCallback(
    async (patientId) => {
      try {
        setLoadingAppointments(true);
        const data = await apiRequest(`${endpoint}/assessment/${patientId}/assessments`, {
          method: 'GET',
          auth: true,
        });
        setAppointments(data || []);
      } catch (error) {
        showToast(error.message, 'error');
        console.error('Error fetching appointments:', error);
        setAppointments([]);
      } finally {
        setLoadingAppointments(false);
      }
    },
    [endpoint]
  );

  // Restore search + selection only when coming back from Assessment flow
  useEffect(() => {
    const state = location.state;
    if (!state) return;

    if (typeof state.patientSearchTerm === 'string') {
      setSearchTerm(state.patientSearchTerm);
    }
    if (state.selectedPatientId) {
      setSelectedPatientId(state.selectedPatientId);
      fetchAppointments(state.selectedPatientId);
    }
  }, [fetchAppointments, location.state]);

  useEffect(() => {
    if (searchTerm.length >= 4) {
      setLoadingPatients(true); // set immediately to suppress "No patients found"
    } else {
      setSearchResults([]);
      setLoadingPatients(false);
    }

    const fetchPatients = async () => {
      if (searchTerm.length >= 4) {
        try {
          const data = await apiRequest(`${endpoint}/patients?searchTerm=${searchTerm}`, {
            method: 'GET',
            auth: true,
          });
          setSearchResults(data);
        } catch (error) {
          showToast(error.message, 'error');
          console.error('Error fetching patients:', error);
          setSearchResults([]);
        } finally {
          setLoadingPatients(false);
        }
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchPatients();
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [endpoint, searchTerm]);

  const handleSelectPatient = (patientId) => {
    console.log('Selected patient ID:', patientId);
    setSelectedPatientId(patientId);
    fetchAppointments(patientId);
  };

  const handleCreateAppointment = () => {
    navigate(`/patients/${selectedPatientId}/assessment`, {
      state: { patientSearchTerm: searchTerm, selectedPatientId },
    });
  };

  const handleEditAppointment = (appointmentId) => {
    navigate(`/patients/${selectedPatientId}/appointments/${appointmentId}/edit`, {
      state: { patientSearchTerm: searchTerm, selectedPatientId },
    });
  };

  const handlePrintAppointment = (appointment) => {
    window.print();
  };

  const handleDeleteClick = (appointmentId) => {
    setAppointmentToDelete(appointmentId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await apiRequest(`${endpoint}/assessment/${selectedPatientId}/assessments/${appointmentToDelete}`, {
        method: 'DELETE',
        auth: true,
      });
      showToast('Assessment deleted successfully', 'success');
      setDeleteDialogOpen(false);
      fetchAppointments(selectedPatientId);
    } catch (error) {
      showToast(error.message, 'error');
      console.error('Error deleting assessment:', error);
    }
  };

  const handleCreateNewPatient = () => {
    console.log('Initiating new patient creation...');
    navigate('/patients/new');
  };

  return (
    <Box sx={{ p: 3, maxWidth: 900, margin: 'auto' }}>
      <Typography variant="h5" gutterBottom align="center">
        Search or Select Patient
      </Typography>
      <TextField
        label="Search by Name or Contact No."
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        sx={{ mb: 2 }}
        autoFocus
      />

      {searchResults.length > 0 && searchTerm.length > 0 && (
        <Paper elevation={1} sx={{ mb: 2 }}>
          <List>
            {searchResults.map(patient => (
              <ListItem button key={patient.id} onClick={() => handleSelectPatient(patient.id)}>
                <ListItemText primary={patient.name} secondary={`Contact: ${patient.contactNo}`} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {searchTerm.length >=4 && !loadingPatients && searchResults.length === 0 && (
        <Typography variant="body1" color="textSecondary" sx={{ mb: 2, textAlign: 'center' }}>
          No patients found matching "{searchTerm}".
        </Typography>
      )}

      {/* Appointments Section */}
      {selectedPatientId && (
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Patient Assessments</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateAppointment}
            >
              Create New Assessments
            </Button>
          </Box>

          {loadingAppointments ? (
            <Typography>Loading assessments...</Typography>
          ) : appointments.length === 0 ? (
            <Typography color="textSecondary">No assessments found for this patient.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell>Date</TableCell>
                    <TableCell>Chief Complaint Description</TableCell>
                    <TableCell>Pain Scale</TableCell>
                    <TableCell>Diagnosis</TableCell>
                    <TableCell>Interventions</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointments.map(appointment => (
                    <TableRow key={appointment.id}>
                      <TableCell>{fireBaseDate(appointment.createdAt)}</TableCell>
                      <TableCell>{appointment.chiefComplaintDescription}</TableCell>
                      <TableCell>{appointment.painScale}</TableCell>
                      <TableCell>{appointment.diagnosis}</TableCell>
                      <TableCell>{appointment.interventions}</TableCell>
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
        </Box>
      )}

      {appointments.length === 0 ? <Box sx={{mt: 3}}>
        <Button
            variant="contained"
            color="primary"
            onClick={handleCreateNewPatient}
            fullWidth
            size="large"
        >
          Create New Patient
        </Button>
      </Box> : null }

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