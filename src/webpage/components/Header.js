import React from 'react';
import { AppBar, Toolbar, Box, useMediaQuery, useTheme, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Logo from './Logo';
import Navigation from './Navigation';

function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar position="fixed" elevation={0} color="transparent" sx={{ py: 2 }}>
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Box
          sx={{
            width: 'min(1200px, 100%)',
            mx: 2,
            px: { xs: 2, md: 3 },
            py: 1.25,
            bgcolor: '#fff',
            borderRadius: 999,
            boxShadow: '0 18px 40px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Logo />

          {/* push everything (nav + CTA) to the right */}
          <Box sx={{ flex: 1 }} />

          {/* nav items near Contact Us */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {!isMobile && <Navigation />}

            {isMobile ? (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<MenuIcon />}
                sx={{ px: 2.25, py: 1, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
                onClick={() => {
                  const section = document.getElementById('contact-section');
                  if (section) section.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Menu
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                sx={{ px: 3, py: 1.25 }}
                onClick={() => {
                  const section = document.getElementById('contact-section');
                  if (section) section.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Contact Us
              </Button>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
