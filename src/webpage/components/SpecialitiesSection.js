import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';

const sectionBg = '#EEF7F5';
const sectionBgRgb = '238, 247, 245';

const items = [
  {
    title: 'Orthopedic Physiotherapy',
    image: '/images/ortho.jpg',
  },
  {
    title: 'Geriatric Physiotherapy',
    image: '/images/geriatrichealth1.jpg',
  },
  {
    title: 'Neuro Physiotherapy',
    image: '/images/neuro.jpg',
  },
  {
    title: 'Pediatric Physiotherapy',
    image: '/images/pediahealth.png',
  },
  {
    title: "Women's Health",
    image: '/images/womenhealth.png',
  },
];

function SpecialityCard({ title, image }) {
  return (
    <Card
      sx={{
        width: { xs: 250, sm: 280, md: 320 },
        borderRadius: 6,
        overflow: 'hidden',
        boxShadow: 'none',
        bgcolor: 'transparent',
        flex: '0 0 auto',
      }}
    >
      <Box
        sx={{
          borderRadius: 6,
          overflow: 'hidden',
          bgcolor: 'rgba(255,255,255,0.85)',
          border: '1px solid rgba(11,61,51,0.10)',
        }}
      >
        <CardMedia
          component="img"
          image={image}
          alt={title}
          sx={{
            height: { xs: 280, sm: 310, md: 340 },
            objectFit: 'cover',
          }}
        />
      </Box>
      <CardContent sx={{ p: 2, pb: 0 }}>
        <Typography
          sx={{
            fontWeight: 900,
            color: 'primary.main',
            textAlign: 'center',
            fontSize: { xs: 15, md: 16 },
          }}
        >
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}

function SpecialitiesSection() {
  const trackItems = [...items, ...items];

  return (
    <Box
      id="specialities-section"
      sx={{
        py: { xs: 7, md: 9 },
        bgcolor: sectionBg,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          sx={{ textAlign: 'center', fontWeight: 900, color: 'primary.main' }}
        >
          iCure Specialities
        </Typography>

        <Typography
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            mt: 1.5,
            mb: { xs: 4, md: 6 },
            maxWidth: 760,
            mx: 'auto',
            lineHeight: 1.8,
          }}
        >
          iCure Physiotherapy offers a range of physiotherapy services with experienced specialists and modern care.
        </Typography>

        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            px: { xs: 0, md: 1 },
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: { xs: 24, md: 56 },
              background: `linear-gradient(90deg, rgba(${sectionBgRgb},1), rgba(${sectionBgRgb},0))`,
              zIndex: 1,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: { xs: 24, md: 56 },
              background: `linear-gradient(270deg, rgba(${sectionBgRgb},1), rgba(${sectionBgRgb},0))`,
              zIndex: 1,
            },
            '@keyframes cbMarquee': {
              '0%': { transform: 'translateX(0)' },
              '100%': { transform: 'translateX(-50%)' },
            },
            '@media (prefers-reduced-motion: reduce)': {
              '& .cb-marquee-track': { animation: 'none' },
            },
          }}
        >
          <Box
            className="cb-marquee-track"
            sx={{
              display: 'flex',
              gap: { xs: 3, md: 4 },
              width: 'fit-content',
              animation: 'cbMarquee 26s linear infinite',
              willChange: 'transform',
              pr: { xs: 3, md: 4 },
            }}
          >
            {trackItems.map((it, idx) => (
              <SpecialityCard
                key={`${it.title}-${idx}`}
                title={it.title}
                image={it.image}
              />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default SpecialitiesSection;
