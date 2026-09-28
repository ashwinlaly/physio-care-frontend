// src/features/audit/AuditLogsTable.js
import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Chip,
  Typography,
  Collapse,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const AuditLogsTable = ({
  logs = [],
  loading = false,
  pagination = { limit: 100, offset: 0, total: 0 },
  onPageChange,
}) => {
  const [expandedRows, setExpandedRows] = React.useState(new Set());

  const handleExpandRow = (logId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedRows(newExpanded);
  };

  const getActionColor = (action) => {
    if (action.includes('CREATE')) return 'success';
    if (action.includes('UPDATE')) return 'info';
    if (action.includes('DELETE')) return 'error';
    if (action.includes('ASSIGN')) return 'warning';
    if (action.includes('REMOVE')) return 'warning';
    return 'default';
  };

  const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleString();
  };

  const formatJSON = (obj) => {
    return JSON.stringify(obj, null, 2);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="textSecondary">
          No audit logs found. Try adjusting your filters.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell width="5%"></TableCell>
              <TableCell width="15%">Timestamp</TableCell>
              <TableCell width="12%">User</TableCell>
              <TableCell width="12%">Action</TableCell>
              <TableCell width="15%">Resource Type</TableCell>
              <TableCell width="18%">Resource</TableCell>
              <TableCell width="13%">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <React.Fragment key={log.id}>
                <TableRow hover>
                  <TableCell width="5%">
                    <IconButton
                      size="small"
                      onClick={() => handleExpandRow(log.id)}
                    >
                      {expandedRows.has(log.id) ? (
                        <ExpandLessIcon fontSize="small" />
                      ) : (
                        <ExpandMoreIcon fontSize="small" />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell width="15%">{formatDate(log.timestamp)}</TableCell>
                  <TableCell width="12%">
                    <Typography variant="body2">{log.userId || '-'}</Typography>
                  </TableCell>
                  <TableCell width="12%">
                    <Chip
                      label={log.action}
                      size="small"
                      color={getActionColor(log.action)}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell width="15%">
                    <Typography variant="body2">{log.resourceType}</Typography>
                  </TableCell>
                  <TableCell width="18%">
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={log.resourceName}
                    >
                      {log.resourceName || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell width="13%">
                    <Chip
                      label={log.status || 'SUCCESS'}
                      size="small"
                      color={log.status === 'SUCCESS' ? 'success' : 'error'}
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>

                {/* Expanded Row - Details */}
                <TableRow>
                  <TableCell colSpan={7} sx={{ p: 0 }}>
                    <Collapse
                      in={expandedRows.has(log.id)}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box sx={{ p: 2, backgroundColor: '#fafafa' }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          Description
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {log.description}
                        </Typography>

                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          Metadata
                        </Typography>
                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: 2,
                            mb: 2,
                          }}
                        >
                          <Box>
                            <Typography variant="caption" color="textSecondary">
                              Resource ID
                            </Typography>
                            <Typography variant="body2">{log.resourceId}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="textSecondary">
                              Organization ID
                            </Typography>
                            <Typography variant="body2">{log.organizationId}</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="textSecondary">
                              IP Address
                            </Typography>
                            <Typography variant="body2">{log.ipAddress || '-'}</Typography>
                          </Box>
                        </Box>

                        {log.changes && (
                          <>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                              Changes
                            </Typography>
                            <Box
                              sx={{
                                backgroundColor: '#fff',
                                border: '1px solid #ddd',
                                borderRadius: 1,
                                p: 1.5,
                                overflow: 'auto',
                                maxHeight: '300px',
                                fontFamily: 'monospace',
                                fontSize: '0.85rem',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                              }}
                            >
                              {formatJSON(log.changes)}
                            </Box>
                          </>
                        )}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[25, 50, 100, 250]}
        component="div"
        count={pagination.total || 0}
        rowsPerPage={pagination.limit || 100}
        page={Math.floor((pagination.offset || 0) / (pagination.limit || 100))}
        onPageChange={(event, newPage) => {
          onPageChange({
            offset: newPage * (pagination.limit || 100),
            limit: pagination.limit || 100,
          });
        }}
        onRowsPerPageChange={(event) => {
          onPageChange({
            offset: 0,
            limit: parseInt(event.target.value, 10),
          });
        }}
      />
    </Paper>
  );
};

export default AuditLogsTable;
