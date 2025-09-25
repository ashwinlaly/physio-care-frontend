import React from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Dashboard,
  People,
  PersonAdd,
  Receipt,
  Assessment,
  ExitToApp,
  AccountCircle,
  MedicalServices,
  DirectionsRun,
  AirlineSeatIndividualSuite,
} from '@mui/icons-material';
import { Outlet, useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/' },
  { text: 'New Patient', icon: <MedicalServices />, path: '/patients/new' },
  { text: 'Patient Details', icon: <People />, path: '/patients' },
  { text: 'Appointments', icon: <PersonAdd />, path: '/appointments' },
  { text: 'Financial', icon: <Receipt />, path: '/financial' }
];

export const AppLayout = () => {
  const navigate = useNavigate();
  // This is the line that likely caused the error. We ensure it's correct here.
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    handleClose();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          ICare Physio
          </Typography>
          <div>
            <Tooltip title="Account settings">
              <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                <Avatar alt="User" />
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}><AccountCircle sx={{ mr: 1 }}/> Profile</MenuItem>
              <MenuItem onClick={handleLogout}><ExitToApp sx={{ mr: 1 }}/> Log Out</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => navigate(item.path)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};
