// src/features/appointments/CreateAppointmentDialog.jsx

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    Autocomplete,
    MenuItem,
    Box,
    Typography,
    Alert,
    FormControl,
    InputLabel,
    Select,
    CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AddIcon from '@mui/icons-material/Add';
import { format } from 'date-fns';
import { AddDoctorModal } from '../doctors/AddDoctorModal';
import { apiRequest } from "../../common/api";
import { showToast } from "../../common/util";
import * as patient from "date-fns/locale";

const endpoint = process.env.REACT_APP_API_URL;

const TIME_SLOTS = [
    '06:30',
    '07:00', '07:30',
    '08:00', '08:30',
    '09:00', '09:30',
    '10:00', '10:30',
    '11:00', '11:30',
    '12:00', '12:30',
    '13:00', '13:30',
    '14:00', '14:30',
    '15:00', '15:30',
    '16:00', '16:30',
    '17:00', '17:30',
    '18:00', '18:30',
    '19:00', '19:30',
    '20:00'
];

const DURATIONS = [
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' },
];

export const CreateAppointmentDialog = ({ open, onClose, onSaved, appointment, selectedDate, patientId, patientDetails }) => {
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingPatients, setLoadingPatients] = useState(false);
    const [loadingDoctors, setLoadingDoctors] = useState(false);
    const [openAddDoctor, setOpenAddDoctor] = useState(false);
    const [conflictingAppointments, setConflictingAppointments] = useState([]);
    const [patientInputValue, setPatientInputValue] = useState('');

    const [formData, setFormData] = useState({
        patientId: '',
        contactNo: '',
        patientName: '',
        doctorId: '',
        doctorName: '',
        date: selectedDate || new Date(),
        timeSlot: '09:00',
        duration: 60,
        status: 'scheduled',
        notes: '',
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (patientId != '') {
            setFormData({
                ...formData,
                patientId: patientId,
                patientName: patientDetails.name,
                contactNo: patientDetails.contactNo,
            });
        }
    }, [patientId])

    useEffect(() => {
        console.log(patientId, patientDetails, formData);
    }, [formData]);

    const fetchPatients = async (searchTerm) => {
        try {
            setLoadingPatients(true);
            const data = await apiRequest(`${endpoint}/patients?searchTerm=${searchTerm}`, {
                method: 'GET',
                auth: true,
            });

            if (Array.isArray(data)) {
                setPatients(data);
            } else {
                setPatients([]);
            }
        } catch (error) {
            console.error('Error fetching patients:', error);
            showToast(error.message || 'Error fetching patients', 'error');
            setPatients([]);
        } finally {
            setLoadingPatients(false);
        }
    };

    const fetchDoctors = async () => {
        try {
            setLoadingDoctors(true);
            const data = await apiRequest(`${endpoint}/doctors?isActive=true`, {
                method: 'GET',
                auth: true,
            });

            if (Array.isArray(data)) {
                setDoctors(data);
            } else {
                setDoctors([]);
            }
        } catch (error) {
            console.error('Error fetching doctors:', error);
            showToast(error.message || 'Error fetching doctors', 'error');
            setDoctors([]);
        } finally {
            setLoadingDoctors(false);
        }
    };

    const checkConflicts = async () => {
        try {
            const dateStr = format(formData.date, 'yyyy-MM-dd');
            const data = await apiRequest(`${endpoint}/appointments/date/${dateStr}`, {
                method: 'GET',
                auth: true,
            });

            if (Array.isArray(data)) {
                const conflicts = data.filter(
                    apt => apt.timeSlot === formData.timeSlot && apt.id !== appointment?.id
                );
                setConflictingAppointments(conflicts);
            }
        } catch (error) {
            console.error('Error checking conflicts:', error);
            setConflictingAppointments([]);
        }
    };

    useEffect(() => {
        if (open) {
            fetchDoctors();
            if (appointment?.id) {
                const dateValue = appointment.date?.seconds
                    ? new Date(appointment.date.seconds * 1000)
                    : appointment.date
                        ? new Date(appointment.date)
                        : new Date();

                setFormData({
                    patientId: appointment.patientId || '',
                    patientName: appointment.patientName || '',
                    contactNo: appointment.contactNo || '',
                    doctorId: appointment.doctorId || '',
                    doctorName: appointment.doctorName || '',
                    date: dateValue,
                    timeSlot: appointment.timeSlot || '09:00',
                    duration: appointment.duration || 60,
                    status: appointment.status || 'scheduled',
                    notes: appointment.notes || '',
                });
            } else {
                if(patientId == '') {
                    setFormData({
                        patientId: '',
                        contactNo: '',
                        patientName: '',
                        doctorId: '',
                        doctorName: '',
                        date: appointment?.date ? new Date(appointment.date) : selectedDate || new Date(),
                        timeSlot: appointment?.timeSlot || '09:00',
                        duration: 60,
                        status: 'scheduled',
                        notes: '',
                    });
                }
            }

            setPatientInputValue('');
            setPatients([]);
        }
    }, [open, appointment, selectedDate]);

    useEffect(() => {
        if (!open || !patientInputValue) return;

        const delayDebounce = setTimeout(() => {
            if (patientInputValue.trim().length >= 3) {
                fetchPatients(patientInputValue.trim());
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [patientInputValue, open]);

    useEffect(() => {
        if (open && formData.date && formData.timeSlot) {
            checkConflicts();
        }
    }, [formData.date, formData.timeSlot, open]);

    const handleClose = () => {
        setFormData({
            patientId: '',
            patientName: '',
            contactNo: '',
            doctorId: '',
            doctorName: '',
            date: new Date(),
            timeSlot: '09:00',
            duration: 60,
            status: 'scheduled',
            notes: '',
        });
        setFormErrors({});
        setConflictingAppointments([]);
        setPatients([]);
        setPatientInputValue('');
        onClose();
    };

    const handleDoctorAdded = (newDoctor) => {
        setDoctors(prevDoctors => [...prevDoctors, newDoctor]);
        setFormData(prev => ({
            ...prev,
            doctorId: newDoctor.id,
            doctorName: newDoctor.name,
        }));
        setOpenAddDoctor(false);
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.patientId) {
            errors.patient = 'Patient is required';
        }
        if (!formData.date) {
            errors.date = 'Date is required';
        }
        if (!formData.timeSlot) {
            errors.timeSlot = 'Time slot is required';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);

            const dataToSubmit = {
                patientId: formData.patientId,
                contactNo: formData.contactNo,
                patientName: formData.patientName,
                doctorId: formData.doctorId || null,
                doctorName: formData.doctorName || null,
                date: format(formData.date, 'yyyy-MM-dd'),
                timeSlot: formData.timeSlot,
                duration: formData.duration,
                status: formData.status,
                notes: formData.notes,
            };

            const url = appointment?.id
                ? `${endpoint}/appointments/${appointment.id}`
                : `${endpoint}/appointments`;

            const method = appointment?.id ? 'PUT' : 'POST';

            await apiRequest(url, {
                method: method,
                body: dataToSubmit,
                auth: true
            });

            showToast(
                appointment?.id ? 'Appointment updated successfully' : 'Appointment booked successfully',
                'success'
            );
            onSaved();
            handleClose();
        } catch (error) {
            console.error('Error saving appointment:', error);
            showToast(error.message || 'Failed to save appointment', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handlePatientChange = (event, newValue) => {
        if (newValue) {
            setFormData({
                ...formData,
                patientId: newValue.id,
                patientName: newValue.name,
                contactNo: newValue.contactNo,
            });
        } else {
            setFormData({
                ...formData,
                patientId: '',
                patientName: '',
                contactNo: '',
            });
        }
    };

    const handlePatientInputChange = (event, newInputValue, reason) => {
        if (reason === 'input') {
            setPatientInputValue(newInputValue);
        }
    };

    const handleDoctorChange = (event, newValue) => {
        setFormData({
            ...formData,
            doctorId: newValue?.id || '',
            doctorName: newValue?.name || '',
        });
    };

    // Get selected patient/doctor
    const currentPatient = patients.find(p => p.id === formData.patientId) || null;
    const currentDoctor = doctors.find(d => d.id === formData.doctorId) || null;

    return (
        <>
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    {appointment?.id ? 'Edit Appointment' : 'Book Appointment'}
                </DialogTitle>
                <DialogContent>
                    <Grid spacing={3} sx={{ mt: 0.5 }}>
                        {/* Patient Selection */}
                        {patientId === '' ?
                            <Grid item style={{padding: '10px' }} xs={12} >
                            <Autocomplete
                                options={patients}
                                loading={loadingPatients}
                                value={currentPatient}
                                onInputChange={handlePatientInputChange}
                                onChange={handlePatientChange}
                                getOptionLabel={(option) => option.name || ''}
                                isOptionEqualToValue={(option, value) => option.id === value?.id}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Patient"
                                        placeholder="Type at least 3 characters to search..."
                                        error={!!formErrors.patient}
                                        helperText={formErrors.patient}
                                        required
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {loadingPatients ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.id}>
                                        <Box>
                                            <Typography variant="body1">{option.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Contact: {option.contactNo}
                                            </Typography>
                                        </Box>
                                    </li>
                                )}
                                noOptionsText={
                                    loadingPatients
                                        ? "Searching..."
                                        : patientInputValue.length < 3
                                            ? "Type at least 3 characters"
                                            : "No patients found"
                                }
                                filterOptions={(x) => x}
                            />
                        </Grid>
                        :
                            <h3 style={{paddingLeft: '10px'}}>
                                {formData.patientName} - {formData.contactNo}
                            </h3>
                        }
                        {/* Date */}
                        <Grid item xs={12} style={{padding: '10px' }} sm={6}>
                            <DatePicker
                                label="Date"
                                value={formData.date}
                                onChange={(newValue) => setFormData({ ...formData, date: newValue })}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        error={!!formErrors.date}
                                        helperText={formErrors.date}
                                        required
                                    />
                                )}
                                inputFormat="dd/MM/yyyy"
                            />
                        </Grid>

                        {/* Time Slot */}
                        <Grid item xs={12} sm={6} style={{padding: '10px' }}>
                            <FormControl fullWidth required error={!!formErrors.timeSlot}>
                                <InputLabel>Time Slot</InputLabel>
                                <Select
                                    value={formData.timeSlot}
                                    label="Time Slot"
                                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                                >
                                    {TIME_SLOTS.map((slot) => (
                                        <MenuItem key={slot} value={slot}>
                                            {slot}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Doctor Selection with Add Button */}
                        <Grid item xs={12} style={{padding: '10px' }}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                                <Autocomplete
                                    sx={{ flex: 1 }}
                                    options={doctors}
                                    getOptionLabel={(option) => option.name || ''}
                                    value={currentDoctor}
                                    onChange={handleDoctorChange}
                                    loading={loadingDoctors}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Doctor (Optional)"
                                            placeholder="Search & select doctor..."
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {loadingDoctors ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                    renderOption={(props, option) => (
                                        <li {...props} key={option.id}>
                                            <Box>
                                                <Typography variant="body1">{option.name}</Typography>
                                                {option.specialization && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        {option.specialization}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </li>
                                    )}
                                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                                    noOptionsText={loadingDoctors ? "Loading..." : "No doctors found"}
                                />
                                <Button
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    onClick={() => setOpenAddDoctor(true)}
                                    sx={{ minWidth: '140px', height: '56px' }}
                                >
                                    Add Doctor
                                </Button>
                            </Box>
                        </Grid>

                        {/* Duration */}
                        <Grid item xs={12} sm={6} style={{padding: '10px' }}>
                            <FormControl fullWidth>
                                <InputLabel>Duration</InputLabel>
                                <Select
                                    value={formData.duration}
                                    label="Duration"
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                >
                                    {DURATIONS.map((duration) => (
                                        <MenuItem key={duration.value} value={duration.value}>
                                            {duration.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Status */}
                        <Grid item xs={12} sm={6} style={{padding: '10px' }}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={formData.status}
                                    label="Status"
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <MenuItem value="scheduled">Scheduled</MenuItem>
                                    <MenuItem value="completed">Completed</MenuItem>
                                    <MenuItem value="cancelled">Cancelled</MenuItem>
                                    <MenuItem value="no-show">No Show</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Notes */}
                        <Grid item xs={12} style={{padding: '10px' }}>
                            <TextField
                                fullWidth
                                label="Notes"
                                multiline
                                rows={3}
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Any additional information..."
                            />
                        </Grid>

                        {/* Conflict Warning */}
                        {conflictingAppointments.length > 0 && (
                            <Grid item xs={12} style={{padding: '10px' }}>
                                <Alert severity={conflictingAppointments.length >= 3 ? "error" : "warning"}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {conflictingAppointments.length >= 3 ? '🔴' : '⚠'} {conflictingAppointments.length} other appointment(s) at {formData.timeSlot}:
                                    </Typography>
                                    {conflictingAppointments.map((apt, index) => (
                                        <Typography key={index} variant="body2">
                                            • {apt.patientName} {apt.doctorName ? `(${apt.doctorName})` : '(No doctor assigned)'}
                                        </Typography>
                                    ))}
                                    {conflictingAppointments.length >= 3 && (
                                        <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                                            Time slot is fully booked! Consider choosing a different time.
                                        </Typography>
                                    )}
                                </Alert>
                            </Grid>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                        {loading ? 'Saving...' : appointment?.id ? 'Update' : 'Book'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add Doctor Modal */}
            <AddDoctorModal
                open={openAddDoctor}
                onClose={() => setOpenAddDoctor(false)}
                onDoctorAdded={handleDoctorAdded}
            />
        </>
    );
};
