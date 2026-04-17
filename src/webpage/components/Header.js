import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  useMediaQuery,
  useTheme,
  IconButton,
  Button,
  Menu,
  MenuItem,
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
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState(null);
  const mobileMenuOpen = Boolean(mobileMenuAnchor);

  const scrollToSection = (targetId) => {
    const section = document.getElementById(targetId);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMobileMenuClick = (targetId) => {
    setMobileMenuAnchor(null);
    scrollToSection(targetId);
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
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<MenuIcon />}
                  sx={{ px: 2, py: 0.9, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
                  onClick={(event) => setMobileMenuAnchor(event.currentTarget)}
                >
                  Menu
                </Button>
                <Menu
                  anchorEl={mobileMenuAnchor}
                  open={mobileMenuOpen}
                  onClose={() => setMobileMenuAnchor(null)}
                  slotProps={{ paper: { sx: { minWidth: 220 } } }}
                >
                  <MenuItem onClick={() => handleMobileMenuClick('home-section')}>Home</MenuItem>
                  <MenuItem onClick={() => handleMobileMenuClick('recovery-section')}>About Us</MenuItem>
                  <MenuItem onClick={() => handleMobileMenuClick('specialities-section')}>Specialities</MenuItem>
                  <MenuItem onClick={() => handleMobileMenuClick('treat-section')}>What We Treat</MenuItem>
                  <MenuItem onClick={() => handleMobileMenuClick('blog-section')}>Latest Blogs</MenuItem>
                  <MenuItem onClick={() => handleMobileMenuClick('faq-section')}>FAQ</MenuItem>
                  <MenuItem onClick={() => handleMobileMenuClick('experts-section')}>Experts</MenuItem>
                  <MenuItem onClick={() => handleMobileMenuClick('contact-section')}>Contact Us</MenuItem>
                  <MenuItem
                    onClick={() => {
                      setMobileMenuAnchor(null);
                      navigate('/login');
                    }}
                  >
                    Login
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
