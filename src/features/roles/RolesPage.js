import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { apiRequest } from '../../common/api';
import { showToast } from '../../common/util';
import { getPermissionDisplayName, groupPermissionsByResource } from '../../common/rbac';

const RolesPage = () => {
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create' or 'edit'
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissionIds: [],
  });
  const [saving, setSaving] = useState(false);

  // Load roles and permissions on component mount
  useEffect(() => {
    loadRolesAndPermissions();
  }, []);

  const loadRolesAndPermissions = async () => {
    setLoading(true);
    try {
      const [rolesRes, permissionsRes] = await Promise.all([
        apiRequest(`${process.env.REACT_APP_API_URL}/roles`, { auth: true }),
        apiRequest(`${process.env.REACT_APP_API_URL}/permissions/all`, { auth: true }),
      ]);
      setRoles(rolesRes.roles || []);
      setPermissions(permissionsRes.permissions || []);
    } catch (error) {
      showToast(error.message || 'Unable to load roles', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateDialog = () => {
    setDialogMode('create');
    setSelectedRole(null);
    setFormData({
      name: '',
      description: '',
      permissionIds: [],
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (role) => {
    setDialogMode('edit');
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description || '',
      permissionIds: role.permissionIds || [],
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRole(null);
    setFormData({
      name: '',
      description: '',
      permissionIds: [],
    });
  };

  const handlePermissionToggle = (permissionId) => {
    setFormData((prev) => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(permissionId)
        ? prev.permissionIds.filter((id) => id !== permissionId)
        : [...prev.permissionIds, permissionId],
    }));
  };

  const handleSaveRole = async () => {
    if (!formData.name.trim()) {
      showToast('Role name is required', 'error');
      return;
    }

    setSaving(true);
    try {
      let response;
      if (dialogMode === 'create') {
        response = await apiRequest(`${process.env.REACT_APP_API_URL}/roles`, {
          method: 'POST',
          auth: true,
          body: formData,
        });
        setRoles([...roles, response.role]);
        showToast('Role created successfully', 'success');
      } else {
        response = await apiRequest(`${process.env.REACT_APP_API_URL}/roles/${selectedRole.id}`, {
          method: 'PUT',
          auth: true,
          body: formData,
        });
        setRoles(roles.map((r) => (r.id === selectedRole.id ? response.role : r)));
        showToast('Role updated successfully', 'success');
      }
      handleCloseDialog();
    } catch (error) {
      showToast(error.message || 'Unable to save role', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (!window.confirm('Are you sure you want to delete this role?')) {
      return;
    }

    try {
      await apiRequest(`${process.env.REACT_APP_API_URL}/roles/${roleId}`, {
        method: 'DELETE',
        auth: true,
      });
      setRoles(roles.filter((r) => r.id !== roleId));
      showToast('Role deleted successfully', 'success');
    } catch (error) {
      showToast(error.message || 'Unable to delete role', 'error');
    }
  };

  const permissionsByResource = groupPermissionsByResource(permissions.map((p) => p.permission));

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Roles Management</Typography>
        <Button variant="contained" color="primary" onClick={handleOpenCreateDialog}>
          Create Role
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="center">Permissions</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell sx={{ fontWeight: 500 }}>{role.name}</TableCell>
                  <TableCell>{role.description || '-'}</TableCell>
                  <TableCell align="center">
                    <Chip label={`${(role.permissionIds || []).length}`} size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenEditDialog(role)}
                      title="Edit role"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteRole(role.id)}
                      title="Delete role"
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create/Edit Role Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Create New Role' : `Edit Role: ${selectedRole?.name}`}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={3}>
            <TextField
              label="Role Name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              fullWidth
              multiline
              rows={2}
            />

            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Permissions
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(permissionsByResource).map(([resource, perms]) => (
                  <Grid item xs={12} key={resource}>
                    <Paper sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        {resource.charAt(0).toUpperCase() + resource.slice(1)}
                      </Typography>
                      <Grid container>
                        {perms.map((permission) => {
                          const permObj = permissions.find((p) => p.permission === permission);
                          return (
                            <Grid item xs={12} sm={6} key={permission}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={formData.permissionIds.includes(permObj?.id)}
                                    onChange={() => handlePermissionToggle(permObj?.id)}
                                  />
                                }
                                label={getPermissionDisplayName(permission)}
                              />
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveRole} variant="contained" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export { RolesPage };
