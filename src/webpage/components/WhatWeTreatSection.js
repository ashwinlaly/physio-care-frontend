import React from 'react';
import { Box, Container, Typography, Stack } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

function ListCard({ title, items }) {
  return (
    <Box
      sx={{
        height: '100%',
        borderRadius: 6,
        border: '1px solid rgba(11,61,51,0.18)',
        bgcolor: 'rgba(44,122,107,0.10)',
        boxShadow: '0 14px 30px rgba(0,0,0,0.05)',
        px: { xs: 2.5, md: 3.5 },
        py: { xs: 3, md: 3.5 },
      }}
    >
      <Typography
        sx={{
          textAlign: 'center',
          fontWeight: 900,
          color: 'primary.main',
          fontSize: { xs: 24, md: 28 },
          mb: 2.5,
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          position: 'relative',
        }}
      >
        <Stack spacing={2.2}>
          {items.map((it) => (
            <Stack key={it} direction="row" spacing={1.4} alignItems="flex-start">
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  bgcolor: 'primary.main',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: '0 0 auto',
                  mt: '1px',
                }}
              >
                <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
              </Box>
              <Typography
                sx={{
                  color: 'primary.main',
                  fontSize: 16,
                  lineHeight: 1.7,
                  fontWeight: 500,
                }}
              >
                {it}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

function WhatWeTreatSection() {
  return (
    <Box id="treat-section" sx={{ py: { xs: 7, md: 9 }, bgcolor: '#fff' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 900, color: 'primary.main' }}>
          WHAT WE TREAT
        </Typography>
        <Typography
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            mt: 1.5,
            mb: { xs: 4, md: 6 },
            maxWidth: 880,
            mx: 'auto',
            lineHeight: 1.8,
          }}
        >
          We provide specialized physiotherapy treatments for neurological, orthopedic, musculoskeletal, pediatric, geriatric, and sports–related conditions — addressing a wide range of symptoms and recovery needs.
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 3, md: 3.5 },
          }}
        >
          <ListCard
            title="Chronic Pain Conditions"
            items={[
              'Back Pain',
              'Neck Pain',
              'Shoulder Pain',
              'Knee Pain',
              'Strain and Sprain',
              'Arthritic Pain',
              'Joint Pain',
              'Nerve Pain',
            ]}
          />
          <ListCard
            title="Symptoms"
            items={[
              'Muscle Stiffness',
              'Muscle Spasm',
              'Crepitus – Cracking Joints',
              'Numbness And Tingling',
              'Neck Pain',
              'Joint Pain',
              'Reduced Range Of Motion',
              'Postural Imbalance',
            ]}
          />
          <ListCard
            title="Rehabilitation"
            items={[
              'Geriatric Rehab',
              'Pediatric Rehab',
              'Sports Rehab',
              'Post Operative Rehab',
              'Posture Correction Rehab',
              'Soft Tissue Rehab',
              'Cardiac Rehab',
              'Pre And Post-Natal Rehab',
            ]}
          />
          <ListCard
            title="Neuro Rehabilitation"
            items={[
              'Stroke',
              'Parkinsons',
              'Spinal Cord Injury',
              'Brain Injury',
              'Bell\'s/Facial Palsy',
              'Nerve Injury',
              'Paralysis',
              'Gait And Balance Disorders',
            ]}
          />
        </Box>
      </Container>
    </Box>
  );
}

export default WhatWeTreatSection;
