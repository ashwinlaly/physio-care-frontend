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
  History,
  PersonAdd,
} from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet, useNavigate } from 'react-router-dom';
import EventIcon from '@mui/icons-material/Event';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import Inventory from '@mui/icons-material/Inventory';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import {clearSessionTimer} from '../common/sessionManager';
import { usePermission } from '../common/rbac';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard', permission: 'dashboard.read', adminOnly: true },
  { text: 'New Patient', icon: <MedicalServices />, path: '/patients/new', permission: 'patients.create' },
  { text: 'Patient Details', icon: <People />, path: '/patients', permission: 'patients.read' },
  { text: 'Financial', icon: <Receipt />, path: '/financial', permission: 'dashboard.read', adminOnly: true },
  { text: 'Appointments', icon: <EventIcon />, path: '/appointments', permission: 'appointments.read' },
  { text: 'Doctors', icon: <LocalHospitalIcon />, path: '/doctors', permission: 'doctors.read' },
  { text: 'Expenses', icon: <AddShoppingCartIcon />, path: '/expenses', permission: 'expenses.read' },
  { text: 'Register', icon: <AppRegistrationRounded />, path: '/register', permission: 'users.read' },
  { text: 'Attendance', icon: <AppRegistrationRounded />, path: '/attendance', permission: 'attendance.read' },
  { text: 'Attendance Report', icon: <AssessmentIcon />, path: '/attendance/report', permission: 'attendance.read' },
  { text: 'Create User', icon: <PersonAdd />, path: '/users/new', permission: 'users.create' },
  { text: 'Audit Logs', icon: <History />, path: '/audit', permission: 'audit_logs.read' },
];

const inventoryMenuItems = [
  { text: 'Products', path: '/products', permission: 'products.read' },
  { text: 'Sales', path: '/sales', permission: 'sales.read' },
];

export const AppLayout = () => {
  const navigate = useNavigate();
  // This is the line that likely caused the error. We ensure it's correct here.
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [inventoryOpen, setInventoryOpen] = React.useState(true);
  const { hasPermission } = usePermission();

  // Debug: Log permissions
  React.useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const parts = token.split('.');
        const payload = JSON.parse(atob(parts[1]));
        console.log('🔐 JWT Payload:', payload);
        console.log('📋 Permissions in token:', payload.permissions);
      } catch (e) {
        console.error('Error decoding token:', e);
      }
    }
  }, []);

  // Filter menu items based on permissions
  const isAdmin = hasPermission('users.manage'); // Only Admin role has this
  const visibleMenuItems = menuItems.filter(item => {
    // If item requires admin, check if user is admin
    if (item.adminOnly && !isAdmin) {
      return false;
    }
    const has = hasPermission(item.permission);
    console.log(`🔍 Permission check: ${item.permission} = ${has}`);
    return has;
  });
  const visibleInventoryItems = inventoryMenuItems.filter(item => hasPermission(item.permission));
  const hasInventoryAccess = visibleInventoryItems.length > 0;
  
  console.log(`📊 Menu items visible: ${visibleMenuItems.length}, Inventory items: ${visibleInventoryItems.length}`);

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
             {visibleMenuItems.map((item) => (
               <ListItem key={item.text} disablePadding>
                 <ListItemButton onClick={() => handleNavigate(item.path)}>
                   <ListItemIcon>{item.icon}</ListItemIcon>
                   <ListItemText primary={item.text} />
                 </ListItemButton>
               </ListItem>
             ))}

             {hasInventoryAccess && (
               <>
                 <ListItem disablePadding>
                   <ListItemButton onClick={() => setInventoryOpen((prev) => !prev)}>
                     <ListItemIcon><Inventory /></ListItemIcon>
                     <ListItemText primary="Inventory" />
                     {inventoryOpen ? <ExpandLess /> : <ExpandMore />}
                   </ListItemButton>
                 </ListItem>
                 <Collapse in={inventoryOpen} timeout="auto" unmountOnExit>
                   <List component="div" disablePadding>
                     {visibleInventoryItems.map((item) => (
                       <ListItem key={item.text} disablePadding>
                         <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate(item.path)}>
                           <ListItemText primary={item.text} />
                         </ListItemButton>
                       </ListItem>
                     ))}
                   </List>
                 </Collapse>
               </>
             )}
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
