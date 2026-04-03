// src/features/products/AddEditProductDialog.jsx

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
    Alert,
    InputAdornment,
} from '@mui/material';
import { apiRequest } from '../../common/api';
import { showToast } from '../../common/util';

const endpoint = process.env.REACT_APP_API_URL;

const UNITS = ['Pieces', 'Boxes', 'Pairs', 'Bottles', 'Tubes', 'Packets', 'Sets', 'Rolls'];

export const AddEditProductDialog = ({ open, onClose, onSaved, product, categories }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        costPrice: '',
        sellingPrice: '',
        currentStock: '',
        unit: 'Pieces',
        minimumStockLevel: '',
        supplierName: '',
        supplierContact: '',
        expiryDate: '',
        notes: '',
        status: 'active',
    });
    const [formErrors, setFormErrors] = useState({});
    const [profitMargin, setProfitMargin] = useState(0);
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        if (open && product) {
            // Editing existing product
            setFormData({
                name: product.name || '',
                description: product.description || '',
                category: product.category || '',
                costPrice: product.costPrice || '',
                sellingPrice: product.sellingPrice || '',
                currentStock: product.currentStock || '',
                unit: product.unit || 'Pieces',
                minimumStockLevel: product.minimumStockLevel || '',
                supplierName: product.supplierName || '',
                supplierContact: product.supplierContact || '',
                expiryDate: product.expiryDate || '',
                notes: product.notes || '',
                status: product.status || 'active',
            });
        } else if (open) {
            // New product - reset form
            setFormData({
                name: '',
                description: '',
                category: '',
                costPrice: '',
                sellingPrice: '',
                currentStock: '',
                unit: 'Pieces',
                minimumStockLevel: '',
                supplierName: '',
                supplierContact: '',
                expiryDate: '',
                notes: '',
                status: 'active',
            });
        }
        setFormErrors({});
        setProfitMargin(0);
        setShowWarning(false);
    }, [open, product]);

    useEffect(() => {
        // Calculate profit margin
        if (formData.costPrice && formData.sellingPrice) {
            const cost = parseFloat(formData.costPrice);
            const selling = parseFloat(formData.sellingPrice);
            if (cost > 0) {
                const margin = ((selling - cost) / cost * 100).toFixed(2);
                setProfitMargin(margin);
                setShowWarning(selling < cost);
            }
        } else {
            setProfitMargin(0);
            setShowWarning(false);
        }
    }, [formData.costPrice, formData.sellingPrice]);

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (formErrors[field]) {
            setFormErrors({ ...formErrors, [field]: '' });
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = 'Product name is required';
        if (!formData.category) errors.category = 'Category is required';
        if (!formData.costPrice || parseFloat(formData.costPrice) < 0) {
            errors.costPrice = 'Valid cost price is required';
        }
        if (!formData.sellingPrice || parseFloat(formData.sellingPrice) < 0) {
            errors.sellingPrice = 'Valid selling price is required';
        }
        if (!formData.currentStock || parseInt(formData.currentStock) < 0) {
            errors.currentStock = 'Valid stock quantity is required';
        }
        if (!formData.minimumStockLevel || parseInt(formData.minimumStockLevel) < 0) {
            errors.minimumStockLevel = 'Valid minimum stock level is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);

            const dataToSubmit = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                category: formData.category,
                costPrice: parseFloat(formData.costPrice),
                sellingPrice: parseFloat(formData.sellingPrice),
                currentStock: parseInt(formData.currentStock),
                unit: formData.unit,
                minimumStockLevel: parseInt(formData.minimumStockLevel),
                supplierName: formData.supplierName.trim(),
                supplierContact: formData.supplierContact.trim(),
                expiryDate: formData.expiryDate || null,
                notes: formData.notes.trim(),
                status: formData.status,
            };

            const url = product?.id
                ? `${endpoint}/products/${product.id}`
                : `${endpoint}/products`;

            const method = product?.id ? 'PUT' : 'POST';

            await apiRequest(url, {
                method: method,
                body: dataToSubmit,
                auth: true,
            });

            showToast(
                product?.id ? 'Product updated successfully' : 'Product added successfully',
                'success'
            );
            onSaved();
        } catch (error) {
            console.error('Error saving product:', error);
            showToast(error.message || 'Failed to save product', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {product?.id ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
            <DialogContent>
                <Grid spacing={3} sx={{ mt: 1 }}>
                    {/* Product Name */}
                    <Grid style={{padding: '3px'}} item xs={12} sm={8}>
                        <TextField
                            fullWidth
                            required
                            label="Product Name"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            error={!!formErrors.name}
                            helperText={formErrors.name}
                        />
                    </Grid>

                    {/* Category */}
                    <Grid style={{padding: '3px'}} item xs={12} sm={4}>
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

                    {/* Description */}
                    <Grid style={{padding: '3px'}}  item xs={12}>
                        <TextField
                            fullWidth
                            label="Description"
                            multiline
                            rows={2}
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Brief description of the product..."
                        />
                    </Grid>

                    {/* Pricing Section */}
                    <Grid style={{padding: '3px'}} item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                            Pricing Information
                        </Typography>
                    </Grid>

                    {/* Cost Price */}
                    <Grid style={{padding: '3px'}} item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            required
                            label="Cost Price"
                            type="number"
                            value={formData.costPrice}
                            onChange={(e) => handleChange('costPrice', e.target.value)}
                            error={!!formErrors.costPrice}
                            helperText={formErrors.costPrice}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                            }}
                        />
                    </Grid>

                    {/* Selling Price */}
                    <Grid style={{padding: '3px'}} item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            required
                            label="Selling Price"
                            type="number"
                            value={formData.sellingPrice}
                            onChange={(e) => handleChange('sellingPrice', e.target.value)}
                            error={!!formErrors.sellingPrice}
                            helperText={formErrors.sellingPrice}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                            }}
                        />
                    </Grid>

                    {/* Profit Margin */}
                    <Grid style={{padding: '3px'}} item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            label="Profit Margin"
                            value={`${profitMargin}%`}
                            InputProps={{
                                readOnly: true,
                            }}
                            sx={{
                                '& .MuiInputBase-input': {
                                    color: profitMargin < 0 ? 'error.main' : 'success.main',
                                    fontWeight: 'bold',
                                },
                            }}
                        />
                    </Grid>

                    {/* Warning if selling price < cost price */}
                    {showWarning && (
                        <Grid style={{padding: '3px'}} item xs={12}>
                            <Alert severity="warning">
                                Selling price is lower than cost price. You will incur a loss!
                            </Alert>
                        </Grid>
                    )}

                    {/* Inventory Section */}
                    <Grid style={{padding: '3px'}} item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                            Inventory Information
                        </Typography>
                    </Grid>

                    {/* Current Stock */}
                    <Grid style={{padding: '3px'}} item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            required
                            label="Current Stock"
                            type="number"
                            value={formData.currentStock}
                            onChange={(e) => handleChange('currentStock', e.target.value)}
                            error={!!formErrors.currentStock}
                            helperText={formErrors.currentStock}
                        />
                    </Grid>

                    {/* Unit */}
                    <Grid style={{padding: '3px'}} item xs={12} sm={4}>
                        <FormControl fullWidth required>
                            <InputLabel>Unit</InputLabel>
                            <Select
                                value={formData.unit}
                                label="Unit"
                                onChange={(e) => handleChange('unit', e.target.value)}
                            >
                                {UNITS.map((unit) => (
                                    <MenuItem key={unit} value={unit}>
                                        {unit}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Minimum Stock Level */}
                    <Grid style={{padding: '3px'}} item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            required
                            label="Minimum Stock Level"
                            type="number"
                            value={formData.minimumStockLevel}
                            onChange={(e) => handleChange('minimumStockLevel', e.target.value)}
                            error={!!formErrors.minimumStockLevel}
                            helperText={formErrors.minimumStockLevel || 'Alert when stock reaches this level'}
                        />
                    </Grid>

                    {/* Supplier Section */}
                    <Grid style={{padding: '3px'}} item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                            Supplier Information (Optional)
                        </Typography>
                    </Grid>

                    {/* Supplier Name */}
                    <Grid style={{padding: '3px'}} item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Supplier Name"
                            value={formData.supplierName}
                            onChange={(e) => handleChange('supplierName', e.target.value)}
                        />
                    </Grid>

                    {/* Supplier Contact */}
                    <Grid style={{padding: '3px'}} item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Supplier Contact"
                            value={formData.supplierContact}
                            onChange={(e) => handleChange('supplierContact', e.target.value)}
                        />
                    </Grid>

                    {/* Expiry Date */}
                    <Grid style={{padding: '3px'}} item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Expiry Date"
                            type="date"
                            value={formData.expiryDate}
                            onChange={(e) => handleChange('expiryDate', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    {/* Status */}
                    <Grid style={{padding: '3px'}} item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={formData.status}
                                label="Status"
                                onChange={(e) => handleChange('status', e.target.value)}
                            >
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="inactive">Inactive</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Notes */}
                    <Grid style={{padding: '3px'}} item xs={12}>
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
                    {loading ? 'Saving...' : product?.id ? 'Update' : 'Add Product'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
