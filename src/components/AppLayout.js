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
  Receipt,
  ExitToApp,
  AccountCircle,
  MedicalServices,
} from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet, useNavigate } from 'react-router-dom';
import EventIcon from '@mui/icons-material/Event';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import Inventory from '@mui/icons-material/Inventory';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'New Patient', icon: <MedicalServices />, path: '/patients/new' },
  { text: 'Patient Details', icon: <People />, path: '/patients' },
  { text: 'Financial', icon: <Receipt />, path: '/financial' },
  { text: 'Appointments', icon: <EventIcon />, path: '/appointments' },
  { text: 'Doctors', icon: <LocalHospitalIcon />, path: '/doctors' },
  { text: 'Products', icon: <Inventory />, path: '/products' },
  { text: 'Expenses', icon: <AddShoppingCartIcon />, path: '/expenses' },
];

export const AppLayout = () => {
  const navigate = useNavigate();
  // This is the line that likely caused the error. We ensure it's correct here.
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    handleClose();
    navigate('/');
  };


  const handleProfile = () => {
    navigate('/me/profile');
  };

  const handleSideBar = () => {
    setDrawerOpen((prev) => !prev);
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
            Icure Physiotherapy
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
