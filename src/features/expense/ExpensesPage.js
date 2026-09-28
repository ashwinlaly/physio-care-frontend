// src/features/expenses/ExpensesPage.jsx

import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    InputAdornment,
    Tooltip,
    Grid,
    Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import LockIcon from '@mui/icons-material/Lock';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { apiRequest } from '../../common/api';
import { showToast } from '../../common/util';
import { usePermission } from '../../common/rbac';
import { AddEditExpenseDialog } from './AddEditExpenseDialog';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const endpoint = process.env.REACT_APP_API_URL;

const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
    '#82CA9D', '#FFC658', '#FF6B9D', '#C4C4C4', '#8DD1E1',
    '#A4DE6C', '#D0ED57', '#FFA07A', '#9370DB', '#20B2AA'
];

export const ExpensesPage = () => {
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [summary, setSummary] = useState({
        totalExpenses: 0,
        paidExpenses: 0,
        pendingExpenses: 0,
        expenseCount: 0,
    });
    const [categoryChartData, setCategoryChartData] = useState([]);
    const [monthlyChartData, setMonthlyChartData] = useState([]);

    // Permission checks
    const canCreateExpense = usePermission('expenses.create');
    const canUpdateExpense = usePermission('expenses.update');
    const canDeleteExpense = usePermission('expenses.delete');

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        fetchExpenses();
        fetchCategories();
        fetchPaymentMethods();
        fetchSummary();
    }, []);

    useEffect(() => {
        applyFilters();
        calculateSummary();
        prepareChartData();
    }, [expenses, searchTerm, categoryFilter, statusFilter, paymentMethodFilter, startDate, endDate]);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const data = await apiRequest(`${endpoint}/expenses`, {
                method: 'GET',
                auth: true,
            });
            setExpenses(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching expenses:', error);
            showToast('Failed to fetch expenses', 'error');
            setExpenses([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await apiRequest(`${endpoint}/expenses/categories`, {
                method: 'GET',
                auth: true,
            });
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchPaymentMethods = async () => {
        try {
            const data = await apiRequest(`${endpoint}/expenses/payment-methods`, {
                method: 'GET',
                auth: true,
            });
            setPaymentMethods(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching payment methods:', error);
        }
    };

    const fetchSummary = async () => {
        try {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;

            const data = await apiRequest(
                `${endpoint}/expenses/summary?year=${year}&month=${month}`,
                {
                    method: 'GET',
                    auth: true,
                }
            );
            setSummary(data);
        } catch (error) {
            console.error('Error fetching summary:', error);
        }
    };

    const applyFilters = () => {
        let filtered = [...expenses];

        // Search filter
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (e) =>
                    e.description.toLowerCase().includes(lowerSearch) ||
                    (e.vendorName && e.vendorName.toLowerCase().includes(lowerSearch))
            );
        }

        // Category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter((e) => e.category === categoryFilter);
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter((e) => e.status === statusFilter);
        }

        // Payment method filter
        if (paymentMethodFilter !== 'all') {
            filtered = filtered.filter((e) => e.paymentMethod === paymentMethodFilter);
        }

        // Date range filter
        if (startDate) {
            filtered = filtered.filter((e) => e.date >= startDate);
        }
        if (endDate) {
            filtered = filtered.filter((e) => e.date <= endDate);
        }

        setFilteredExpenses(filtered);
    };

    const calculateSummary = () => {
        const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
        const paid = filteredExpenses
            .filter((e) => e.status === 'paid')
            .reduce((sum, e) => sum + e.amount, 0);
        const pending = filteredExpenses
            .filter((e) => e.status === 'pending')
            .reduce((sum, e) => sum + e.amount, 0);

        setSummary({
            totalExpenses: total,
            paidExpenses: paid,
            pendingExpenses: pending,
            expenseCount: filteredExpenses.length,
        });
    };

    const prepareChartData = () => {
        // Category breakdown
        const categoryTotals = {};
        filteredExpenses.forEach(expense => {
            if (!categoryTotals[expense.category]) {
                categoryTotals[expense.category] = 0;
            }
            categoryTotals[expense.category] += expense.amount;
        });

        const categoryData = Object.keys(categoryTotals).map(category => ({
            name: category,
            value: categoryTotals[category],
        })).sort((a, b) => b.value - a.value);

        setCategoryChartData(categoryData);

        // Monthly breakdown (last 6 months)
        const monthlyTotals = {};
        filteredExpenses.forEach(expense => {
            const monthYear = format(new Date(expense.date), 'MMM yyyy');
            if (!monthlyTotals[monthYear]) {
                monthlyTotals[monthYear] = 0;
            }
            monthlyTotals[monthYear] += expense.amount;
        });

        const monthlyData = Object.keys(monthlyTotals).map(month => ({
            month: month,
            amount: monthlyTotals[month],
        }));

        setMonthlyChartData(monthlyData);
    };

    const exportToExcel = () => {
        try {
            // Prepare data for export
            const exportData = filteredExpenses.map(expense => ({
                'Date': formatDate(expense.date),
                'Description': expense.description,
                'Category': expense.category,
                'Vendor': expense.vendorName || '-',
                'Amount': expense.amount,
                'Payment Method': expense.paymentMethod,
                'Status': expense.status,
                'Invoice Number': expense.invoiceNumber || '-',
                'Recurring': expense.recurring ? 'Yes' : 'No',
                'Notes': expense.notes || '-',
            }));

            // Add summary row
            exportData.push({});
            exportData.push({
                'Date': 'SUMMARY',
                'Description': '',
                'Category': '',
                'Vendor': '',
                'Amount': '',
                'Payment Method': '',
                'Status': '',
                'Invoice Number': '',
                'Recurring': '',
                'Notes': '',
            });
            exportData.push({
                'Date': 'Total Expenses',
                'Description': '',
                'Category': '',
                'Vendor': '',
                'Amount': summary.totalExpenses,
                'Payment Method': '',
                'Status': '',
                'Invoice Number': '',
                'Recurring': '',
                'Notes': '',
            });
            exportData.push({
                'Date': 'Paid',
                'Description': '',
                'Category': '',
                'Vendor': '',
                'Amount': summary.paidExpenses,
                'Payment Method': '',
                'Status': '',
                'Invoice Number': '',
                'Recurring': '',
                'Notes': '',
            });
            exportData.push({
                'Date': 'Pending',
                'Description': '',
                'Category': '',
                'Vendor': '',
                'Amount': summary.pendingExpenses,
                'Payment Method': '',
                'Status': '',
                'Invoice Number': '',
                'Recurring': '',
                'Notes': '',
            });

            // Create workbook and worksheet
            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Expenses');

            // Generate Excel file
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            // Download file
            const fileName = `Expenses_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
            saveAs(blob, fileName);

            showToast('Expenses exported successfully', 'success');
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            showToast('Failed to export expenses', 'error');
        }
    };

    const handleAddExpense = () => {
        if (!canCreateExpense) {
            showToast('You don\'t have permission to create expenses', 'error');
            return;
        }
        setSelectedExpense(null);
        setOpenDialog(true);
    };

    const handleEditExpense = (expense) => {
        if (!canUpdateExpense) {
            showToast('You don\'t have permission to edit expenses', 'error');
            return;
        }
        setSelectedExpense(expense);
        setOpenDialog(true);
    };

    const handleDeleteExpense = async (expenseId) => {
        if (!canDeleteExpense) {
            showToast('You don\'t have permission to delete expenses', 'error');
            return;
        }
        if (!window.confirm('Are you sure you want to delete this expense?')) {
            return;
        }

        try {
            await apiRequest(`${endpoint}/expenses/${expenseId}`, {
                method: 'DELETE',
                auth: true,
            });
            showToast('Expense deleted successfully', 'success');
            fetchExpenses();
            fetchSummary();
        } catch (error) {
            console.error('Error deleting expense:', error);
            showToast('Failed to delete expense', 'error');
        }
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setSelectedExpense(null);
    };

    const handleExpenseSaved = () => {
        fetchExpenses();
        fetchSummary();
        handleDialogClose();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid':
                return 'success';
            case 'pending':
                return 'warning';
            case 'reimbursed':
                return 'info';
            default:
                return 'default';
        }
    };

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'dd MMM yyyy');
        } catch {
            return dateString;
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setCategoryFilter('all');
        setStatusFilter('all');
        setPaymentMethodFilter('all');
        setStartDate('');
        setEndDate('');
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" gutterBottom>
                        <ReceiptIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Expenses Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Track and manage clinic expenses
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={exportToExcel}
                        disabled={filteredExpenses.length === 0}
                    >
                        Export to Excel
                    </Button>
                    {canCreateExpense ? (
                        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddExpense}>
                            Add Expense
                        </Button>
                    ) : (
                        <Button variant="contained" disabled startIcon={<LockIcon />} title="You don't have permission to create expenses">
                            Add Expense (Restricted)
                        </Button>
                    )}
                </Box>
            </Box>

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="text.secondary" variant="body2">
                                        Total Expenses
                                    </Typography>
                                    <Typography variant="h5" sx={{ mt: 1 }}>
                                        ₹{summary.totalExpenses.toFixed(2)}
                                    </Typography>
                                </Box>
                                <TrendingUpIcon color="primary" sx={{ fontSize: 40 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="text.secondary" variant="body2">
                                        Paid
                                    </Typography>
                                    <Typography variant="h5" sx={{ mt: 1, color: 'success.main' }}>
                                        ₹{summary.paidExpenses.toFixed(2)}
                                    </Typography>
                                </Box>
                                <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="text.secondary" variant="body2">
                                        Pending
                                    </Typography>
                                    <Typography variant="h5" sx={{ mt: 1, color: 'warning.main' }}>
                                        ₹{summary.pendingExpenses.toFixed(2)}
                                    </Typography>
                                </Box>
                                <PendingIcon color="warning" sx={{ fontSize: 40 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="text.secondary" variant="body2">
                                        Total Count
                                    </Typography>
                                    <Typography variant="h5" sx={{ mt: 1 }}>
                                        {summary.expenseCount}
                                    </Typography>
                                </Box>
                                <ReceiptIcon color="action" sx={{ fontSize: 40 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Charts */}
            {filteredExpenses.length > 0 && (
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    {/* Category Breakdown Pie Chart */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Expense by Category
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={categoryChartData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {categoryChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip
                                            formatter={(value) => `₹${value.toFixed(2)}`}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Monthly Trend Bar Chart */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Monthly Expenses Trend
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={monthlyChartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <RechartsTooltip
                                            formatter={(value) => `₹${value.toFixed(2)}`}
                                        />
                                        <Bar dataKey="amount" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Top 5 Categories Table */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Top 5 Expense Categories
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell><strong>Category</strong></TableCell>
                                                <TableCell align="right"><strong>Amount</strong></TableCell>
                                                <TableCell align="right"><strong>% of Total</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {categoryChartData.slice(0, 5).map((cat, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Box
                                                                sx={{
                                                                    width: 16,
                                                                    height: 16,
                                                                    backgroundColor: COLORS[index % COLORS.length],
                                                                    borderRadius: 1,
                                                                    mr: 1,
                                                                }}
                                                            />
                                                            {cat.name}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">₹{cat.value.toFixed(2)}</TableCell>
                                                    <TableCell align="right">
                                                        {((cat.value / summary.totalExpenses) * 100).toFixed(1)}%
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Filters */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2}>
                        {/* Search */}
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                placeholder="Search expenses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        {/* Category Filter */}
                        <Grid item xs={12} sm={6} md={2}>
                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={categoryFilter}
                                    label="Category"
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                >
                                    <MenuItem value="all">All Categories</MenuItem>
                                    {categories.map((cat) => (
                                        <MenuItem key={cat} value={cat}>
                                            {cat}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Status Filter */}
                        <Grid item xs={12} sm={6} md={2}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={statusFilter}
                                    label="Status"
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <MenuItem value="all">All Status</MenuItem>
                                    <MenuItem value="paid">Paid</MenuItem>
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="reimbursed">Reimbursed</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Payment Method Filter */}
                        <Grid item xs={12} sm={6} md={2}>
                            <FormControl fullWidth>
                                <InputLabel>Payment Method</InputLabel>
                                <Select
                                    value={paymentMethodFilter}
                                    label="Payment Method"
                                    onChange={(e) => setPaymentMethodFilter(e.target.value)}
                                >
                                    <MenuItem value="all">All Methods</MenuItem>
                                    {paymentMethods.map((method) => (
                                        <MenuItem key={method} value={method}>
                                            {method}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Start Date */}
                        <Grid item xs={12} sm={6} md={2}>
                            <TextField
                                fullWidth
                                label="Start Date"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        {/* End Date */}
                        <Grid item xs={12} sm={6} md={2}>
                            <TextField
                                fullWidth
                                label="End Date"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        {/* Clear Filters */}
                        <Grid item xs={12} md={2}>
                            <Button fullWidth variant="outlined" onClick={clearFilters}>
                                Clear Filters
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Expenses Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Date</strong></TableCell>
                            <TableCell><strong>Description</strong></TableCell>
                            <TableCell><strong>Category</strong></TableCell>
                            <TableCell><strong>Vendor</strong></TableCell>
                            <TableCell align="right"><strong>Amount</strong></TableCell>
                            <TableCell><strong>Payment Method</strong></TableCell>
                            <TableCell align="center"><strong>Status</strong></TableCell>
                            <TableCell align="center"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    Loading expenses...
                                </TableCell>
                            </TableRow>
                        ) : filteredExpenses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Typography variant="body2" color="text.secondary">
                                        No expenses found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredExpenses.map((expense) => (
                                <TableRow key={expense.id} hover>
                                    <TableCell>{formatDate(expense.date)}</TableCell>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="body2">{expense.description}</Typography>
                                            {expense.invoiceNumber && (
                                                <Typography variant="caption" color="text.secondary">
                                                    Invoice: {expense.invoiceNumber}
                                                </Typography>
                                            )}
                                            {expense.recurring && (
                                                <Chip
                                                    label="Recurring"
                                                    size="small"
                                                    color="info"
                                                    sx={{ ml: 1 }}
                                                />
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={expense.category} size="small" variant="outlined" />
                                    </TableCell>
                                    <TableCell>
                                        {expense.vendorName || '-'}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" fontWeight="bold">
                                            ₹{expense.amount.toFixed(2)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={expense.paymentMethod} size="small" />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={expense.status}
                                            size="small"
                                            color={getStatusColor(expense.status)}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={!canUpdateExpense ? 'You don\'t have permission to edit expenses' : 'Edit'}>
                                            <span>
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleEditExpense(expense)}
                                                    disabled={!canUpdateExpense}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                        <Tooltip title={!canDeleteExpense ? 'You don\'t have permission to delete expenses' : 'Delete'}>
                                            <span>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDeleteExpense(expense.id)}
                                                    disabled={!canDeleteExpense}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </span>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Summary */}
            <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Typography variant="body2" color="text.secondary">
                    Showing: <strong>{filteredExpenses.length}</strong> expenses
                </Typography>
            </Box>

            {/* Add/Edit Expense Dialog */}
            <AddEditExpenseDialog
                open={openDialog}
                onClose={handleDialogClose}
                onSaved={handleExpenseSaved}
                expense={selectedExpense}
                categories={categories}
                paymentMethods={paymentMethods}
            />
        </Box>
    );
};
