// src/features/financial/FinancialDashboard.jsx

import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    TextField,
    Button,
    Card,
    CardContent,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Collapse,
    IconButton,
    MenuItem,
    Select,
    InputLabel,
    InputAdornment,
    Chip,
    CircularProgress,
    Divider,
    Autocomplete, List, ListItem, ListItemText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import * as XLSX from 'xlsx';
import {apiRequest} from "../../common/api";
import {fireBaseDate, showToast} from "../../common/util";

const endpoint = process.env.REACT_APP_API_URL;

export const FinancialDashboard = () => {
    // State management
    const [viewType, setViewType] = useState('single'); // 'single' or 'all'
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [fromDate, setFromDate] = useState(startOfMonth(new Date()));
    const [toDate, setToDate] = useState(endOfMonth(new Date()));
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [financialData, setFinancialData] = useState([]);
    const [expandedPatient, setExpandedPatient] = useState(null);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const fetchPatients = async () => {
            if (searchTerm.length > 4) {
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
                }
            } else {
                setSearchResults([]);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            fetchPatients();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // Fetch financial data when filters change
    useEffect(() => {
        fetchFinancialData();
    }, [viewType, selectedPatient, fromDate, toDate]);


    const fetchFinancialData = async () => {
        try {
            setLoading(true);

            if (viewType === 'single' && !selectedPatient) {
                console.log('Single patient view but no patient selected');
                setFinancialData([]);
                setLoading(false);
                return;
            }

            // Fetch all sessions
            let allSessions = [];
            allSessions = await fetchSessionsForPatient(selectedPatient.id);
            console.log('Total sessions fetched:', allSessions.length); // Debug log

            // Filter by date range
            const filteredSessions = allSessions.filter(session => {
                const sessionDate = new Date(session.date.seconds ? session.date.seconds * 1000 : session.date);
                return sessionDate >= fromDate && sessionDate <= toDate;
            });

            console.log('Sessions after date filter:', filteredSessions.length); // Debug log

            // Process and group data
            const processedData = processFinancialData(filteredSessions);
            console.log('Processed financial data:', processedData); // Debug log

            setFinancialData(processedData);

        } catch (error) {
            console.error('Error fetching financial data:', error);
        } finally {
            setLoading(false);
        }
    };


    const fetchSessionsForPatient = async (patientId) => {
        try {
            // Fetch all assessments for the patient
            const assessmentsResponse = await fetch(
                `${endpoint}/assessment/${patientId}/assessments`
            );

            if (!assessmentsResponse.ok) return [];

            const assessments = await assessmentsResponse.json();
            let allSessions = [];

            // For each assessment, fetch its sessions
            for (const assessment of assessments) {
                const sessionsResponse = await fetch(
                    `${endpoint}/treatment/${patientId}/assessments/${assessment.id}/sessions`
                );

                if (sessionsResponse.ok) {
                    const sessions = await sessionsResponse.json();
                    // Add assessment info to each session
                    const sessionsWithAssessment = sessions.map(session => ({
                        ...session,
                        assessmentData: assessment,
                    }));
                    allSessions = [...allSessions, ...sessionsWithAssessment];
                }
            }

            return allSessions;
        } catch (error) {
            console.error(`Error fetching sessions for patient ${patientId}:`, error);
            return [];
        }
    };

    const processFinancialData = (sessions) => {
        const groupedByPatient = {};

        sessions.forEach(session => {
            const patientId = session.patientId;
            const assessmentId = session.assessmentId;

            if (!groupedByPatient[patientId]) {
                groupedByPatient[patientId] = {
                    patientId,
                    patientName: session.patientName || 'Unknown Patient',
                    assessments: {},
                    totalSessions: 0,
                    totalCash: 0,
                };
            }

            if (!groupedByPatient[patientId].assessments[assessmentId]) {
                groupedByPatient[patientId].assessments[assessmentId] = {
                    assessmentId,
                    diagnosis: session.assessmentData?.diagnosis || 'N/A',
                    createdDate: fireBaseDate(session.assessmentData?.createdAt),
                    sessions: [],
                    subtotal: 0,
                };
            }

            const cash = parseFloat(session.cash) || 0;
            groupedByPatient[patientId].assessments[assessmentId].sessions.push(session);
            groupedByPatient[patientId].assessments[assessmentId].subtotal += cash;
            groupedByPatient[patientId].totalSessions += 1;
            groupedByPatient[patientId].totalCash += cash;
        });

        return Object.values(groupedByPatient);
    };

    const calculateSummary = () => {
        const totalRevenue = financialData.reduce((sum, p) => sum + p.totalCash, 0);
        const totalPatients = financialData.length;
        const totalSessions = financialData.reduce((sum, p) => sum + p.totalSessions, 0);

        return { totalRevenue, totalPatients, totalSessions };
    };

    const formatDate = (dateValue) => {
        if (!dateValue) return 'N/A';
        try {
            if (dateValue.seconds) {
                return format(new Date(dateValue.seconds * 1000), 'dd/MM/yyyy');
            }
            return format(new Date(dateValue), 'dd/MM/yyyy');
        } catch (error) {
            return 'N/A';
        }
    };

    const handleExpandClick = (patientId) => {
        setExpandedPatient(expandedPatient === patientId ? null : patientId);
    };

    const handleExportExcel = () => {
        try {
            const workbook = XLSX.utils.book_new();

            if (viewType === 'single' && financialData.length > 0) {
                // Single patient export
                const patient = financialData[0];
                exportSinglePatient(workbook, patient);
            } else {
                // All patients export
                exportAllPatients(workbook);
            }

            const filename = viewType === 'single'
                ? `Financial_Report_${financialData[0]?.patientName.replace(/\s/g, '_')}_${format(new Date(), 'ddMMyyyy')}.xlsx`
                : `Financial_Report_All_Patients_${format(new Date(), 'ddMMyyyy')}.xlsx`;

            XLSX.writeFile(workbook, filename);
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            alert('Failed to export Excel file');
        }
    };

    const exportSinglePatient = (workbook, patient) => {
        const detailedData = [];

        Object.values(patient.assessments).forEach(assessment => {
            detailedData.push({
                'Assessment': assessment.diagnosis,
                'Created Date': formatDate(assessment.createdDate),
                'Session Date': '',
                'VAS': '',
                'Electrotherapy': '',
                'Movement Therapy': '',
                'Exercise Therapy': '',
                'Cash': '',
                'Remarks': '',
            });

            assessment.sessions.forEach(session => {
                detailedData.push({
                    'Assessment': '',
                    'Created Date': '',
                    'Session Date': formatDate(session.date),
                    'VAS': session.vas || '',
                    'Electrotherapy': session.electrotherapy || '',
                    'Movement Therapy': session.movementTherapy || '',
                    'Exercise Therapy': session.exerciseTherapy || '',
                    'Cash': session.cash || '',
                    'Remarks': session.remarks || '',
                });
            });

            detailedData.push({
                'Assessment': '',
                'Created Date': '',
                'Session Date': '',
                'VAS': '',
                'Electrotherapy': '',
                'Movement Therapy': '',
                'Exercise Therapy': 'Subtotal:',
                'Cash': assessment.subtotal.toFixed(2),
                'Remarks': '',
            });

            detailedData.push({}); // Empty row
        });

        detailedData.push({
            'Assessment': '',
            'Created Date': '',
            'Session Date': '',
            'VAS': '',
            'Electrotherapy': '',
            'Movement Therapy': '',
            'Exercise Therapy': 'TOTAL:',
            'Cash': patient.totalCash.toFixed(2),
            'Remarks': '',
        });

        const worksheet = XLSX.utils.json_to_sheet(detailedData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Patient Report');
    };

    const exportAllPatients = (workbook) => {
        // Sheet 1: Summary
        const summaryData = financialData.map(patient => ({
            'Patient Name': patient.patientName,
            'Assessments': Object.keys(patient.assessments).length,
            'Total Sessions': patient.totalSessions,
            'Total Cash': patient.totalCash.toFixed(2),
            'Average/Session': (patient.totalCash / patient.totalSessions).toFixed(2),
        }));

        summaryData.push({
            'Patient Name': 'GRAND TOTAL',
            'Assessments': '',
            'Total Sessions': financialData.reduce((sum, p) => sum + p.totalSessions, 0),
            'Total Cash': financialData.reduce((sum, p) => sum + p.totalCash, 0).toFixed(2),
            'Average/Session': '',
        });

        const summarySheet = XLSX.utils.json_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

        // Sheet 2: Detailed
        const detailedData = [];
        financialData.forEach(patient => {
            Object.values(patient.assessments).forEach(assessment => {
                assessment.sessions.forEach(session => {
                    detailedData.push({
                        'Patient Name': patient.patientName,
                        'Assessment': assessment.diagnosis,
                        'Session Date': formatDate(session.date),
                        'VAS': session.vas || '',
                        'Electrotherapy': session.electrotherapy || '',
                        'Movement Therapy': session.movementTherapy || '',
                        'Exercise Therapy': session.exerciseTherapy || '',
                        'Cash': session.cash || '',
                        'Remarks': session.remarks || '',
                    });
                });
            });
        });

        const detailedSheet = XLSX.utils.json_to_sheet(detailedData);
        XLSX.utils.book_append_sheet(workbook, detailedSheet, 'Detailed Sessions');
    };

    const filteredFinancialData = financialData.filter(patient =>
        patient.patientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const summary = calculateSummary();

    const handleSelectPatient = (patientId) => {
        // console.log('Selected patient ID:', setSelectedPatient);
        setPatients(patients);
        setSelectedPatient(patientId);
        setSearchResults([]);
        fetchFinancialData()
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Page Header */}
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
                Financial Dashboard
            </Typography>

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ bgcolor: '#E3F2FD' }}>
                        <CardContent>
                            <Typography variant="h6" color="text.secondary">Total Revenue</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                ₹{summary.totalRevenue.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ bgcolor: '#F3E5F5' }}>
                        <CardContent>
                            <Typography variant="h6" color="text.secondary">Total Patients</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                                {summary.totalPatients}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ bgcolor: '#E8F5E9' }}>
                        <CardContent>
                            <Typography variant="h6" color="text.secondary">Total Sessions</Typography>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                {summary.totalSessions}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filters Section */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={3} alignItems="center">
                    {/* View Type Radio */}
                    <Grid item xs={12} md={3}>
                        <FormControl component="fieldset">
                            <TextField
                                label="Search by Name or Contact No."
                                variant="outlined"
                                fullWidth
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                sx={{ mb: 2 }}
                                autoFocus
                            />

                            {searchResults.length > 0 && searchTerm.length > 0 && (
                                <Paper elevation={1} sx={{ mb: 2 }}>
                                    <List>
                                        {searchResults.map(patient => (
                                            <ListItem button key={patient.id} onClick={() => handleSelectPatient(patient)}>
                                                <ListItemText primary={patient.name} secondary={`Contact: ${patient.contactNo}`} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Grid item xs={12} md={viewType === 'single' ? 12 : 3}>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setSearchTerm('');
                                    setSearchResults([]);
                                    setSelectedPatient('');

                                }}
                                fullWidth
                            >
                               Clear
                            </Button>
                        </Grid>
                    </Grid>
                    {/* Patient Selection (only for single view) */}
                    {/*{viewType === 'single' && (*/}
                    {/*    <Grid item xs={12} md={12} >*/}
                    {/*        <Autocomplete*/}
                    {/*            options={patients}*/}
                    {/*            getOptionLabel={(option) => option.name || 'Unknown'}*/}
                    {/*            value={patients.find(p => p.id === selectedPatient) || null}*/}
                    {/*            onChange={(event, newValue) => {*/}
                    {/*                setSelectedPatient(newValue ? newValue.id : '');*/}
                    {/*            }}*/}
                    {/*            renderInput={(params) => (*/}
                    {/*                <TextField*/}
                    {/*                    {...params}*/}
                    {/*                    label="Search & Select Patient"*/}
                    {/*                    placeholder="Type to search..."*/}
                    {/*                />*/}
                    {/*            )}*/}
                    {/*            renderOption={(props, option) => (*/}
                    {/*                <li {...props}>*/}
                    {/*                    <Box>*/}
                    {/*                        <Typography variant="body1">{option.name}</Typography>*/}
                    {/*                        <Typography variant="caption" color="text.secondary">*/}
                    {/*                            ID: {option.id}*/}
                    {/*                        </Typography>*/}
                    {/*                    </Box>*/}
                    {/*                </li>*/}
                    {/*            )}*/}
                    {/*            isOptionEqualToValue={(option, value) => option.id === value.id}*/}
                    {/*            noOptionsText="No patients found"*/}
                    {/*        />*/}
                    {/*    </Grid>*/}
                    {/*)}*/}

                    {/* Date Range */}
                    {/*<Grid item xs={12} md={3}>*/}
                    {/*    <DatePicker*/}
                    {/*        label="From Date"*/}
                    {/*        value={fromDate}*/}
                    {/*        onChange={(newValue) => setFromDate(newValue)}*/}
                    {/*        renderInput={(params) => <TextField {...params} fullWidth />}*/}
                    {/*        inputFormat="dd/MM/yyyy"*/}
                    {/*    />*/}
                    {/*</Grid>*/}
                    {/*<Grid item xs={12} md={3}>*/}
                    {/*    <DatePicker*/}
                    {/*        label="To Date"*/}
                    {/*        value={toDate}*/}
                    {/*        onChange={(newValue) => setToDate(newValue)}*/}
                    {/*        renderInput={(params) => <TextField {...params} fullWidth />}*/}
                    {/*        inputFormat="dd/MM/yyyy"*/}
                    {/*    />*/}
                    {/*</Grid>*/}

                    {/* Export Button */}
                    <Grid item xs={12} md={viewType === 'single' ? 12 : 3}>
                        <Button
                            variant="contained"
                            startIcon={<DownloadIcon />}
                            onClick={handleExportExcel}
                            fullWidth
                            disabled={financialData.length === 0}
                        >
                            Export to Excel
                        </Button>
                    </Grid>

                    {/* Search (only for all patients view) */}
                    {/*{viewType === 'all' && (*/}
                    {/*    <Grid item xs={12} md={9}>*/}
                    {/*        <TextField*/}
                    {/*            fullWidth*/}
                    {/*            placeholder="Search by patient name..."*/}
                    {/*            value={searchTerm}*/}
                    {/*            onChange={(e) => setSearchTerm(e.target.value)}*/}
                    {/*            InputProps={{*/}
                    {/*                startAdornment: (*/}
                    {/*                    <InputAdornment position="start">*/}
                    {/*                        <SearchIcon />*/}
                    {/*                    </InputAdornment>*/}
                    {/*                ),*/}
                    {/*            }}*/}
                    {/*        />*/}
                    {/*    </Grid>*/}
                    {/*)}*/}
                </Grid>
            </Paper>

            {/* Data Display */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : financialData.length === 0 ? (
                <Paper sx={{ p: 8, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        No financial data found for the selected filters
                    </Typography>
                </Paper>
            ) : viewType === 'single' ? (
                <SinglePatientView data={financialData[0]} formatDate={formatDate} />
            ) : (
                <AllPatientsView
                    data={filteredFinancialData}
                    formatDate={formatDate}
                    expandedPatient={expandedPatient}
                    handleExpandClick={handleExpandClick}
                />
            )}
        </Box>
    );
};

// Single Patient View Component
const SinglePatientView = ({ data, formatDate }) => {
    if (!data) return null;

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                {data.patientName}
            </Typography>

            {Object.values(data.assessments).map((assessment, index) => (
                <Box key={assessment.assessmentId} sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                        Assessment #{index + 1}: {assessment.diagnosis}
                        <Chip
                                label={`Created: ${fireBaseDate(assessment?.createdAt)}`}
                            size="small"
                            sx={{ ml: 2 }}
                        />
                    </Typography>

                    <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#E3F2FD' }}>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>VAS</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Electrotherapy</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Movement Therapy</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Exercise Therapy</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Cash</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {assessment.sessions.map(session => (
                                    <TableRow key={session.id} hover>
                                        <TableCell>{formatDate(session.date)}</TableCell>
                                        <TableCell>{session.vas || '-'}</TableCell>
                                        <TableCell>{session.electrotherapy || '-'}</TableCell>
                                        <TableCell>{session.movementTherapy || '-'}</TableCell>
                                        <TableCell>{session.exerciseTherapy || '-'}</TableCell>
                                        <TableCell align="right">₹{session.cash || '0'}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow sx={{ bgcolor: '#F5F5F5' }}>
                                    <TableCell colSpan={5} align="right" sx={{ fontWeight: 'bold' }}>
                                        Assessment Subtotal:
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        ₹{assessment.subtotal.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            ))}

            <Divider sx={{ my: 3 }} />
            <Typography variant="h5" align="right" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Total: ₹{data.totalCash.toFixed(2)}
            </Typography>
        </Paper>
    );
};

// All Patients View Component
const AllPatientsView = ({ data, formatDate, expandedPatient, handleExpandClick }) => {
    const grandTotal = data.reduce((sum, p) => sum + p.totalCash, 0);

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow sx={{ bgcolor: '#E3F2FD' }}>
                        <TableCell sx={{ fontWeight: 'bold', width: '5%' }}></TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Patient Name</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="center">Assessments</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="center">Total Sessions</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="right">Total Cash</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="right">Avg/Session</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map(patient => (
                        <React.Fragment key={patient.patientId}>
                            <TableRow hover sx={{ cursor: 'pointer' }} onClick={() => handleExpandClick(patient.patientId)}>
                                <TableCell>
                                    <IconButton size="small">
                                        {expandedPatient === patient.patientId ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </IconButton>
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>{patient.patientName}</TableCell>
                                <TableCell align="center">{Object.keys(patient.assessments).length}</TableCell>
                                <TableCell align="center">{patient.totalSessions}</TableCell>
                                <TableCell align="right">₹{patient.totalCash.toFixed(2)}</TableCell>
                                <TableCell align="right">
                                    ₹{(patient.totalCash / patient.totalSessions).toFixed(2)}
                                </TableCell>
                            </TableRow>

                            {/* Expanded Details */}
                            <TableRow>
                                <TableCell colSpan={6} sx={{ py: 0, borderBottom: expandedPatient === patient.patientId ? 1 : 0 }}>
                                    <Collapse in={expandedPatient === patient.patientId} timeout="auto" unmountOnExit>
                                        <Box sx={{ p: 2, bgcolor: '#FAFAFA' }}>
                                            {Object.values(patient.assessments).map((assessment, index) => (
                                                <Box key={assessment.assessmentId} sx={{ mb: 2 }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                                        └─ Assessment #{index + 1}: {assessment.diagnosis} - {assessment.sessions.length} sessions - ₹{assessment.subtotal.toFixed(2)}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ ml: 3 }}>
                                                        Created: {formatDate(assessment.createdDate)}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Collapse>
                                </TableCell>
                            </TableRow>
                        </React.Fragment>
                    ))}

                    {/* Grand Total Row */}
                    <TableRow sx={{ bgcolor: '#E3F2FD' }}>
                        <TableCell colSpan={4} align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                            GRAND TOTAL:
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'primary.main' }}>
                            ₹{grandTotal.toFixed(2)}
                        </TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};
