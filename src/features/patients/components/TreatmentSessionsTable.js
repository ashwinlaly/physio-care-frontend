import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    TextField,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
    Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import {CreateAppointmentDialog} from "../../appointment/CreateAppointmentDialog";
import {TextWithTooltip} from "../../../components/TextWithTooltip";


const endpoint = process.env.REACT_APP_API_URL;

export const TreatmentSessionsTable = ({ patientId, assessmentId, patientDetails }) => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [isAdding, setIsAdding] = useState(false);
    const [newSession, setNewSession] = useState({
        date: new Date(),
        vas: '',
        electrotherapy: '',
        movementTherapy: '',
        exerciseTherapy: '',
        cash: '',
        remarks: '',
    });
    const [deleteDialog, setDeleteDialog] = useState({ open: false, sessionId: null });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [openDialog, setOpenDialog] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [appointments, setAppointments] = useState([]);

    // Fetch sessions on component mount
    useEffect(() => {
        fetchSessions();
    }, [assessmentId]);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${endpoint}/treatment/${patientId}/assessments/${assessmentId}/sessions`
            );
            if (response.ok) {
                const data = await response.json();
                setSessions(data);
            } else {
                showSnackbar('Failed to fetch treatment sessions', 'error');
            }
        } catch (error) {
            console.error('Error fetching sessions:', error);
            showSnackbar('Error fetching treatment sessions', 'error');
        } finally {
            setLoading(false);
        }
    };

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

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Add new session
    const handleAddClick = () => {
        setIsAdding(true);
    };

    const handleCancelAdd = () => {
        setIsAdding(false);
        setNewSession({
            date: new Date(),
            vas: '',
            electrotherapy: '',
            movementTherapy: '',
            exerciseTherapy: '',
            cash: '',
            remarks: '',
        });
    };

    const handleSaveNew = async () => {
        try {
            const response = await fetch(
                `${endpoint}/treatment/${patientId}/assessments/${assessmentId}/sessions`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newSession),
                }
            );

            if (response.ok) {
                showSnackbar('Treatment session added successfully');
                setIsAdding(false);
                setNewSession({
                    date: new Date(),
                    vas: '',
                    electrotherapy: '',
                    movementTherapy: '',
                    exerciseTherapy: '',
                    cash: '',
                    remarks: '',
                });
                fetchSessions();
            } else {
                showSnackbar('Failed to add treatment session', 'error');
            }
        } catch (error) {
            console.error('Error adding session:', error);
            showSnackbar('Error adding treatment session', 'error');
        }
    };

    // Edit existing session
    const handleEditClick = (session) => {
        setEditingId(session.id);
        setEditData({ ...session });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditData({});
    };

    const handleFieldChange = (field, value) => {
        setEditData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSaveEdit = async (sessionId) => {
        try {
            const { id, assessmentId, patientId, createdAt, updatedAt, ...dataToUpdate } = editData;

            const response = await fetch(`${endpoint}/treatment/sessions/${sessionId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToUpdate),
            });

            if (response.ok) {
                showSnackbar('Treatment session updated successfully');
                setEditingId(null);
                setEditData({});
                fetchSessions();
            } else {
                showSnackbar('Failed to update treatment session', 'error');
            }
        } catch (error) {
            console.error('Error updating session:', error);
            showSnackbar('Error updating treatment session', 'error');
        }
    };

    // Delete session
    const handleDeleteClick = (sessionId) => {
        setDeleteDialog({ open: true, sessionId });
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(
                `${endpoint}/treatment/sessions/${deleteDialog.sessionId}`,
                { method: 'DELETE' }
            );

            if (response.ok) {
                showSnackbar('Treatment session deleted successfully');
                setDeleteDialog({ open: false, sessionId: null });
                fetchSessions();
            } else {
                showSnackbar('Failed to delete treatment session', 'error');
            }
        } catch (error) {
            console.error('Error deleting session:', error);
            showSnackbar('Error deleting treatment session', 'error');
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialog({ open: false, sessionId: null });
    };

    // Calculate total cash
    const calculateTotalCash = () => {
        return sessions.reduce((total, session) => {
            const cash = parseFloat(session.cash) || 0;
            return total + cash;
        }, 0);
    };

    // Format date for display
    const formatDate = (dateValue) => {
        if (!dateValue) return '';
        try {
            // Handle Firestore Timestamp
            if (dateValue.seconds) {
                return format(new Date(dateValue.seconds * 1000), 'dd/MM/yyyy');
            }
            // Handle regular Date or ISO string
            return format(new Date(dateValue), 'dd/MM/yyyy');
        } catch (error) {
            return dateValue;
        }
    };

    // Export to Excel
    const handleExportExcel = () => {
        try {
            // Prepare data for Excel
            const exportData = sessions.map((session) => ({
                Date: formatDate(session.date),
                VAS: session.vas || '',
                'Electrotherapy': session.electrotherapy || '',
                'Movement Therapy': session.movementTherapy || '',
                'Exercise Therapy': session.exerciseTherapy || '',
                Cash: session.cash || '',
                Remarks: session.remarks || '',
            }));

            // Add total row
            exportData.push({
                Date: '',
                VAS: '',
                'Electrotherapy': '',
                'Movement Therapy': '',
                'Exercise Therapy': 'Total:',
                Cash: calculateTotalCash().toFixed(2),
                Remarks: '',
            });

            // Create workbook and worksheet
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Treatment Sessions');

            // Set column widths
            const columnWidths = [
                { wch: 12 }, // Date
                { wch: 8 },  // VAS
                { wch: 25 }, // Electrotherapy
                { wch: 25 }, // Movement Therapy
                { wch: 25 }, // Exercise Therapy
                { wch: 10 }, // Cash
                { wch: 30 }, // Remarks
            ];
            worksheet['!cols'] = columnWidths;

            // Generate filename with patient ID and date
            const filename = `Treatment_Sessions_${patientId}_${format(new Date(), 'ddMMyyyy')}.xlsx`;

            // Write file
            XLSX.writeFile(workbook, filename);

            showSnackbar('Excel file downloaded successfully', 'success');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            showSnackbar('Failed to export to Excel', 'error');
        }
    };

