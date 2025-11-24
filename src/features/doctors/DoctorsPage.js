// src/features/doctors/DoctorsPage.jsx

import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    Snackbar,
    Alert,
    CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const endpoint = process.env.REACT_APP_API_URL;

export const DoctorsPage = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState({ open: false, doctorId: null });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    let [formData, setFormData] = useState({
        name: '',
        specialization: '',
        contactNo: '',
        email: '',
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${endpoint}/doctors`);
            if (response.ok) {
                const data = await response.json();
                setDoctors(data);
            } else {
                showSnackbar('Failed to fetch doctors', 'error');
            }
        } catch (error) {
            console.error('Error fetching doctors:', error);
            showSnackbar('Error fetching doctors', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleOpenDialog = (doctor = null) => {
        if (doctor) {
            setEditingDoctor(doctor);
            setFormData({
                name: doctor.name || '',
                specialization: doctor.specialization || '',
                contactNo: doctor.contactNo || '',
                email: doctor.email || '',
            });
        } else {
            setEditingDoctor(null);
            setFormData({
                name: '',
                specialization: '',
                contactNo: '',
                email: '',
            });
        }
        setFormErrors({});
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingDoctor(null);
        setFormData({
            name: '',
            specialization: '',
            contactNo: '',
            email: '',
        });
        setFormErrors({});
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        }
        if (!formData.contactNo.trim()) {
            errors.contactNo = 'Contact number is required';
        } else if (!/^[0-9]{10}$/.test(formData.contactNo)) {
            errors.contactNo = 'Contact number must be 10 digits';
        }
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Invalid email format';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        formData = {...formData, isActive: true};
        try {
            const url = editingDoctor
                ? `${endpoint}/doctors/${editingDoctor.id}`
                : `${endpoint}/doctors`;

            const method = editingDoctor ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: formData,
            });

            if (response.ok) {
                showSnackbar(
                    editingDoctor ? 'Doctor updated successfully' : 'Doctor added successfully'
                );
                handleCloseDialog();
                fetchDoctors();
            } else {
                const error = await response.json();
                showSnackbar(error.message || 'Operation failed', 'error');
            }
        } catch (error) {
            console.error('Error saving doctor:', error);
            showSnackbar('Error saving doctor', 'error');
        }
    };

    const handleDeleteClick = (doctorId) => {
        setDeleteDialog({ open: true, doctorId });
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(
                `${endpoint}/doctors/${deleteDialog.doctorId}`,
                { method: 'DELETE' }
            );

            if (response.ok) {
                showSnackbar('Doctor deleted successfully');
                setDeleteDialog({ open: false, doctorId: null });
                fetchDoctors();
            } else {
                showSnackbar('Failed to delete doctor', 'error');
            }
        } catch (error) {
            console.error('Error deleting doctor:', error);
            showSnackbar('Error deleting doctor', 'error');
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialog({ open: false, doctorId: null });
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Doctors Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Add Doctor
                </Button>
            </Box>

            {/* Doctors Table */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : doctors.length === 0 ? (
                <Paper sx={{ p: 8, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        No doctors added yet. Click "Add Doctor" to get started.
                    </Typography>
                </Paper>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#E3F2FD' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Specialization</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {doctors.map((doctor) => (
                                <TableRow key={doctor.id} hover>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{doctor.name}</TableCell>
                                    <TableCell>{doctor.specialization || '-'}</TableCell>
                                    <TableCell>{doctor.contactNo}</TableCell>
                                    <TableCell>{doctor.email || '-'}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={doctor.isActive !== false ? 'Active' : 'Inactive'}
                                            color={doctor.isActive !== false ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => handleOpenDialog(doctor)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDeleteClick(doctor.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Add/Edit Doctor Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                error={!!formErrors.name}
                                helperText={formErrors.name}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Specialization"
                                value={formData.specialization}
                                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                placeholder="e.g., Orthopedic, Sports, Neurological"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Contact Number"
                                value={formData.contactNo}
                                onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
                                error={!!formErrors.contactNo}
                                helperText={formErrors.contactNo}
                                placeholder="10-digit mobile number"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                error={!!formErrors.email}
                                helperText={formErrors.email}
                                placeholder="doctor@example.com"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {editingDoctor ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog.open} onClose={handleCancelDelete}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this doctor? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};
