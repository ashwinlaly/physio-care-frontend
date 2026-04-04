import React from 'react';
import { Box, Typography, Grid, Container, Stack } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';

function FeatureItem({ icon, title, description }) {
  return (
    <Stack direction="row" spacing={2} sx={{ color: '#fff' }}>
      <Box
        sx={{
          width: 46,
          height: 46,
          borderRadius: 3,
          bgcolor: '#F6EFE7',
          display: 'grid',
          placeItems: 'center',
          flex: '0 0 auto',
        }}
      >
        {React.cloneElement(icon, { sx: { color: '#2680c8' } })}
      </Box>

      <Box>
        <Typography sx={{ fontWeight: 900, fontSize: 16, lineHeight: 1.2 }}>
          {title}
        </Typography>
        <Typography sx={{ mt: 0.75, color: 'rgba(255,255,255,0.80)', fontSize: 13.5, lineHeight: 1.6 }}>
          {description}
        </Typography>
      </Box>
    </Stack>
  );
}

function ServicesSection() {
  return (
    <Box
      id="services-section"
      sx={{
        py: { xs: 4, md: 5 },
        bgcolor: '#2680c8',
        borderTop: '1px solid rgba(255,255,255,0.10)',
        borderBottom: '1px solid rgba(255,255,255,0.10)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 3, md: 4 }}>
          <Grid item xs={12} md={3}>
            <FeatureItem
              icon={<HomeOutlinedIcon />}
              title="Orthopedic Physiotherapy"
              description="Specialized treatment for musculoskeletal conditions and injuries."
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FeatureItem
              icon={<PersonOutlinedIcon />}
              title="Geriatric Physiotherapy"
              description="Comprehensive care for age-related mobility and health concerns."
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FeatureItem
              icon={<HotelOutlinedIcon />}
              title="Neuro Physiotherapy"
              description="Specialized rehabilitation for neurological conditions and disorders."
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FeatureItem
              icon={<VerifiedOutlinedIcon />}
              title="Pediatric Physiotherapy"
              description="Developmental and therapeutic care for children and adolescents."
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FeatureItem
              icon={<VerifiedOutlinedIcon />}
              title="Women's Health"
              description="Specialized physiotherapy addressing unique women's health needs."
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ServicesSection;
