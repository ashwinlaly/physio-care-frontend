import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { apiRequest } from '../../common/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';
const ATTENDANCE_USERS_ENDPOINT = process.env.REACT_APP_ATTENDANCE_USERS_ENDPOINT || '/attendance/users';
const ATTENDANCE_MONTHLY_ENDPOINT = process.env.REACT_APP_ATTENDANCE_MONTHLY_ENDPOINT || '/attendance/monthly';

const monthOptions = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
];

const getStatusChip = (status) => {
    const statusConfig = {
        complete: { label: 'Complete', color: 'success', icon: '✓' },
        incomplete: { label: 'Incomplete', color: 'error', icon: '✗' },
        'multiday-start': { label: 'Multi-day (Start)', color: 'warning', icon: '→' },
        'multiday-end': { label: 'Multi-day (End)', color: 'info', icon: '←' },
        empty: { label: 'No Activity', color: 'default', icon: '—' },
    };

    const config = statusConfig[status] || statusConfig.empty;
    return (
        <Chip
            label={config.label}
            color={config.color}
            size="small"
            variant="outlined"
        />
    );
};

export const MonthlyAttendanceReport = () => {
    const now = new Date();
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear] = useState(String(now.getFullYear()));

    const [usersLoading, setUsersLoading] = useState(false);
    const [reportLoading, setReportLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [report, setReport] = useState(null);

    const selectedUser = useMemo(
        () => users.find((user) => user.userId === selectedUserId) || null,
        [users, selectedUserId],
    );

    useEffect(() => {
        const loadUsers = async () => {
            setUsersLoading(true);
            setErrorMessage('');

            try {
                const response = await apiRequest(`${API_BASE_URL}${ATTENDANCE_USERS_ENDPOINT}`, {
                    method: 'GET',
                    auth: true,
                });

                setUsers(response?.items || []);
            } catch (error) {
                setErrorMessage(error?.message || 'Failed to load attendance users.');
            } finally {
                setUsersLoading(false);
            }
        };

        loadUsers();
    }, []);

    const handleGenerateReport = async () => {
        setErrorMessage('');

        const parsedYear = Number(year);
        if (!selectedUserId) {
            setErrorMessage('Please select a user.');
            return;
        }

        if (!Number.isInteger(parsedYear) || parsedYear < 2000 || parsedYear > 2100) {
            setErrorMessage('Please enter a valid year between 2000 and 2100.');
            return;
        }

        setReportLoading(true);
        setReport(null);

        try {
            const query = new URLSearchParams({
                userId: selectedUserId,
                month: String(month),
                year: String(parsedYear),
            });

            const response = await apiRequest(
                `${API_BASE_URL}${ATTENDANCE_MONTHLY_ENDPOINT}?${query.toString()}`,
                {
                    method: 'GET',
                    auth: true,
                },
            );

            setReport(response);
        } catch (error) {
            setErrorMessage(error?.message || 'Failed to generate monthly report.');
        } finally {
            setReportLoading(false);
        }
    };

    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                    Monthly Attendance Report
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Select user and month-year to view day-wise worked hours.
                </Typography>
            </Box>

            <Card>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth size="small" disabled={usersLoading || reportLoading}>
                                <InputLabel id="attendance-user-label">User</InputLabel>
                                <Select
                                    labelId="attendance-user-label"
                                    label="User"
                                    value={selectedUserId}
                                    onChange={(event) => setSelectedUserId(event.target.value)}
                                >
                                    {users.map((user) => (
                                        <MenuItem key={user.userId} value={user.userId}>
                                            {user.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={6} md={3}>
                            <FormControl fullWidth size="small" disabled={reportLoading}>
                                <InputLabel id="attendance-month-label">Month</InputLabel>
                                <Select
                                    labelId="attendance-month-label"
                                    label="Month"
                                    value={month}
                                    onChange={(event) => setMonth(Number(event.target.value))}
                                >
                                    {monthOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={6} md={3}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Year"
                                value={year}
                                onChange={(event) => setYear(event.target.value)}
                                disabled={reportLoading}
                            />
                        </Grid>

                        <Grid item xs={12} md={2}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleGenerateReport}
                                disabled={reportLoading || usersLoading}
                                sx={{ height: '100%' }}
                            >
                                {reportLoading ? 'Loading...' : 'Search'}
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {usersLoading && (
                <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={20} />
                    <Typography variant="body2">Loading users...</Typography>
                </Stack>
            )}

            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            {report && (
                <Stack spacing={2}>
                    <Card>
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="caption" color="text.secondary">User</Typography>
                                    <Typography variant="h6">{report.name || selectedUser?.name || selectedUserId}</Typography>
                                </Grid>
                                <Grid item xs={6} md={2}>
                                    <Typography variant="caption" color="text.secondary">Month</Typography>
                                    <Typography variant="h6">{report.month}/{report.year}</Typography>
                                </Grid>
                                <Grid item xs={6} md={2}>
                                    <Typography variant="caption" color="text.secondary">Total Hours</Typography>
                                    <Typography variant="h6">{report.totalWorkedHours || 0}</Typography>
                                </Grid>
                                <Grid item xs={6} md={2}>
                                    <Typography variant="caption" color="text.secondary">Sessions</Typography>
                                    <Typography variant="h6">{report.totalSessions || 0}</Typography>
                                </Grid>
                                {/*<Grid item xs={6} md={2}>*/}
                                {/*    <Typography variant="caption" color="text.secondary">Incomplete</Typography>*/}
                                {/*    <Typography variant="h6">{report.totalIncompleteSessions || 0}</Typography>*/}
                                {/*</Grid>*/}
                            </Grid>
                        </CardContent>
                    </Card>

                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                    <TableCell><strong>Date</strong></TableCell>
                                    <TableCell align="center"><strong>Check-In</strong></TableCell>
                                    <TableCell align="center"><strong>Check-Out</strong></TableCell>
                                    <TableCell align="right"><strong>Hours</strong></TableCell>
                                    <TableCell align="right"><strong>Minutes</strong></TableCell>
                                    <TableCell align="center"><strong>Status</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {report.items?.map((day) => (
                                    <TableRow
                                        key={day.dateKey}
                                        sx={{
                                            backgroundColor:
                                                day.status === 'incomplete'
                                                    ? 'rgba(244, 67, 54, 0.05)'
                                                    : day.status === 'multiday-start' || day.status === 'multiday-end'
                                                      ? 'rgba(255, 193, 7, 0.05)'
                                                      : 'inherit',
                                        }}
                                    >
                                        <TableCell>{day.dateKey}</TableCell>
                                        <TableCell align="center">
                                            {day.firstCheckInTime ? (
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {day.firstCheckInTime}
                                                </Typography>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    —
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            {day.lastCheckOutTime ? (
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {day.lastCheckOutTime}
                                                </Typography>
                                            ) : (
                                                <Typography variant="body2" color="error">
                                                    Pending
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="right">{day.workedHours || 0}</TableCell>
                                        <TableCell align="right">{day.workedMinutes || 0}</TableCell>
                                        <TableCell align="center">{getStatusChip(day.status)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Stack>
            )}
        </Stack>
    );
};

