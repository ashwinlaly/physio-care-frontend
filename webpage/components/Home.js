import React from 'react';
import { CssBaseline, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Import all the main section components
import Header from './Header';
import HeroSection from './HeroSection';
import ServicesSection from './ServicesSection';
import FeaturedBlogSection from './FeaturedBlogSection';
import ContactUsSection from './ContactUsSection';

// Define a custom theme to match the blue in your design
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3', // A shade of blue similar to your design
      light: '#64b5f6', // Lighter shade for hover effects
      dark: '#1976d2', // Darker shade for active/contained buttons
    },
    secondary: {
      main: '#ffffff', // White for text/icons
    },
    text: {
      primary: '#333333', // Dark text for readability
      secondary: '#555555', // Lighter text for descriptions
    }
  },
  typography: {
    fontFamily: 'Roboto, sans-serif', // Or whatever font you prefer
  },
});

function Home() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <HeroSection />
        <ServicesSection />
        <FeaturedBlogSection />
        <ContactUsSection />
        {/* Potentially a Footer component would go here */}
      </Box>
    </ThemeProvider>
  );
}

export default Home;
