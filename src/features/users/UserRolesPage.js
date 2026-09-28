import React, { useEffect, useState } from 'react';
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
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { apiRequest } from '../../common/api';
import { showToast } from '../../common/util';

const UserRolesPage = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserRoles, setSelectedUserRoles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Load users and roles on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        apiRequest(`${process.env.REACT_APP_API_URL}/users`, { auth: true }),
        apiRequest(`${process.env.REACT_APP_API_URL}/roles`, { auth: true }),
      ]);
      setUsers(usersRes.users || []);
      setRoles(rolesRes.roles || []);
    } catch (error) {
      showToast(error.message || 'Unable to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = async (user) => {
    setSelectedUser(user);
    try {
      const response = await apiRequest(
        `${process.env.REACT_APP_API_URL}/users/${user.id}/roles`,
        { auth: true }
      );
      setSelectedUserRoles(response.roles?.map((r) => r.id) || []);
    } catch (error) {
      showToast(error.message || 'Unable to load user roles', 'error');
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setSelectedUserRoles([]);
  };

  const handleRoleToggle = (roleId) => {
    setSelectedUserRoles((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const handleSaveRoles = async () => {
    if (!selectedUser) return;

    setSaving(true);
    try {
      // Get current roles
      const currentRolesRes = await apiRequest(
        `${process.env.REACT_APP_API_URL}/users/${selectedUser.id}/roles`,
        { auth: true }
      );
      const currentRoleIds = currentRolesRes.roles?.map((r) => r.id) || [];

      // Find roles to add and remove
      const rolesToAdd = selectedUserRoles.filter((id) => !currentRoleIds.includes(id));
      const rolesToRemove = currentRoleIds.filter((id) => !selectedUserRoles.includes(id));

      // Execute all operations
      await Promise.all([
        ...rolesToAdd.map((roleId) =>
          apiRequest(
            `${process.env.REACT_APP_API_URL}/users/${selectedUser.id}/roles/${roleId}`,
            { method: 'POST', auth: true }
          )
        ),
        ...rolesToRemove.map((roleId) =>
          apiRequest(
            `${process.env.REACT_APP_API_URL}/users/${selectedUser.id}/roles/${roleId}`,
            { method: 'DELETE', auth: true }
          )
        ),
      ]);

      // Update local user state
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id
            ? { ...u, roles: roles.filter((r) => selectedUserRoles.includes(r.id)) }
            : u
        )
      );

      showToast('User roles updated successfully', 'success');
      handleCloseDialog();
    } catch (error) {
      showToast(error.message || 'Unable to update roles', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Assign Roles to Users</Typography>
      </Box>

      <TextField
        placeholder="Search users by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        size="small"
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={2}>
          {filteredUsers.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="textSecondary">No users found</Typography>
            </Paper>
          ) : (
            filteredUsers.map((user) => (
              <Paper key={user.id} sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {user.email}
                    </Typography>
                    {user.roles && user.roles.length > 0 && (
                      <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {user.roles.map((role) => (
                          <Chip key={role.id} label={role.name} size="small" />
                        ))}
                      </Box>
                    )}
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpenDialog(user)}
                  >
                    Manage Roles
                  </Button>
                </Box>
              </Paper>
            ))
          )}
        </Stack>
      )}

      {/* Role Assignment Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Roles to {selectedUser?.name}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            {roles.length === 0 ? (
              <Typography color="textSecondary">No roles available</Typography>
            ) : (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Available Roles:
                </Typography>
                <Grid container spacing={1}>
                  {roles.map((role) => (
                    <Grid item xs={12} key={role.id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedUserRoles.includes(role.id)}
                            onChange={() => handleRoleToggle(role.id)}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {role.name}
                            </Typography>
                            {role.description && (
                              <Typography variant="caption" color="textSecondary">
                                {role.description}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveRoles} variant="contained" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export { UserRolesPage };
