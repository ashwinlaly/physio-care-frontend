import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, CircularProgress,
  Chip, Divider, TextField, Button, Stack, Alert,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EventIcon from '@mui/icons-material/Event';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from 'recharts';
import { apiRequest } from '../../common/api';

const API_BASE = process.env.REACT_APP_API_URL || '';

const STATUS_COLORS = ['#1976d2', '#2e7d32', '#ed6c02', '#d32f2f', '#7b1fa2', '#0288d1'];

const StatCard = ({ icon, label, value, color = '#1976d2', sub }) => (
  <Card elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
    <CardContent>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box sx={{ color, fontSize: 36, display: 'flex' }}>{icon}</Box>
        <Box>
          <Typography variant="h5" fontWeight={700}>{value ?? 0}</Typography>
          <Typography variant="body2" color="text.secondary">{label}</Typography>
          {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

const FinanceCard = ({ label, value, color }) => (
  <Card elevation={2} sx={{ borderRadius: 2, height: '100%', borderLeft: `4px solid ${color}` }}>
    <CardContent>
      <Typography variant="body2" color="text.secondary" gutterBottom>{label}</Typography>
      <Typography variant="h5" fontWeight={700} sx={{ color }}>
        ₹{Number(value ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
      </Typography>
    </CardContent>
  </Card>
);

const today = () => new Date().toISOString().slice(0, 10);
const firstOfMonth = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
};

export const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(firstOfMonth());
  const [endDate, setEndDate] = useState(today());

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ startDate, endDate });
      const result = await apiRequest(`${API_BASE}/dashboard/summary?${params}`, { auth: true });
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const statusPieData = data
    ? Object.entries(data.appointments?.statusBreakdown || {}).map(([name, value]) => ({ name, value }))
    : [];

  const appointmentsByDate = data?.appointments?.byDate || [];

  return (
    <Box>
      {/* Header */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} mb={3} spacing={2}>
        <Typography variant="h4" fontWeight={700}>Admin Dashboard</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center">
          <TextField
            label="From"
            type="date"
            size="small"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="To"
            type="date"
            size="small"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <Button variant="contained" onClick={fetchDashboard} disabled={loading}>
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Apply'}
          </Button>
        </Stack>
      </Stack>

      {/* Filter applied chips */}
      {data && (
        <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
          <Chip size="small" label={`From: ${data.filtersApplied?.startDate}`} />
          <Chip size="small" label={`To: ${data.filtersApplied?.endDate}`} />
        </Stack>
      )}

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading && !data && (
        <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>
      )}

      {data && (
        <>
          {/* Totals */}
          <Typography variant="subtitle1" fontWeight={600} mb={1} color="text.secondary">Overview</Typography>
          <Grid container spacing={2} mb={3}>
            {[
              { icon: <PeopleIcon fontSize="inherit" />, label: 'Total Users', value: data.totals?.totalUsers, color: '#1976d2' },
              { icon: <PersonAddIcon fontSize="inherit" />, label: 'Total Patients', value: data.totals?.totalPatients, color: '#2e7d32' },
              { icon: <LocalHospitalIcon fontSize="inherit" />, label: 'Doctors', value: data.totals?.totalDoctors, color: '#7b1fa2' },
              { icon: <EventIcon fontSize="inherit" />, label: 'Appointments', value: data.totals?.totalAppointments, color: '#0288d1' },
              { icon: <MedicalServicesIcon fontSize="inherit" />, label: 'Treatment Sessions', value: data.totals?.totalTreatmentSessions, color: '#ed6c02' },
              { icon: <InventoryIcon fontSize="inherit" />, label: 'Products', value: data.totals?.totalProducts, color: '#5c6bc0', sub: `Low stock: ${data.totals?.lowStockProducts}` },
            ].map((card) => (
              <Grid item xs={6} sm={4} md={2} key={card.label}>
                <StatCard {...card} />
              </Grid>
            ))}
          </Grid>

          {/* Low stock warning */}
          {data.totals?.lowStockProducts > 0 && (
            <Alert severity="warning" icon={<WarningAmberIcon />} sx={{ mb: 2 }}>
              {data.totals.lowStockProducts} product(s) are running low on stock.
            </Alert>
          )}

          <Divider sx={{ mb: 3 }} />

          {/* Finance */}
          <Typography variant="subtitle1" fontWeight={600} mb={1} color="text.secondary">Finance Summary</Typography>
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} sm={6} md={3}><FinanceCard label="Total Collected" value={data.finance?.totalCollected} color="#2e7d32" icon={<AttachMoneyIcon />} /></Grid>
            <Grid item xs={12} sm={6} md={3}><FinanceCard label="Total Expenses" value={data.finance?.totalExpenses} color="#d32f2f" icon={<TrendingDownIcon />} /></Grid>
            <Grid item xs={12} sm={6} md={3}><FinanceCard label="Paid Expenses" value={data.finance?.paidExpenses} color="#ed6c02" /></Grid>
            <Grid item xs={12} sm={6} md={3}><FinanceCard label="Pending Expenses" value={data.finance?.pendingExpenses} color="#f9a825" /></Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FinanceCard
                label="Net Revenue"
                value={data.finance?.netRevenue}
                color={data.finance?.netRevenue >= 0 ? '#1976d2' : '#d32f2f'}
                icon={<AccountBalanceIcon />}
              />
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* Charts row */}
          <Grid container spacing={3} mb={3}>
            {/* Appointments by date */}
            <Grid item xs={12} md={8}>
              <Card elevation={2} sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600} mb={2}>Appointments by Date</Typography>
                  {appointmentsByDate.length === 0 ? (
                    <Typography color="text.secondary" variant="body2">No appointment data for this period.</Typography>
                  ) : (
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={appointmentsByDate} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                        <RechartsTooltip />
                        <Legend />
                        <Bar dataKey="count" name="Appointments" fill="#1976d2" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="amount" name="Amount (₹)" fill="#2e7d32" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Appointment status pie */}
            <Grid item xs={12} md={4}>
              <Card elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600} mb={2}>Appointment Status</Typography>
                  {statusPieData.length === 0 ? (
                    <Typography color="text.secondary" variant="body2">No data.</Typography>
                  ) : (
                    <>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie data={statusPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, value }) => `${name}: ${value}`}>
                            {statusPieData.map((_, i) => (
                              <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <Stack direction="row" flexWrap="wrap" spacing={0.5} mt={1} justifyContent="center">
                        {statusPieData.map((entry, i) => (
                          <Chip
                            key={entry.name}
                            size="small"
                            label={`${entry.name}: ${entry.value}`}
                            sx={{ bgcolor: STATUS_COLORS[i % STATUS_COLORS.length], color: '#fff', textTransform: 'capitalize' }}
                          />
                        ))}
                      </Stack>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Trends */}
          {(data.trends?.collectionsByDate?.length > 0 || data.trends?.expensesByDate?.length > 0) && (
            <>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="subtitle1" fontWeight={600} mb={1} color="text.secondary">Financial Trends</Typography>
              <Card elevation={2} sx={{ borderRadius: 2, mb: 3 }}>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart
                      data={[
                        ...new Set([
                          ...data.trends.collectionsByDate.map((d) => d.date),
                          ...data.trends.expensesByDate.map((d) => d.date),
                        ]),
                      ]
                        .sort()
                        .map((date) => ({
                          date,
                          collected: data.trends.collectionsByDate.find((d) => d.date === date)?.amount || 0,
                          expenses: data.trends.expensesByDate.find((d) => d.date === date)?.amount || 0,
                        }))}
                      margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <RechartsTooltip formatter={(v) => `₹${v}`} />
                      <Legend />
                      <Bar dataKey="collected" name="Collected (₹)" fill="#2e7d32" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expenses" name="Expenses (₹)" fill="#d32f2f" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}
    </Box>
  );
};
