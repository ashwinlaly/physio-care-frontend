// src/features/products/StockAdjustmentDialog.jsx

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    ToggleButtonGroup,
    ToggleButton,
    Alert,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { apiRequest } from '../../common/api';
import { showToast } from '../../common/util';

const endpoint = process.env.REACT_APP_API_URL;

export const StockAdjustmentDialog = ({ open, onClose, onSaved, product }) => {
    const [operation, setOperation] = useState('add');
    const [quantity, setQuantity] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open) {
            setOperation('add');
            setQuantity('');
            setError('');
        }
    }, [open]);

    const handleSubmit = async () => {
        if (!quantity || parseInt(quantity) <= 0) {
            setError('Please enter a valid quantity');
            return;
        }

        if (operation === 'subtract' && parseInt(quantity) > product.currentStock) {
            setError('Cannot subtract more than current stock');
            return;
        }

        try {
            setLoading(true);

            await apiRequest(`${endpoint}/products/${product.id}/stock`, {
                method: 'PATCH',
                body: {
                    quantity: parseInt(quantity),
                    operation: operation,
                },
                auth: true,
            });

            showToast(
                `Stock ${operation === 'add' ? 'added' : 'removed'} successfully`,
                'success'
            );
            onSaved();
        } catch (error) {
            console.error('Error updating stock:', error);
            showToast(error.message || 'Failed to update stock', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!product) return null;

    const newStock = operation === 'add'
        ? product.currentStock + parseInt(quantity || 0)
        : product.currentStock - parseInt(quantity || 0);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Adjust Stock - {product.name}</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Current Stock: <strong>{product.currentStock} {product.unit}</strong>
                    </Typography>

                    {/* Operation Toggle */}
                    <Box sx={{ mt: 3, mb: 3 }}>
                        <ToggleButtonGroup
                            value={operation}
                            exclusive
                            onChange={(e, newOperation) => {
                                if (newOperation) {
                                    setOperation(newOperation);
                                    setError('');
                                }
                            }}
                            fullWidth
                        >
                            <ToggleButton value="add" color="success">
                                <AddCircleIcon sx={{ mr: 1 }} />
                                Add Stock
                            </ToggleButton>
                            <ToggleButton value="subtract" color="error">
                                <RemoveCircleIcon sx={{ mr: 1 }} />
                                Remove Stock
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    {/* Quantity Input */}
                    <TextField
                        fullWidth
                        label="Quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                            setQuantity(e.target.value);
                            setError('');
                        }}
                        error={!!error}
                        helperText={error}
                        inputProps={{ min: 1 }}
                    />

                    {/* Preview */}
                    {quantity && parseInt(quantity) > 0 && (
                        <Alert
                            severity={newStock < 0 ? 'error' : newStock <= product.minimumStockLevel ? 'warning' : 'info'}
                            sx={{ mt: 2 }}
                        >
                            New Stock: <strong>{newStock} {product.unit}</strong>
                            {newStock < 0 && ' - Invalid! Cannot have negative stock'}
                            {newStock >= 0 && newStock <= product.minimumStockLevel && ' - Stock will be low!'}
                        </Alert>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading || !quantity || parseInt(quantity) <= 0}
                    color={operation === 'add' ? 'success' : 'error'}
                >
                    {loading ? 'Updating...' : operation === 'add' ? 'Add Stock' : 'Remove Stock'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
