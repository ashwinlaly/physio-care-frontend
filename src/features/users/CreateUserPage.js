import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Alert,
  Tooltip,
} from '@mui/material';
import { apiRequest } from '../../common/api';
import { showToast } from '../../common/util';
import { usePermission } from '../../common/rbac';

const initialForm = {
  name: '',
  email: '',
  password: '',
  roleId: '',
};

const CreateUserPage = () => {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  // Permission checks
  const canCreateUser = usePermission('users.create');

  // Load available roles for the organization
  const loadRoles = async () => {
    setLoadingRoles(true);
    try {
      const response = await apiRequest(`${process.env.REACT_APP_API_URL}/roles`, {
        auth: true,
      });
      setRoles(response.roles || response || []);
    } catch (error) {
      showToast(error.message || 'Unable to load roles', 'error');
      setRoles([]);
    } finally {
      setLoadingRoles(false);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleInputChange = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleRoleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      roleId: event.target.value,
    }));
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      showToast('Name is required', 'error');
      return false;
    }
    if (!form.email.trim()) {
      showToast('Email is required', 'error');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      showToast('Invalid email format', 'error');
      return false;
    }
    if (!form.password) {
      showToast('Password is required', 'error');
      return false;
    }
    if (form.password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return false;
    }
    if (!form.roleId) {
      showToast('Role is required', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await apiRequest(
        `${process.env.REACT_APP_API_URL}/users/create-org-user`,
        {
          method: 'POST',
          auth: true,
          body: {
            name: form.name,
            email: form.email,
            password: form.password,
            roleId: form.roleId,
          },
        }
      );

      showToast('User created successfully!', 'success');
      setForm(initialForm);
    } catch (error) {
      showToast(error.message || 'Failed to create user', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!canCreateUser) {
    return (
      <Stack spacing={3}>
        <Typography variant="h5">Create New User</Typography>
        <Alert severity="error">
          You don't have permission to create new users. Please contact your administrator.
        </Alert>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h5">Create New User</Typography>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            User Details
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Name Field */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Full Name"
                  value={form.name}
                  onChange={handleInputChange('name')}
                  fullWidth
                  required
                  placeholder="e.g., John Doe"
                  disabled={submitting}
                />
              </Grid>

              {/* Email Field */}
              <Grid item xs={12} sm={6}>
                <TextField
                  type="email"
                  label="Email Address"
                  value={form.email}
                  onChange={handleInputChange('email')}
                  fullWidth
                  required
                  placeholder="e.g., john@example.com"
                  disabled={submitting}
                />
              </Grid>

              {/* Password Field */}
              <Grid item xs={12} sm={6}>
                <TextField
                  type="password"
                  label="Password"
                  value={form.password}
                  onChange={handleInputChange('password')}
                  fullWidth
                  required
                  placeholder="Minimum 6 characters"
                  disabled={submitting}
                />
              </Grid>

              {/* Role Dropdown */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required disabled={submitting || loadingRoles}>
                  <InputLabel id="role-select-label">Role</InputLabel>
                  <Select
                    labelId="role-select-label"
                    id="role-select"
                    value={form.roleId}
                    label="Role"
                    onChange={handleRoleChange}
                  >
                    {loadingRoles ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Loading roles...
                      </MenuItem>
                    ) : roles.length === 0 ? (
                      <MenuItem disabled>No roles available</MenuItem>
                    ) : (
                      roles.map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                          {role.name}
                          {role.description && ` - ${role.description}`}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Tooltip
                  title={
                    !form.name || !form.email || !form.password || !form.roleId
                      ? 'Please fill in all required fields'
                      : ''
                  }
                >
                  <Box>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={submitting || loadingRoles}
                      sx={{ mt: 1 }}
                    >
                      {submitting ? (
                        <>
                          <CircularProgress size={20} sx={{ mr: 1 }} />
                          Creating...
                        </>
                      ) : (
                        'Create User'
                      )}
                    </Button>
                  </Box>
                </Tooltip>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
};

export { CreateUserPage };
