import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
} from '@mui/material';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
function HeroSection() {
  const navigate = useNavigate();

  return (
    <Box id="home-section" sx={{ pt: { xs: 5, md: 6 }, bgcolor: 'background.default' }}>
      <Box
        sx={{
          width: '100%',
          // 1. Using 16/9 (standard photo size) ensures the bottom isn't cut off
          // On mobile (xs), we use 4/3 to make it taller so text fits
          aspectRatio: { xs: '4/3', md: '16/9' }, 
          
          backgroundImage: "url('/images/image3.png')",
          
          // 2. 'contain' ensures the WHOLE image is seen. 
          // If you want it to fill the width exactly, use '100% 100%'
          backgroundSize: '100% 100%', 
          
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(11,61,51,0.8), rgba(11,61,51,0.3))',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Box sx={{ maxWidth: 800, mx: 'auto', textAlign: 'center', color: '#fff' }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                lineHeight: 1.1,
                fontSize: { xs: 28, sm: 48, md: 56 },
                textShadow: '0px 2px 8px rgba(0,0,0,0.4)',
              }}
            >
              Don't Let Pain Affect the <br /> Quality Of Your Life
            </Typography>

            <Typography
              sx={{
                mt: 2,
                mx: 'auto',
                maxWidth: 600,
                color: 'rgba(255,255,255,0.95)',
                fontSize: { xs: 14, md: 17 },
                lineHeight: 1.6,
              }}
            >
              Our clinic offers professional physiotherapy and personalized care to keep you moving better with confidence.
            </Typography>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                color="primary"
                endIcon={<ArrowForwardIcon />}
                sx={{ px: 4, py: 1.2, borderRadius: '50px', fontWeight: 'bold' }}
                onClick={() => navigate('/login')}
              >
                Book Now
              </Button>
              <Button
                variant="outlined"
                sx={{
                  px: 4,
                  py: 1.2,
                  borderRadius: '50px',
                  borderWidth: 2,
                  color: '#fff',
                  borderColor: '#fff',
                  '&:hover': { borderWidth: 2, bgcolor: 'rgba(255,255,255,0.1)' },
                }}
                onClick={() => {
                  const section = document.getElementById('clinics-section');
                  if (section) section.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Doc Appointment
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}



export default HeroSection;
