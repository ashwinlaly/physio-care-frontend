import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function StatCard({ bgImage, value, label }) {
  return (
    <Card
      sx={{
        borderRadius: 5,
        overflow: 'hidden',
        height: { xs: 110, sm: 120, md: 130 }, // ✅ increased size
        boxShadow: '0 10px 25px rgba(0,0,0,0.10)',
      }}
    >
      <Box
        sx={{
          height: '100%',
          backgroundImage: `url('${bgImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(0,0,0,0.55), rgba(0,0,0,0.10))',
          }}
        />
        <Box
          sx={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            px: { xs: 2, md: 2.5 }, // ✅ slightly more padding
          }}
        >
          <Box>
            <Typography
              sx={{
                color: '#fff',
                fontWeight: 900,
                fontSize: { xs: 24, md: 28 }, // ✅ bigger number
                lineHeight: 1.05,
              }}
            >
              {value}
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: { xs: 13, md: 14 }, // ✅ bigger label
              }}
            >
              {label}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}

function HeroSection() {
  return (
    <Box
      id="home-section"
      sx={{
        pt: { xs: 14, md: 16 }, // leave room for fixed pill header
        pb: { xs: 6, md: 8 },
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
          {/* Left */}
          <Grid item xs={12} md={6}>
            <Typography variant="h2" sx={{ fontSize: { xs: 18, md: 25 }, lineHeight: 1.05, color: 'primary.main' }}>
              Restoring Movement
              <Box component="span" sx={{ display: 'block', color: 'primary.main' }}>
                Enhancing Lives Easier Without Limit
              </Box>
            </Typography>

            <Typography
              sx={{
                mt: 2.5,
                maxWidth: 520,
                color: 'text.secondary',
                fontSize: 15.5,
                lineHeight: 1.8,
              }}
            >
              Professional physiotherapy services with personalized care for optimal recovery and wellness
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mt: 4 }} alignItems="center">
              <Button
                variant="contained"
                color="primary"
                endIcon={<ArrowForwardIcon />}
                sx={{ px: 3.2, py: 1.35, boxShadow: 'none' }}
                onClick={() => {
                  const section = document.getElementById('contact-section');
                  if (section) section.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Book an Appoinment
              </Button>
            </Stack>

            {/* Review row */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 5 }}>
              <Stack direction="row" spacing={-0.75}>
                <Avatar src="/images/review-1.jpg" sx={{ width: 34, height: 34, border: '2px solid #fff' }} />
                <Avatar src="/images/review-2.jpg" sx={{ width: 34, height: 34, border: '2px solid #fff' }} />
                <Avatar src="/images/review-3.jpg" sx={{ width: 34, height: 34, border: '2px solid #fff' }} />
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    border: '2px solid #fff',
                    bgcolor: 'primary.main',
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  2k+
                </Avatar>
              </Stack>

              <Box>
                <Stack direction="row" spacing={1} alignItems="baseline">
                  <Typography sx={{ fontWeight: 900, fontSize: 20, color: '#000000' }}>4.5</Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: 16, color: '#000000'  }}>Review</Typography>
                </Stack>
                <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>Satisfied Patients</Typography>
              </Box>
            </Stack>
          </Grid>

          {/* Right */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative' }}>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={12}>
                  <StatCard bgImage="/images/image1.png" value="2.5K+" label="Patient Helped" />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <StatCard bgImage="/images/image2.png" value="2019" label="Since Launch" />
                </Grid>
              </Grid>

              {/* Main image card */}
              <Card
                sx={{
                  borderRadius: 6,
                  overflow: 'hidden',
                  boxShadow: '0 18px 45px rgba(0,0,0,0.12)',
                }}
              >
                <Box
                  component="img"
                  src="/images/image3.png"
                  alt="Physiotherapy session"
                  sx={{
                    width: '100%',
                    height: { xs: 320, sm: 380, md: 420 },
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />

                {/* Quote pill */}
                <CardContent
                  sx={{
                    position: 'absolute',
                    mt: -8,
                    ml: 8,
                    bgcolor: '#fff',
                    borderRadius: 999,
                    px: 2,
                    py: 0,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.10)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    // margin : '0 0px 0 0'
                  }}
                >
                  <Typography sx={{ fontSize: 13.5, color: 'text.primary', fontWeight: 700 }}>
                    Move Better. Live Better.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default HeroSection;
