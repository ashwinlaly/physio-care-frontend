import React from 'react';
import { Box, Typography, Stack, Button } from '@mui/material';
import CallToActionGradientButton from './CallToActionGradientButton';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

function HeroSection() {
  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white',
        backgroundImage: `url('https://i.imgur.com/your-background-image.jpg')`, // Replace with your actual image URL
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        px: { xs: 2, md: 4 },
      }}
    >
      {/* Blue overlay */}
      <Box sx={{
        position: 'absolute',
        inset: 0,
        bgcolor: 'primary.main',
        opacity: 0.7,
      }} />

      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 900, mx: 'auto' }}>
        <Typography variant="h2" component="h1" gutterBottom 
          sx={{ 
            fontWeight: 'bold', 
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' } 
          }}>
          Icure Physiotherapy
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom 
          sx={{ 
            fontWeight: 'medium', 
            mb: 4, 
            fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem' } 
          }}>
          Restoring Movement, Enhancing Lives
        </Typography>
        <Typography variant="body1" paragraph 
          sx={{ 
            mb: 6, 
            fontSize: { xs: '1rem', md: '1.15rem' }, 
            lineHeight: 1.6 
          }}>
          Professional physiotherapy services with personalized care for optimal recovery and wellness
        </Typography>

        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={3} 
          justifyContent="center" 
          mb={6}
        >
          <Button 
            variant="outlined" 
            color="secondary" 
            startIcon={<WhatsAppIcon />}
            sx={{ 
              textTransform: 'none', 
              fontSize: '1.1rem', 
              px: 4, 
              py: 1.5, 
              borderRadius: 2, 
              borderColor: 'white', 
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: 'white' } 
            }}
          >
            WhatsApp
          </Button>

          <CallToActionGradientButton text="Book Appointment" icon={<CalendarTodayIcon />} />

          <Button 
            variant="outlined" 
            color="secondary" 
            startIcon={<PhoneIcon />}
            sx={{ 
              textTransform: 'none', 
              fontSize: '1.1rem', 
              px: 4, 
              py: 1.5, 
              borderRadius: 2, 
              borderColor: 'white', 
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: 'white' } 
            }}
          >
            Call Now
          </Button>
        </Stack>

        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={{ xs: 1, md: 6 }} 
          justifyContent="center" 
          alignItems="center" 
          sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PhoneIcon sx={{ mr: 1 }} /> +1 (555) 123-4567
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon sx={{ mr: 1 }} /> Available 24/7
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

export default HeroSection;