// Export to CSV (alternative/additional option)
    const handleExportCSV = () => {
        try {
            // Prepare CSV data
            const headers = ['Date', 'VAS', 'Electrotherapy', 'Movement Therapy', 'Exercise Therapy', 'Cash', 'Remarks'];
            const rows = sessions.map((session) => [
                formatDate(session.date),
                session.vas || '',
                session.electrotherapy || '',
                session.movementTherapy || '',
                session.exerciseTherapy || '',
                session.cash || '',
                session.remarks || '',
            ]);

            // Add total row
            rows.push(['', '', '', '', 'Total:', calculateTotalCash().toFixed(2), '']);

            // Combine headers and rows
            const csvContent = [
                headers.join(','),
                ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
            ].join('\n');

            // Create blob and download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `Treatment_Sessions_${patientId}_${format(new Date(), 'ddMMyyyy')}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showSnackbar('CSV file downloaded successfully', 'success');
        } catch (error) {
            console.error('Error exporting to CSV:', error);
            showSnackbar('Failed to export to CSV', 'error');
        }
    };

// Print function
    const handlePrint = () => {
        // Create a new window for printing
        const printWindow = window.open('', '_blank');

        const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Treatment Sessions - Patient ${patientId}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
        }
        h1 {
          color: #1976d2;
          font-size: 24px;
          margin-bottom: 10px;
        }
        .info {
          margin-bottom: 20px;
          color: #666;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #1976d2;
          color: white;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .total-row {
          background-color: #e3f2fd !important;
          font-weight: bold;
        }
        .footer {
          margin-top: 30px;
          font-size: 12px;
          color: #666;
        }
        @media print {
          button {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <h1>Treatment Sessions Report</h1>
      <div class="info">
        <strong>Patient Name:</strong> ${patientDetails?.name}<br>
        <strong>Patinet Phone:</strong> ${patientDetails?.contactNo}<br>
        <strong>Report Date:</strong> ${format(new Date(), 'dd/MM/yyyy')}<br>
        <strong>Total Sessions:</strong> ${sessions.length}
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>VAS</th>
            <th>Electrotherapy</th>
            <th>Movement Therapy</th>
            <th>Exercise Therapy</th>
            <th>Cash</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          ${sessions.map((session) => `
            <tr>
              <td>${formatDate(session.date)}</td>
              <td>${session.vas || '-'}</td>
              <td>${session.electrotherapy || '-'}</td>
              <td>${session.movementTherapy || '-'}</td>
              <td>${session.exerciseTherapy || '-'}</td>
              <td>${session.cash || '-'}</td>
              <td>${session.remarks || '-'}</td>
            </tr>
          `).join('')}
          <tr class="total-row">
            <td colspan="5" style="text-align: right;"><strong>Total Cash:</strong></td>
            <td><strong>₹${calculateTotalCash().toFixed(2)}</strong></td>
            <td></td>
          </tr>
        </tbody>
      </table>
      
      <div class="footer">
        <p>Generated on ${format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
      </div>
      
      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

        printWindow.document.write(printContent);
        printWindow.document.close();
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

    return (
        <Box sx={{ width: '100%', mt: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Treatment Sessions
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {/* Export/Print Buttons */}
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                    >
                        Book Appointment
                    </Button>
                    {sessions.length > 0 && (
                        <>
                            <Button
                                variant="outlined"
                                startIcon={<PrintIcon />}
                                onClick={handlePrint}
                                size="small"
                            >
                                Print
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                onClick={handleExportCSV}
                                size="small"
                            >
                                CSV
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                onClick={handleExportExcel}
                                size="small"
                            >
                                Excel
                            </Button>
                        </>
                    )}
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddClick}
                        disabled={isAdding}
                    >
                        Add New Session
                    </Button>
                </Box>
            </Box>

            {/* Table */}
            <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#E3F2FD' }}>
                            <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', width: '8%' }}>VAS</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', width: '18%' }}>Electrotherapy</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', width: '18%' }}>Movement Therapy</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', width: '18%' }}>Exercise Therapy</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', width: '8%' }}>Cash</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Remarks</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', width: '10%' }} align="center">
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* Add New Row */}
                        {isAdding && (
                            <TableRow sx={{ backgroundColor: '#FFF9C4' }}>
                                <TableCell>
                                    <DatePicker
                                        value={newSession.date}
                                        onChange={(newValue) => setNewSession({ ...newSession, date: newValue })}
                                        renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                        format="dd/MM/yyyy"
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        value={newSession.vas}
                                        onChange={(e) => setNewSession({ ...newSession, vas: e.target.value })}
                                        placeholder="0-10"
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        value={newSession.electrotherapy}
                                        onChange={(e) => setNewSession({ ...newSession, electrotherapy: e.target.value })}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        value={newSession.movementTherapy}
                                        onChange={(e) => setNewSession({ ...newSession, movementTherapy: e.target.value })}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        value={newSession.exerciseTherapy}
                                        onChange={(e) => setNewSession({ ...newSession, exerciseTherapy: e.target.value })}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        value={newSession.cash}
                                        onChange={(e) => setNewSession({ ...newSession, cash: e.target.value })}
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        value={newSession.remarks}
                                        onChange={(e) => setNewSession({ ...newSession, remarks: e.target.value })}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton size="small" color="primary" onClick={handleSaveNew}>
                                        <SaveIcon />
                                    </IconButton>
                                    <IconButton size="small" color="error" onClick={handleCancelAdd}>
                                        <CancelIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        )}

                        {/* Existing Sessions */}
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                    <Typography color="text.secondary">Loading sessions...</Typography>
                                </TableCell>
                            </TableRow>
                        ) : sessions.length === 0 && !isAdding ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                    <Typography color="text.secondary">
                                        📋 No treatment sessions yet. Click "Add New Session" to get started.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            sessions.map((session) => {
                                const isEditing = editingId === session.id;
                                return (
                                    <TableRow key={session.id} hover>
                                        <TableCell>
                                            {isEditing ? (
                                                <DatePicker
                                                    value={editData.date ? new Date(editData.date) : null}
                                                    onChange={(newValue) => handleFieldChange('date', newValue)}
                                                    renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                                                    format="dd/MM/yyyy"
                                                />
                                            ) : (
                                                formatDate(session.date)
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {isEditing ? (
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    value={editData.vas || ''}
                                                    onChange={(e) => handleFieldChange('vas', e.target.value)}
                                                />
                                            ) : (
                                                <TextWithTooltip text={session.vas} maxLength={30} />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {isEditing ? (
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    value={editData.electrotherapy || ''}
                                                    onChange={(e) => handleFieldChange('electrotherapy', e.target.value)}
                                                />
                                            ) : (
                                                <TextWithTooltip text={session.electrotherapy} maxLength={30} />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {isEditing ? (
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    value={editData.movementTherapy || ''}
                                                    onChange={(e) => handleFieldChange('movementTherapy', e.target.value)}
                                                />
                                            ) : (
                                                <TextWithTooltip text={session.movementTherapy} maxLength={30} />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {isEditing ? (
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    value={editData.exerciseTherapy || ''}
                                                    onChange={(e) => handleFieldChange('exerciseTherapy', e.target.value)}
                                                />
                                            ) : (
                                                <TextWithTooltip text={session.exerciseTherapy} maxLength={30} />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {isEditing ? (
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    value={editData.cash || ''}
                                                    onChange={(e) => handleFieldChange('cash', e.target.value)}
                                                />
                                            ) : (
                                                session.cash
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {isEditing ? (
                                                <TextField
                                                    size="small"
                                                    fullWidth
                                                    value={editData.remarks || ''}
                                                    onChange={(e) => handleFieldChange('remarks', e.target.value)}
                                                />
                                            ) : (
                                                <TextWithTooltip text={session.remarks} maxLength={30} />
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            {isEditing ? (
                                                <>
                                                    <IconButton size="small" color="primary" onClick={() => handleSaveEdit(session.id)}>
                                                        <SaveIcon />
                                                    </IconButton>
                                                    <IconButton size="small" color="error" onClick={handleCancelEdit}>
                                                        <CancelIcon />
                                                    </IconButton>
                                                </>
                                            ) : (
                                                <>
                                                    <IconButton size="small" color="primary" onClick={() => handleEditClick(session)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton size="small" color="error" onClick={() => handleDeleteClick(session.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}

                        {/* Total Row */}
                        {sessions.length > 0 && (
                            <TableRow sx={{ backgroundColor: '#F5F5F5' }}>
                                <TableCell colSpan={5} align="right" sx={{ fontWeight: 'bold' }}>
                                    Total Cash:
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                    ₹{calculateTotalCash().toFixed(2)}
                                </TableCell>
                                <TableCell colSpan={2}></TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog.open} onClose={handleCancelDelete}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this treatment session? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
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

            <CreateAppointmentDialog
                open={openDialog}
                onClose={handleCloseDialog}
                onSaved={handleAppointmentSaved}
                appointment={editingAppointment}
                selectedDate={selectedDate}
                patientId={patientId}
                patientDetails={patientDetails}
            />
        </Box>
    );
};
