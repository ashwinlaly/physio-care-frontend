import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  Alert,
  Tooltip,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../common/api';
import { PERMISSION_OPTIONS } from '../../common/permissions';
import { showToast } from '../../common/util';
import { usePermission } from '../../common/rbac';

const initialForm = {
  name: '',
  email: '',
  password: '',
  menuPermissions: [],
};

const UsersAccessPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);

  // Permission checks
  const canCreateUser = usePermission('users.create');
  const canUpdateUser = usePermission('users.update');
  const canDeleteUser = usePermission('users.delete');
  const canReadUsers = usePermission('users.read');

  const currentUserId = useMemo(() => {
    try {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      return user?.id || null;
    } catch (error) {
      return null;
    }
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await apiRequest(`${process.env.REACT_APP_API_URL}/users`, {
        auth: true,
      });
      setUsers(response.users || []);
    } catch (error) {
      showToast(error.message || 'Unable to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleFormPermission = (permissionKey) => {
    setForm((prev) => {
      const exists = prev.menuPermissions.includes(permissionKey);
      const nextPermissions = exists
        ? prev.menuPermissions.filter((item) => item !== permissionKey)
        : [...prev.menuPermissions, permissionKey];

      return {
        ...prev,
        menuPermissions: nextPermissions,
      };
    });
  };

  const onCreateUser = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await apiRequest(`${process.env.REACT_APP_API_URL}/users`, {
        method: 'POST',
        auth: true,
        body: form,
      });
      showToast('User created', 'success');
      setForm(initialForm);
      await loadUsers();
    } catch (error) {
      showToast(error.message || 'Unable to create user', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updateUserPermission = async (userId, nextPermissions) => {
    try {
      await apiRequest(`${process.env.REACT_APP_API_URL}/users/${userId}/permissions`, {
        method: 'PATCH',
        auth: true,
        body: { menuPermissions: nextPermissions },
      });

      setUsers((prev) =>
        prev.map((item) =>
          item.id === userId ? { ...item, menuPermissions: nextPermissions } : item,
        ),
      );
      showToast('Permissions updated', 'success');
    } catch (error) {
      showToast(error.message || 'Unable to update permissions', 'error');
    }
  };

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Users & Access</Typography>
        {canCreateUser && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/users/new')}
          >
            Create New User
          </Button>
        )}
      </Box>

      {!canReadUsers && (
        <Alert severity="error">
          You don't have permission to manage users.
        </Alert>
      )}

      {canReadUsers && (
        <>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Add User
            </Typography>
            
            {!canCreateUser && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                You don't have permission to create new users.
              </Alert>
            )}

            <Box component="form" onSubmit={onCreateUser}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Name"
                    value={form.name}
                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                    fullWidth
                    required
                    disabled={!canCreateUser}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    type="email"
                    label="Email"
                    value={form.email}
                    onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                    fullWidth
                    required
                    disabled={!canCreateUser}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Password"
                    type="password"
                    value={form.password}
                    onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                    fullWidth
                    required
                    disabled={!canCreateUser}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Menu Access
                  </Typography>
                  <Grid container>
                    {PERMISSION_OPTIONS.map((permission) => (
                      <Grid item xs={12} sm={6} md={4} key={permission.key}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={form.menuPermissions.includes(permission.key)}
                              onChange={() => toggleFormPermission(permission.key)}
                              disabled={!canCreateUser}
                            />
                          }
                          label={permission.label}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Tooltip title={!canCreateUser ? "You don't have permission to create users" : ''}>
                    <Box>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={saving || !canCreateUser}
                      >
                        {saving ? 'Creating...' : 'Create User'}
                      </Button>
                    </Box>
                  </Tooltip>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Manage Access
            </Typography>

            {!canUpdateUser && !canDeleteUser && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                You don't have permission to update or delete users.
              </Alert>
            )}

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Stack spacing={2}>
                {users.map((user) => (
                  <Box key={user.id}>
                    <Typography variant="subtitle1">
                      {user.name} ({user.email})
                    </Typography>
                    <Grid container>
                      {PERMISSION_OPTIONS.map((permission) => {
                        const checked = (user.menuPermissions || []).includes(permission.key);
                        return (
                          <Grid item xs={12} sm={6} md={4} key={`${user.id}-${permission.key}`}>
                            <Tooltip
                              title={
                                !canUpdateUser
                                  ? "You don't have permission to update user permissions"
                                  : ''
                              }
                            >
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={checked}
                                    onChange={(event) => {
                                      const current = user.menuPermissions || [];
                                      const nextPermissions = event.target.checked
                                        ? [...current, permission.key]
                                        : current.filter((item) => item !== permission.key);
                                      updateUserPermission(user.id, nextPermissions);
                                    }}
                                    disabled={
                                      (user.id === currentUserId && permission.key === 'users_access')
                                      || !canUpdateUser
                                    }
                                  />
                                }
                                label={permission.label}
                              />
                            </Tooltip>
                          </Grid>
                        );
                      })}
                    </Grid>
                    <Divider sx={{ mt: 1 }} />
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        </>
      )}
    </Stack>
  );
};

export { UsersAccessPage };

