import React from 'react';
import { CssBaseline, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Header from './Header';
import HeroSection from './HeroSection';
import ServicesSection from './ServicesSection';
import AIRecoverySection from './AIRecoverySection';
import SpecialitiesSection from './SpecialitiesSection';
import ExpertsSection from './ExpertsSection';
import ClinicsSection from './ClinicsSection';
import WhatWeTreatSection from './WhatWeTreatSection';
import FeaturedBlogSection from './FeaturedBlogSection';
import FAQSection from './FAQSection';
import FooterSection from './FooterSection';
import ContactUsSection from './ContactUsSection';
const theme = createTheme({
  palette: {
    primary: { main: '#0B3D33' },
    secondary: { main: '#2C7A6B' },
    background: { default: '#F6EFE7' },
    text: { primary: '#0F1C18', secondary: '#4B5A55' },
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
        <AIRecoverySection />
        <SpecialitiesSection />
        <ExpertsSection />
        {/* <ClinicsSection /> */}
        <WhatWeTreatSection />
        <FeaturedBlogSection />
        <ContactUsSection />
        <FAQSection />
        <FooterSection />
      </Box>
    </ThemeProvider>
  );
}

export default Home;
