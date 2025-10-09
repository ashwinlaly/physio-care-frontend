import React from 'react';
import { AppBar, Toolbar, Box, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // For a potential mobile menu
import Logo from './Logo';
import Navigation from './Navigation';
import CallToActionGradientButton from './CallToActionGradientButton';

function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar position="fixed" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between', padding: { xs: 2, md: 3 } }}>
        <Logo />
        {isMobile ? (
          <CallToActionGradientButton text="Book Appointment" sx={{ textTransform: 'none', px: 3, py: 1 }} />
          // You might want a MenuIcon here to open a drawer for navigation on mobile
          // <MenuIcon sx={{ color: 'white', fontSize: 30 }} />
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Navigation />
            <CallToActionGradientButton text="Book Appointment" sx={{ ml: 4, px: 3, py: 1 }} />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
