// src/features/audit/AuditLogsPage.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Stack,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  getAuditLogs,
  getAuditStats,
  exportAuditLogsCSV,
} from '../../common/auditApi';
import { showToast } from '../../common/util';
import AuditFilters from './AuditFilters';
import AuditLogsTable from './AuditLogsTable';

const AuditLogsPage = () => {
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    userId: '',
    resourceType: '',
    action: '',
    startDate: '',
    endDate: '',
  });
  const [pagination, setPagination] = useState({
    limit: 100,
    offset: 0,
    total: 0,
  });

  // Load audit logs on component mount and when filters/pagination change
  useEffect(() => {
    loadAuditLogs();
    loadAuditStats();
  }, [filters, pagination.offset, pagination.limit]);

  const loadAuditLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAuditLogs({
        ...filters,
        limit: pagination.limit,
        offset: pagination.offset,
      });

      setLogs(result.logs || []);
      setPagination((prev) => ({
        ...prev,
        total: result.total || 0,
      }));
    } catch (err) {
      setError(err.message || 'Failed to load audit logs');
      showToast(err.message || 'Failed to load audit logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadAuditStats = async () => {
    try {
      const result = await getAuditStats();
      setStats(result);
    } catch (err) {
      console.error('Failed to load audit stats:', err);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // Reset pagination to first page when filters change
    setPagination((prev) => ({
      ...prev,
      offset: 0,
    }));
  };

  const handlePaginationChange = ({ offset, limit }) => {
    setPagination((prev) => ({
      ...prev,
      offset,
      limit,
    }));
  };

  const handleExport = async (exportFilters) => {
    setExporting(true);
    try {
      const blob = await exportAuditLogsCSV(exportFilters);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showToast('Audit logs exported successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to export audit logs', 'error');
    } finally {
      setExporting(false);
    }
  };

  const handleRefresh = () => {
    loadAuditLogs();
    loadAuditStats();
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            Audit Logs
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Track all system changes and user actions for compliance and security
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* Stats Cards */}
      {stats && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2,
            mb: 3,
          }}
        >
          <StatCard
            title="Total Logs"
            value={stats.totalLogs || 0}
            subtitle="All time"
          />
          <StatCard
            title="Today's Activity"
            value={stats.todayLogs || 0}
            subtitle="Last 24 hours"
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers || 0}
            subtitle="This month"
          />
          <StatCard
            title="Resource Types"
            value={stats.resourceTypes || 0}
            subtitle="Tracked"
          />
        </Box>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <AuditFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onExport={handleExport}
        exporting={exporting}
      />

      {/* Results Info */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle2" color="textSecondary">
          Showing {logs.length} of {pagination.total} records
        </Typography>
      </Box>

      {/* Logs Table */}
      <AuditLogsTable
        logs={logs}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePaginationChange}
      />
    </Container>
  );
};

// Stat Card Component
const StatCard = ({ title, value, subtitle }) => (
  <Box
    sx={{
      p: 2,
      border: '1px solid #e0e0e0',
      borderRadius: 1,
      backgroundColor: '#fff',
      textAlign: 'center',
    }}
  >
    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
      {title}
    </Typography>
    <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
      {typeof value === 'number' ? value.toLocaleString() : value}
    </Typography>
    <Typography variant="caption" color="textSecondary">
      {subtitle}
    </Typography>
  </Box>
);

export default AuditLogsPage;
