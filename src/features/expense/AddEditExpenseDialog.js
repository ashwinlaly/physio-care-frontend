// src/features/expenses/AddEditExpenseDialog.jsx

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Typography,
    InputAdornment,
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import { apiRequest } from '../../common/api';
import { showToast } from '../../common/util';
import { format } from 'date-fns';

const endpoint = process.env.REACT_APP_API_URL;

export const AddEditExpenseDialog = ({ open, onClose, onSaved, expense, categories, paymentMethods }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        description: '',
        category: '',
        amount: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        paymentMethod: '',
        vendorName: '',
        invoiceNumber: '',
        notes: '',
        status: 'paid',
        recurring: false,
        nextDueDate: '',
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (open && expense) {
            // Editing existing expense
            setFormData({
                description: expense.description || '',
                category: expense.category || '',
                amount: expense.amount || '',
                date: expense.date || format(new Date(), 'yyyy-MM-dd'),
                paymentMethod: expense.paymentMethod || '',
                vendorName: expense.vendorName || '',
                invoiceNumber: expense.invoiceNumber || '',
                notes: expense.notes || '',
                status: expense.status || 'paid',
                recurring: expense.recurring || false,
                nextDueDate: expense.nextDueDate || '',
            });
        } else if (open) {
            // New expense - reset form
            setFormData({
                description: '',
                category: '',
                amount: '',
                date: format(new Date(), 'yyyy-MM-dd'),
                paymentMethod: '',
                vendorName: '',
                invoiceNumber: '',
                notes: '',
                status: 'paid',
                recurring: false,
                nextDueDate: '',
            });
        }
        setFormErrors({});
    }, [open, expense]);

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (formErrors[field]) {
            setFormErrors({ ...formErrors, [field]: '' });
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.description.trim()) errors.description = 'Description is required';
        if (!formData.category) errors.category = 'Category is required';
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            errors.amount = 'Valid amount is required';
        }
        if (!formData.date) errors.date = 'Date is required';
        if (!formData.paymentMethod) errors.paymentMethod = 'Payment method is required';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);

            const dataToSubmit = {
                description: formData.description.trim(),
                category: formData.category,
                amount: parseFloat(formData.amount),
                date: formData.date,
                paymentMethod: formData.paymentMethod,
                vendorName: formData.vendorName.trim(),
                invoiceNumber: formData.invoiceNumber.trim(),
                notes: formData.notes.trim(),
                status: formData.status,
                recurring: formData.recurring,
                nextDueDate: formData.recurring ? formData.nextDueDate : null,
            };

            const url = expense?.id
                ? `${endpoint}/expenses/${expense.id}`
                : `${endpoint}/expenses`;

            const method = expense?.id ? 'PUT' : 'POST';

            await apiRequest(url, {
                method: method,
                body: dataToSubmit,
                auth: true,
            });

            showToast(
                expense?.id ? 'Expense updated successfully' : 'Expense added successfully',
                'success'
            );
            onSaved();
        } catch (error) {
            console.error('Error saving expense:', error);
            showToast(error.message || 'Failed to save expense', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {expense?.id ? 'Edit Expense' : 'Add New Expense'}
            </DialogTitle>
            <DialogContent>
                <Grid spacing={3} sx={{ mt: 0.5 }}>
                    {/* Description */}
                    <Grid style={{padding: '10px'}} item xs={12}>
                        <TextField
                            fullWidth
                            required
                            label="Description"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            error={!!formErrors.description}
                            helperText={formErrors.description}
                            placeholder="e.g., Monthly electricity bill, Office supplies purchase..."
                        />
                    </Grid>

                    {/* Category */}
                    <Grid style={{padding: '10px'}}  item xs={12} sm={6}>
                        <FormControl fullWidth required error={!!formErrors.category}>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={formData.category}
                                label="Category"
                                onChange={(e) => handleChange('category', e.target.value)}
                            >
                                {categories.map((cat) => (
                                    <MenuItem key={cat} value={cat}>
                                        {cat}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Amount */}
                    <Grid style={{padding: '10px'}} item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            label="Amount"
                            type="number"
                            value={formData.amount}
                            onChange={(e) => handleChange('amount', e.target.value)}
                            error={!!formErrors.amount}
                            helperText={formErrors.amount}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                            }}
                        />
                    </Grid>

                    {/* Date */}
                    <Grid style={{padding: '10px'}} item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            required
                            label="Date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => handleChange('date', e.target.value)}
                            error={!!formErrors.date}
                            helperText={formErrors.date}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    {/* Payment Method */}
                    <Grid style={{padding: '10px'}} item xs={12} sm={6}>
                        <FormControl fullWidth required error={!!formErrors.paymentMethod}>
                            <InputLabel>Payment Method</InputLabel>
                            <Select
                                value={formData.paymentMethod}
                                label="Payment Method"
                                onChange={(e) => handleChange('paymentMethod', e.target.value)}
                            >
                                {paymentMethods.map((method) => (
                                    <MenuItem key={method} value={method}>
                                        {method}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Status */}
                    <Grid style={{padding: '10px'}} item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={formData.status}
                                label="Status"
                                onChange={(e) => handleChange('status', e.target.value)}
                            >
                                <MenuItem value="paid">Paid</MenuItem>
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="reimbursed">Reimbursed</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Vendor Information */}
                    <Grid style={{padding: '10px'}} item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                            Vendor Information (Optional)
                        </Typography>
                    </Grid>

                    {/* Vendor Name */}
                    <Grid style={{padding: '10px'}} item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Vendor/Supplier Name"
                            value={formData.vendorName}
                            onChange={(e) => handleChange('vendorName', e.target.value)}
                        />
                    </Grid>

                    {/* Invoice Number */}
                    <Grid style={{padding: '10px'}} item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Invoice/Receipt Number"
                            value={formData.invoiceNumber}
                            onChange={(e) => handleChange('invoiceNumber', e.target.value)}
                        />
                    </Grid>

                    {/* Recurring */}
                    <Grid style={{padding: '10px'}} item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                            Recurring Expense
                        </Typography>
                    </Grid>

                    <Grid style={{padding: '10px'}} item xs={12} sm={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={formData.recurring}
                                    onChange={(e) => handleChange('recurring', e.target.checked)}
                                />
                            }
                            label="This is a recurring expense"
                        />
                    </Grid>

                    {/* Next Due Date (only if recurring) */}
                    {formData.recurring && (
                        <Grid style={{padding: '10px'}}  item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Next Due Date"
                                type="date"
                                value={formData.nextDueDate}
                                onChange={(e) => handleChange('nextDueDate', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                helperText="When is the next payment due?"
                            />
                        </Grid>
                    )}

                    {/* Notes */}
                    <Grid style={{padding: '10px'}}  item xs={12}>
                        <TextField
                            fullWidth
                            label="Notes"
                            multiline
                            rows={3}
                            value={formData.notes}
                            onChange={(e) => handleChange('notes', e.target.value)}
                            placeholder="Any additional information..."
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                    {loading ? 'Saving...' : expense?.id ? 'Update' : 'Add Expense'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
