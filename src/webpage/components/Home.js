import React from 'react';
import { CssBaseline, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Header from './Header';
import HeroSection from './HeroSection';
import ServicesSection from './ServicesSection';
import FeaturedBlogSection from './FeaturedBlogSection';
import ContactUsSection from './ContactUsSection';

const theme = createTheme({
  palette: {
    primary: { main: '#2680c8' },      // deep green
    secondary: { main: '#6B7C6E' },    // muted green/grey
    background: { default: '#F6EFE7' },// warm beige
    text: { primary: '#1F1F1F', secondary: '#5A5A5A' },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h2: { fontWeight: 800, letterSpacing: '-0.02em' },
    h3: { fontWeight: 800, letterSpacing: '-0.02em' },
    button: { fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, textTransform: 'none' },
      },
    },
  },
});

function Home() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Header />
        <HeroSection />
        <ServicesSection />
        {/* Keeping your existing sections below */}
        <FeaturedBlogSection />
        <ContactUsSection />
      </Box>
    </ThemeProvider>
  );
}

export default Home;
