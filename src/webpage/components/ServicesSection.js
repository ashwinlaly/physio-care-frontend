import React from 'react';
import { Box, Typography, Container, Stack } from '@mui/material';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LaptopMacOutlinedIcon from '@mui/icons-material/LaptopMacOutlined';

function FeatureItem({ icon, title, description }) {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ color: '#fff', minWidth: 0, alignItems: 'flex-start' }}
    >
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: 3,
          bgcolor: 'rgba(255,255,255,0.14)',
          display: 'grid',
          placeItems: 'center',
          flex: '0 0 auto',
        }}
      >
        {React.cloneElement(icon, { sx: { color: 'rgba(255,255,255,0.55)', fontSize: 26 } })}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{ fontWeight: 800, fontSize: { xs: 18, md: 20 }, lineHeight: 1.2 }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            mt: 0.75,
            color: 'rgba(255,255,255,0.90)',
            fontSize: { xs: 13.5, md: 14.5 },
            lineHeight: 1.5,
            maxWidth: 320,
          }}
        >
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
        py: { xs: 3.5, md: 4.5 },
        bgcolor: '#123F39',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
            rowGap: { xs: 3, md: 0 },
            alignItems: 'start',
          }}
        >
          <Box sx={{ pr: { md: 2.5 }, minWidth: 0 }}>
            <FeatureItem
              icon={<ApartmentOutlinedIcon />}
              title="Advanced Clinics"
              description="Modern Infrastructure, Latest Technology & Top Physiotherapy Experts"
            />
          </Box>

          <Box
            sx={{
              px: { md: 2.5 },
              borderLeft: { md: '1px solid rgba(255,255,255,0.14)' },
              borderRight: { md: '1px solid rgba(255,255,255,0.14)' },
              minWidth: 0,
            }}
          >
            <FeatureItem
              icon={<HomeOutlinedIcon />}
              title="Professional Home Care"
              description="Physiotherapy at home with expert oversight & Strong quality checks"
            />
          </Box>

          <Box sx={{ pl: { md: 2.5 }, minWidth: 0 }}>
            <FeatureItem
              icon={<LaptopMacOutlinedIcon />}
              title="Tele / Remote Rehab"
              description="Personalized Physio exercises at home with Continuous guidance & mentoring"
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default ServicesSection;
