// src/features/products/ProductsPage.jsx

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
    Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import WarningIcon from '@mui/icons-material/Warning';
import { apiRequest } from '../../common/api';
import { showToast } from '../../common/util';
import { AddEditProductDialog } from './AddEditProductDialog';
import { StockAdjustmentDialog } from './StockAdjustmentDialog';

const endpoint = process.env.REACT_APP_API_URL;

export const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openStockDialog, setOpenStockDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [lowStockOnly, setLowStockOnly] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [products, searchTerm, categoryFilter, statusFilter, lowStockOnly]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await apiRequest(`${endpoint}/products`, {
                method: 'GET',
                auth: true,
            });
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching products:', error);
            showToast('Failed to fetch products', 'error');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await apiRequest(`${endpoint}/products/categories`, {
                method: 'GET',
                auth: true,
            });
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const applyFilters = () => {
        let filtered = [...products];

        // Search filter
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(lowerSearch)
            );
        }

        // Category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(p => p.category === categoryFilter);
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(p => p.status === statusFilter);
        }

        // Low stock filter
        if (lowStockOnly) {
            filtered = filtered.filter(p => p.currentStock <= p.minimumStockLevel);
        }

        setFilteredProducts(filtered);
    };

    const handleAddProduct = () => {
        setSelectedProduct(null);
        setOpenDialog(true);
    };

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setOpenDialog(true);
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            await apiRequest(`${endpoint}/products/${productId}`, {
                method: 'DELETE',
                auth: true,
            });
            showToast('Product deleted successfully', 'success');
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            showToast('Failed to delete product', 'error');
        }
    };

    const handleStockAdjustment = (product) => {
        setSelectedProduct(product);
        setOpenStockDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setSelectedProduct(null);
    };

    const handleStockDialogClose = () => {
        setOpenStockDialog(false);
        setSelectedProduct(null);
    };

    const handleProductSaved = () => {
        fetchProducts();
        handleDialogClose();
    };

    const handleStockUpdated = () => {
        fetchProducts();
        handleStockDialogClose();
    };

    const getStockStatus = (product) => {
        if (product.currentStock === 0) {
            return { label: 'Out of Stock', color: 'error', icon: <WarningIcon /> };
        } else if (product.currentStock <= product.minimumStockLevel) {
            return { label: 'Low Stock', color: 'warning', icon: <WarningIcon /> };
        }
        return { label: 'In Stock', color: 'success' };
    };

    const lowStockCount = products.filter(p => p.currentStock <= p.minimumStockLevel).length;

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" gutterBottom>
                        <InventoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Products & Inventory
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage your clinic's product inventory
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddProduct}
                >
                    Add Product
                </Button>
            </Box>

            {/* Low Stock Alert */}
            {lowStockCount > 0 && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    <strong>{lowStockCount}</strong> product(s) are low on stock or out of stock!{' '}
                    <Button
                        size="small"
                        onClick={() => setLowStockOnly(!lowStockOnly)}
                        sx={{ ml: 1 }}
                    >
                        {lowStockOnly ? 'Show All' : 'View Low Stock Items'}
                    </Button>
                </Alert>
            )}

            {/* Filters */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        {/* Search */}
                        <TextField
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ flex: 1, minWidth: '250px' }}
                        />

                        {/* Category Filter */}
                        <FormControl sx={{ minWidth: 200 }}>
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

                        {/* Status Filter */}
                        <FormControl sx={{ minWidth: 150 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={statusFilter}
                                label="Status"
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <MenuItem value="all">All Status</MenuItem>
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="inactive">Inactive</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </CardContent>
            </Card>

            {/* Products Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Product Name</strong></TableCell>
                            <TableCell><strong>Category</strong></TableCell>
                            <TableCell align="right"><strong>Cost Price</strong></TableCell>
                            <TableCell align="right"><strong>Selling Price</strong></TableCell>
                            <TableCell align="right"><strong>Profit %</strong></TableCell>
                            <TableCell align="center"><strong>Stock</strong></TableCell>
                            <TableCell align="center"><strong>Status</strong></TableCell>
                            <TableCell align="center"><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    Loading products...
                                </TableCell>
                            </TableRow>
                        ) : filteredProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Typography variant="body2" color="text.secondary">
                                        No products found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredProducts.map((product) => {
                                const stockStatus = getStockStatus(product);
                                return (
                                    <TableRow key={product.id} hover>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="body1">{product.name}</Typography>
                                                {product.description && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        {product.description}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={product.category} size="small" variant="outlined" />
                                        </TableCell>
                                        <TableCell align="right">₹{product.costPrice.toFixed(2)}</TableCell>
                                        <TableCell align="right">₹{product.sellingPrice.toFixed(2)}</TableCell>
                                        <TableCell align="right">
                                            <Chip
                                                label={`${product.profitMargin}%`}
                                                size="small"
                                                color={product.profitMargin > 0 ? 'success' : 'error'}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                                <Chip
                                                    label={`${product.currentStock} ${product.unit}`}
                                                    size="small"
                                                    color={stockStatus.color}
                                                    icon={stockStatus.icon}
                                                />
                                                <Tooltip title="Adjust Stock">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleStockAdjustment(product)}
                                                    >
                                                        <InventoryIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                            {product.currentStock <= product.minimumStockLevel && (
                                                <Typography variant="caption" color="error">
                                                    Min: {product.minimumStockLevel}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={product.status}
                                                size="small"
                                                color={product.status === 'active' ? 'success' : 'default'}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Edit">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleEditProduct(product)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Summary */}
            <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Typography variant="body2" color="text.secondary">
                    Total Products: <strong>{filteredProducts.length}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Total Stock Value: <strong>₹{filteredProducts.reduce((sum, p) => sum + (p.currentStock * p.costPrice), 0).toFixed(2)}</strong>
                </Typography>
            </Box>

            {/* Add/Edit Product Dialog */}
            <AddEditProductDialog
                open={openDialog}
                onClose={handleDialogClose}
                onSaved={handleProductSaved}
                product={selectedProduct}
                categories={categories}
            />

            {/* Stock Adjustment Dialog */}
            <StockAdjustmentDialog
                open={openStockDialog}
                onClose={handleStockDialogClose}
                onSaved={handleStockUpdated}
                product={selectedProduct}
            />
        </Box>
    );
};
