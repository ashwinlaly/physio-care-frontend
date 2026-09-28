import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
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
  Paper,
} from '@mui/material';
import { apiRequest } from '../../common/api';
import { showToast } from '../../common/util';
import { usePermission } from '../../common/rbac';

const endpoint = process.env.REACT_APP_API_URL;

export const SalesPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [salesLoading, setSalesLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [filterProductId, setFilterProductId] = useState('');
  const [filterFromDate, setFilterFromDate] = useState('');
  const [filterToDate, setFilterToDate] = useState('');
  const [recentSales, setRecentSales] = useState([]);

  // Permission checks
  const canCreateSale = usePermission('sales.create');
  const canReadSale = usePermission('sales.read');

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId),
    [products, selectedProductId]
  );

  const lineTotal = useMemo(() => {
    if (!selectedProduct) {
      return 0;
    }
    return Number(selectedProduct.sellingPrice || 0) * Number(quantity || 0);
  }, [selectedProduct, quantity]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await apiRequest(`${endpoint}/products`, {
        method: 'GET',
        auth: true,
      });
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      showToast(error.message || 'Failed to fetch products', 'error');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSales();
  }, []);

  const fetchSales = async (overrides = {}) => {
    const productFilter = overrides.productId !== undefined ? overrides.productId : filterProductId;
    const fromFilter = overrides.from !== undefined ? overrides.from : filterFromDate;
    const toFilter = overrides.to !== undefined ? overrides.to : filterToDate;

    try {
      setSalesLoading(true);
      const params = new URLSearchParams();
      params.set('limit', '20');

      if (productFilter) {
        params.set('productId', productFilter);
      }

      if (fromFilter) {
        params.set('from', fromFilter);
      }

      if (toFilter) {
        params.set('to', toFilter);
      }

      const data = await apiRequest(`${endpoint}/sales?${params.toString()}`, {
        method: 'GET',
        auth: true,
      });
      setRecentSales(Array.isArray(data) ? data : []);
    } catch (error) {
      showToast(error.message || 'Failed to fetch sales', 'error');
      setRecentSales([]);
    } finally {
      setSalesLoading(false);
    }
  };

  const formatDateTime = (value) => {
    if (!value) {
      return '-';
    }

    if (typeof value === 'string') {
      const parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
    }

    if (value._seconds) {
      return new Date(value._seconds * 1000).toLocaleString();
    }

    return '-';
  };

  const handleApplyFilters = () => {
    fetchSales();
  };

  const handleClearFilters = () => {
    setFilterProductId('');
    setFilterFromDate('');
    setFilterToDate('');
    fetchSales({ productId: '', from: '', to: '' });
  };

  const handleSubmitSale = async (event) => {
    event.preventDefault();

    if (!canCreateSale) {
      showToast('You don\'t have permission to create sales', 'error');
      return;
    }

    if (!selectedProduct) {
      showToast('Please select a product', 'error');
      return;
    }

    const parsedQty = Number(quantity);
    if (!Number.isInteger(parsedQty) || parsedQty < 1) {
      showToast('Quantity must be a positive whole number', 'error');
      return;
    }

    if (parsedQty > Number(selectedProduct.currentStock || 0)) {
      showToast('Insufficient stock for this sale', 'error');
      return;
    }

    try {
      setSubmitting(true);
      await apiRequest(`${endpoint}/sales`, {
        method: 'POST',
        auth: true,
        body: {
          productId: selectedProduct.id,
          quantity: parsedQty,
        },
      });

      showToast('Sale saved and stock updated', 'success');
      setSelectedProductId('');
      setQuantity(1);
      await Promise.all([fetchProducts(), fetchSales()]);
    } catch (error) {
      showToast(error.message || 'Failed to save sale', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const sellableProducts = products.filter((p) => Number(p.currentStock || 0) > 0 && p.status === 'active');

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Sales
          </Typography>

          <Box component="form" onSubmit={handleSubmitSale} sx={{ mt: 2 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="stretch">
              <FormControl fullWidth>
                <InputLabel>Product</InputLabel>
                <Select
                  value={selectedProductId}
                  label="Product"
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  disabled={loading || submitting}
                >
                  {sellableProducts.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name} - Stock: {product.currentStock}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                type="number"
                label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                inputProps={{ min: 1 }}
                sx={{ minWidth: 140 }}
                disabled={submitting}
              />

              <TextField
                label="Line Total"
                value={`INR ${lineTotal.toFixed(2)}`}
                InputProps={{ readOnly: true }}
                sx={{ minWidth: 180 }}
              />

              <Button type="submit" variant="contained" disabled={loading || submitting || sellableProducts.length === 0 || !canCreateSale}>
                {submitting ? 'Saving...' : 'Save Sale'}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This simple flow updates product stock using the existing inventory endpoint.
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Sales
          </Typography>

          {!canReadSale && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              You don't have permission to view sales data
            </Typography>
          )}

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
            <FormControl fullWidth disabled={salesLoading || !canReadSale}>
              <InputLabel>Filter Product</InputLabel>
              <Select
                value={filterProductId}
                label="Filter Product"
                onChange={(e) => setFilterProductId(e.target.value)}
                disabled={salesLoading || !canReadSale}
              >
                <MenuItem value="">All Products</MenuItem>
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="From"
              type="date"
              value={filterFromDate}
              onChange={(e) => setFilterFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              disabled={salesLoading || !canReadSale}
            />

            <TextField
              label="To"
              type="date"
              value={filterToDate}
              onChange={(e) => setFilterToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              disabled={salesLoading || !canReadSale}
            />

            <Button variant="contained" onClick={handleApplyFilters} disabled={salesLoading || !canReadSale}>
              Apply
            </Button>
            <Button variant="outlined" onClick={handleClearFilters} disabled={salesLoading || !canReadSale}>
              Clear
            </Button>
          </Stack>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Qty</TableCell>
                  <TableCell align="right">Unit Price</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!canReadSale ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary">
                        Access Denied - You don't have permission to view sales
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : recentSales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary">
                        {salesLoading ? 'Loading sales...' : 'No sales found.'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  recentSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{formatDateTime(sale.createdAt)}</TableCell>
                      <TableCell>{sale.productName || '-'}</TableCell>
                      <TableCell align="right">{sale.quantity}</TableCell>
                      <TableCell align="right">INR {Number(sale.unitPrice || 0).toFixed(2)}</TableCell>
                      <TableCell align="right">INR {Number(sale.totalAmount || 0).toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

