// src/features/patients/PatientSearchAndSelect.jsx
import React, { useState, useEffect } from 'react';
import { TextField, Button, List, ListItem, ListItemText, Paper, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {showToast} from "../../common/util";
import {apiRequest} from "../../common/api";


export const PatientSearchAndSelect = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const endpoint = process.env.REACT_APP_API_URL;

  // Effect to filter dummy patients based on search term
  useEffect(() => {
    const fetchPatients = async () => {
      if (searchTerm.length > 4) {
        try {
          const data = await apiRequest(`${endpoint}/patients?searchTerm=${searchTerm}`, {
            method: 'GET',
            auth: true, // set to true if this endpoint requires auth token
          });
          setSearchResults(data);
        } catch (error) {
          showToast(error.message, 'error');
          console.error('Error fetching patients:', error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchPatients();
    }, 300); // 300ms delay

    return () => clearTimeout(delayDebounceFn);
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
                <ListItemText primary={patient.name} secondary={`Contact: ${patient.contactNo}`} />
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
