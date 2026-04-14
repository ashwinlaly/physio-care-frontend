import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  IconButton,
} from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

function ClinicsSection() {
  return (
    <Box id="clinics-section" sx={{ py: { xs: 7, md: 9 }, bgcolor: '#fff' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{ textAlign: 'center', fontWeight: 900, color: 'primary.main' }}
        >
          ADVANCED PHYSIOTHERAPY CLINICS
        </Typography>
        <Typography
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            mt: 1.5,
            mb: { xs: 4, md: 6 },
            maxWidth: 820,
            mx: 'auto',
            lineHeight: 1.8,
          }}
        >
          Experience expert physiotherapy at our advanced clinic setup — equipped with modern facilities and specialists.
        </Typography>

        <Grid container spacing={{ xs: 3, md: 4 }} alignItems="stretch">
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: '0 18px 40px rgba(0,0,0,0.08)',
              }}
            >
              <Box
                component="img"
                src="/images/image1.png"
                alt="Clinic"
                sx={{ width: '100%', height: { xs: 260, md: 360 }, objectFit: 'cover', display: 'block' }}
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 4,
                bgcolor: 'primary.main',
                color: '#fff',
                boxShadow: '0 18px 40px rgba(0,0,0,0.12)',
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography sx={{ fontWeight: 900, fontSize: 14, letterSpacing: '0.12em', opacity: 0.9 }}>
                  icurePHYSIOTHERAPY GREATER
                  <Box component="span" sx={{ display: 'block' }}>
                    KAILASH
                  </Box>
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <StarRoundedIcon key={i} sx={{ fontSize: 18, color: '#E6C15A' }} />
                  ))}
                  <Typography sx={{ fontSize: 13.5, opacity: 0.95 }}>4.9 (2,000+)</Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
                  <LocationOnOutlinedIcon sx={{ fontSize: 18, opacity: 0.9 }} />
                  <Typography sx={{ fontSize: 13.5, opacity: 0.95 }}>
                    Arya Samaj Rd, Greater Kailash, New Delhi
                  </Typography>
                </Stack>

                <Typography sx={{ mt: 2.5, fontSize: 13.5, lineHeight: 1.8, opacity: 0.95 }}>
                  Open 9:00 AM to 8:00 PM • Walk-ins & appointments
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                  <IconButton size="small" sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: '#fff' }}>
                    <FacebookIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: '#fff' }}>
                    <InstagramIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: '#fff' }}>
                    <LinkedInIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ClinicsSection;
