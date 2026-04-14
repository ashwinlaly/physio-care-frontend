import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  useMediaQuery,
  useTheme,
  IconButton,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import Logo from './Logo';
import Navigation from './Navigation';

function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const scrollToSection = (targetId) => {
    const section = document.getElementById(targetId);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      color="transparent"
      sx={{
        bgcolor: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(11,61,51,0.10)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'center', minHeight: { xs: 64, md: 72 } }}>
        <Box
          sx={{
            width: 'min(1200px, 100%)',
            mx: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Logo />

          <Box sx={{ flex: 1 }} />

          {!isMobile && <Navigation />}

          <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {!isMobile ? (
              <>
                <IconButton
                  size="large"
                  sx={{ color: 'primary.main' }}
                  onClick={() => scrollToSection('contact-section')}
                  aria-label="Location"
                >
                  <LocationOnOutlinedIcon />
                </IconButton>
                <IconButton size="small" sx={{ color: 'primary.main' }}>
                  <FacebookIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ color: 'primary.main' }}>
                  <InstagramIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ color: 'primary.main' }}>
                  <LinkedInIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="large"
                  sx={{ color: 'primary.main' }}
                  onClick={() => navigate('/login')}
                >
                  <AccountCircleOutlinedIcon />
                </IconButton>
              </>
            ) : (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<MenuIcon />}
                sx={{ px: 2, py: 0.9, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
                onClick={() => {
                  const section = document.getElementById('faq-section');
                  if (section) section.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Menu
              </Button>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
