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
  Collapse,
} from '@mui/material';
import {
  Dashboard,
  People,
  Receipt,
  ExitToApp,
  AccountCircle,
  MedicalServices,
  AppRegistrationRounded,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet, useNavigate } from 'react-router-dom';
import EventIcon from '@mui/icons-material/Event';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import Inventory from '@mui/icons-material/Inventory';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import {clearSessionTimer} from '../common/sessionManager';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'New Patient', icon: <MedicalServices />, path: '/patients/new' },
  { text: 'Patient Details', icon: <People />, path: '/patients' },
  { text: 'Financial', icon: <Receipt />, path: '/financial' },
  { text: 'Appointments', icon: <EventIcon />, path: '/appointments' },
  { text: 'Doctors', icon: <LocalHospitalIcon />, path: '/doctors' },
  { text: 'Expenses', icon: <AddShoppingCartIcon />, path: '/expenses' },
  { text: 'Register', icon: <AppRegistrationRounded />, path: '/register' },
  { text: 'Attendance', icon: <AppRegistrationRounded />, path: '/attendance' },
  { text: 'Attendance Report', icon: <AssessmentIcon />, path: '/attendance/report' },
];

const inventoryMenuItems = [
  { text: 'Products', path: '/products' },
  { text: 'Sales', path: '/sales' },
];

export const AppLayout = () => {
  const navigate = useNavigate();
  // This is the line that likely caused the error. We ensure it's correct here.
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [inventoryOpen, setInventoryOpen] = React.useState(true);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    handleClose();
    clearSessionTimer();
    localStorage.removeItem('authToken');
    navigate('/');
  };


  const handleProfile = () => {
    navigate('/me/profile');
  };

  const handleSideBar = () => {
    setDrawerOpen((prev) => !prev);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton onClick={handleSideBar} sx={{ mr: 2 }}>
            <MenuIcon  />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            iCure Physiotherapy
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
              <MenuItem onClick={handleProfile}><AccountCircle sx={{ mr: 1 }}/> Profile</MenuItem>
              <MenuItem onClick={handleLogout}><ExitToApp sx={{ mr: 1 }}/> Log Out</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={handleSideBar}
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
                <ListItemButton onClick={() => handleNavigate(item.path)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}

            <ListItem disablePadding>
              <ListItemButton onClick={() => setInventoryOpen((prev) => !prev)}>
                <ListItemIcon><Inventory /></ListItemIcon>
                <ListItemText primary="Inventory" />
                {inventoryOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={inventoryOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {inventoryMenuItems.map((item) => (
                  <ListItem key={item.text} disablePadding>
                    <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate(item.path)}>
                      <ListItemText primary={item.text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
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
