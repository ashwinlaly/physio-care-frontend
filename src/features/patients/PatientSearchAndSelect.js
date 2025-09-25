// src/features/patients/PatientSearchAndSelect.jsx
import React, { useState, useEffect } from 'react';
import { TextField, Button, List, ListItem, ListItemText, Paper, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Dummy patient data for demonstration
const dummyPatients = [
  { id: 'p001', name: 'John Doe', contact: '123-456-7890' },
  { id: 'p002', name: 'Jane Smith', contact: '098-765-4321' },
  { id: 'p003', name: 'Peter Jones', contact: '555-123-4567' },
  { id: 'p004', name: 'Alice Brown', contact: '111-222-3333' },
  { id: 'p005', name: 'Robert White', contact: '444-555-6666' },
  { id: 'p006', name: 'Emily Davis', contact: '777-888-9999' },
];

export const PatientSearchAndSelect = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  // Effect to filter dummy patients based on search term
  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = dummyPatients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.contact.includes(searchTerm)
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]); // Clear results if search term is empty
    }
  }, [searchTerm]);

  // Handler for selecting an existing patient
  const handleSelectPatient = (patientId) => {
    console.log('Selected patient ID:', patientId);
    // Navigate to a new route for creating an assessment for this patient
    // We'll define this route in App.js next
    navigate(`/patients/${patientId}/assessment`);
  };

  // Handler for creating a new patient
  const handleCreateNewPatient = () => {
    console.log('Initiating new patient creation...');
    // Navigate to a new route for creating a new patient
    // We'll define this route in App.js next
    navigate('/patients/new');
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, margin: 'auto' }}>
      <Typography variant="h5" gutterBottom align="center">
        Search or Select Patient
      </Typography>
      <TextField
        label="Search by Name or Contact No."
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
        autoFocus // Focus on this field when the component mounts
      />

      {/* Display search results if there's a search term and results */}
      {searchResults.length > 0 && searchTerm.length > 0 && (
        <Paper elevation={1} sx={{ mb: 2 }}>
          <List>
            {searchResults.map(patient => (
              <ListItem button key={patient.id} onClick={() => handleSelectPatient(patient.id)}>
                <ListItemText primary={patient.name} secondary={`Contact: ${patient.contact}`} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Message if no patients found for the current search term */}
      {searchTerm.length > 0 && searchResults.length === 0 && (
        <Typography variant="body1" color="textSecondary" sx={{ mb: 2, textAlign: 'center' }}>
          No patients found matching "{searchTerm}".
        </Typography>
      )}

      {/* Button to create a new patient */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateNewPatient}
        fullWidth
        size="large"
      >
        Create New Patient
      </Button>
    </Box>
  );
};
