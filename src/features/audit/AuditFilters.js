// src/features/audit/AuditFilters.js
import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Grid,
  TextField,
  Typography,
  Stack,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const AuditFilters = ({
  filters,
  onFiltersChange,
  onExport,
  exporting = false,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleInputChange = (field, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      userId: '',
      resourceType: '',
      action: '',
      startDate: '',
      endDate: '',
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const handleExport = () => {
    onExport(localFilters);
  };

  const hasActiveFilters = Object.values(localFilters).some(
    (value) => value && value.toString().trim() !== ''
  );

  return (
    <Card sx={{ p: 3, mb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Filters</Typography>
        {hasActiveFilters && (
          <Chip
            label={`Filters Active`}
            size="small"
            color="primary"
            variant="outlined"
          />
        )}
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* User ID Filter */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            size="small"
            label="User ID"
            placeholder="Filter by user"
            value={localFilters.userId || ''}
            onChange={(e) => handleInputChange('userId', e.target.value)}
            variant="outlined"
          />
        </Grid>

        {/* Resource Type Filter */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            size="small"
            label="Resource Type"
            placeholder="e.g., ROLE, USER"
            value={localFilters.resourceType || ''}
            onChange={(e) => handleInputChange('resourceType', e.target.value)}
            variant="outlined"
          />
        </Grid>

        {/* Action Filter */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            size="small"
            label="Action"
            placeholder="e.g., CREATE, UPDATE"
            value={localFilters.action || ''}
            onChange={(e) => handleInputChange('action', e.target.value)}
            variant="outlined"
          />
        </Grid>

        {/* Start Date Filter */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            size="small"
            label="Start Date"
            type="date"
            value={localFilters.startDate || ''}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        {/* End Date Filter */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            size="small"
            label="End Date"
            type="date"
            value={localFilters.endDate || ''}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        sx={{ mt: 3 }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<SearchIcon />}
          onClick={handleApplyFilters}
          sx={{ flex: { xs: 1, sm: 'auto' } }}
        >
          Apply Filters
        </Button>

        <Button
          variant="outlined"
          color="inherit"
          startIcon={<ClearIcon />}
          onClick={handleClearFilters}
          disabled={!hasActiveFilters}
          sx={{ flex: { xs: 1, sm: 'auto' } }}
        >
          Clear
        </Button>

        <Button
          variant="outlined"
          color="success"
          startIcon={<FileDownloadIcon />}
          onClick={handleExport}
          loading={exporting}
          disabled={exporting}
          sx={{ ml: { sm: 'auto' }, flex: { xs: 1, sm: 'auto' } }}
        >
          Export CSV
        </Button>
      </Stack>
    </Card>
  );
};

export default AuditFilters;
