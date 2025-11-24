// src/features/appointments/AppointmentsPage.jsx

import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    IconButton,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AddIcon from '@mui/icons-material/Add';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format, addDays, subDays } from 'date-fns';
import { CreateAppointmentDialog } from './CreateAppointmentDialog';

const endpoint = process.env.REACT_APP_API_URL;
// Time slots (1-hour intervals from 9 AM to 6 PM)
const TIME_SLOTS = [
    '09:00', '09:30',
    '10:00', '10:30',
    '11:00', '11:30',
    '12:00', '12:30',
    '13:00', '13:30',
    '14:00', '14:30',
    '15:00', '15:30',
    '16:00', '16:30',
    '17:00', '17:30',
    '18:00'
];

export const AppointmentsPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState(null);

    useEffect(() => {
        fetchAppointments();
    }, [selectedDate]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const dateStr = format(selectedDate, 'yyyy-MM-dd');
            const response = await fetch(`${endpoint}/appointments/date/${dateStr}`);

            if (response.ok) {
                const data = await response.json();
                setAppointments(data);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePreviousDay = () => {
        setSelectedDate(subDays(selectedDate, 1));
    };

    const handleNextDay = () => {
        setSelectedDate(addDays(selectedDate, 1));
    };

    const handleToday = () => {
        setSelectedDate(new Date());
    };

    const handleOpenDialog = (appointment = null) => {
        setEditingAppointment(appointment);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingAppointment(null);
    };

    const handleAppointmentSaved = () => {
        fetchAppointments();
        handleCloseDialog();
    };

    const handleDeleteAppointment = async (appointmentId) => {
        if (!window.confirm('Are you sure you want to delete this appointment?')) return;

        try {
            const response = await fetch(`${endpoint}/appointments/${appointmentId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchAppointments();
            } else {
                alert('Failed to delete appointment');
            }
        } catch (error) {
            console.error('Error deleting appointment:', error);
            alert('Error deleting appointment');
        }
    };

    const getAppointmentsForSlot = (timeSlot) => {
        return appointments.filter(apt => apt.timeSlot === timeSlot);
    };

    const getSlotStatus = (timeSlot) => {
        const count = getAppointmentsForSlot(timeSlot).length;
        if (count === 0) return 'available';
        if (count <= 2) return 'partial';
        return 'full';
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Appointments
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Book Appointment
                </Button>
            </Box>

            {/* Date Navigation */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton onClick={handlePreviousDay}>
                            <ChevronLeftIcon />
                        </IconButton>
                        <Typography variant="h6" sx={{ minWidth: '200px', textAlign: 'center' }}>
                            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                        </Typography>
                        <IconButton onClick={handleNextDay}>
                            <ChevronRightIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button variant="outlined" onClick={handleToday}>
                            Today
                        </Button>
                        <DatePicker
                            label="Select Date"
                            value={selectedDate}
                            onChange={(newValue) => setSelectedDate(newValue)}
                            renderInput={(params) => <Button {...params} variant="outlined" />}
                        />
                    </Box>
                </Box>
            </Paper>

            {/* Appointments Calendar */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {TIME_SLOTS.map((timeSlot) => {
                        const slotAppointments = getAppointmentsForSlot(timeSlot);
                        const status = getSlotStatus(timeSlot);

                        return (
                            <Paper key={timeSlot} sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                    {/* Time */}
                                    <Box sx={{ minWidth: '100px' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            {timeSlot}
                                        </Typography>
                                        <Chip
                                            label={
                                                status === 'available' ? 'Available' :
                                                    status === 'partial' ? `${slotAppointments.length}/3` :
                                                        'Fully Booked'
                                            }
                                            color={
                                                status === 'available' ? 'success' :
                                                    status === 'partial' ? 'warning' :
                                                        'error'
                                            }
                                            size="small"
                                            sx={{ mt: 1 }}
                                        />
                                    </Box>

                                    {/* Appointments */}
                                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        {slotAppointments.length === 0 ? (
                                            <Alert severity="info" sx={{ py: 0 }}>
                                                No appointments scheduled
                                            </Alert>
                                        ) : (
                                            slotAppointments.map((appointment) => (
                                                <Card key={appointment.id} variant="outlined">
                                                    <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Box sx={{ flex: 1 }}>
                                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                                    {appointment.patientName} - {appointment.contactNo}
                                                                </Typography>
                                                                {appointment.doctorName && (
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        Doctor: {appointment.doctorName}
                                                                    </Typography>
                                                                )}
                                                                {appointment.notes && (
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        Notes: {appointment.notes}
                                                                    </Typography>
                                                                )}
                                                                {appointment.duration && (
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        Duration: {appointment.duration} Minutes
                                                                    </Typography>
                                                                )}
                                                                <Chip
                                                                    label={appointment.status || 'scheduled'}
                                                                    size="small"
                                                                    sx={{ mt: 1 }}
                                                                />
                                                            </Box>
                                                            <Box>
                                                                {/*<IconButton*/}
                                                                {/*    size="small"*/}
                                                                {/*    color="primary"*/}
                                                                {/*    onClick={() => handleOpenDialog(appointment)}*/}
                                                                {/*>*/}
                                                                {/*    <EditIcon />*/}
                                                                {/*</IconButton>*/}
                                                                <IconButton
                                                                    size="small"
                                                                    color="error"
                                                                    onClick={() => handleDeleteAppointment(appointment.id)}
                                                                >
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Box>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            ))
                                        )}
                                    </Box>

                                    {/* Quick Add Button */}
                                    {status !== 'full' && (
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<AddIcon />}
                                            onClick={() => handleOpenDialog({ timeSlot, date: format(selectedDate, 'yyyy-MM-dd') })}
                                            sx={{ minWidth: '120px' }}
                                        >
                                            Add
                                        </Button>
                                    )}
                                </Box>
                            </Paper>
                        );
                    })}
                </Box>
            )}

            {/* Create/Edit Appointment Dialog */}
            <CreateAppointmentDialog
                open={openDialog}
                onClose={handleCloseDialog}
                onSaved={handleAppointmentSaved}
                appointment={editingAppointment}
                selectedDate={selectedDate}
            />
        </Box>
    );
};
