// src/features/doctors/AddDoctorModal.jsx

import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
} from '@mui/material';
import {apiRequest} from "../../common/api";

const endpoint = process.env.REACT_APP_API_URL;

export const AddDoctorModal = ({ open, onClose, onDoctorAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        specialization: '',
        contactNo: '',
        isActive: true
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleClose = () => {
        setFormData({
            name: '',
            specialization: '',
            contactNo: '',
        });
        setFormErrors({});
        onClose();
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
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setSubmitting(true);
            const response = await apiRequest(`${endpoint}/doctors`, {
                method: 'POST',
                auth: true,
                body: formData,
            });

            if (response) {
                onDoctorAdded(response); // Pass the new doctor back to parent
                handleClose();
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to add doctor');
            }
        } catch (error) {
            console.error('Error adding doctor:', error);
            alert('Error adding doctor');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add New Doctor</DialogTitle>
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
                            autoFocus
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Specialization"
                            value={formData.specialization}
                            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                            placeholder="e.g., Orthopedic, Sports Physiotherapy"
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
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={submitting}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
                    {submitting ? 'Adding...' : 'Add Doctor'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
