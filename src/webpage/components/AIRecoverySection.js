import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Avatar,
  useTheme,
} from '@mui/material';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import TrackChangesOutlinedIcon from '@mui/icons-material/TrackChangesOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';

const steps = [
  {
    key: 'ASSESS',
    title: 'ASSESS\n(INITIAL EVALUATION)',
    icon: <AssessmentOutlinedIcon />,
    body:
      'A guided assessment collects your profile and symptoms to understand what you need and where to begin.',
  },
  {
    key: 'PLAN',
    title: 'PLAN\n(PERSONALIZED GOALS)',
    icon: <ChecklistOutlinedIcon />,
    body:
      'We create a personalized plan with measurable goals so you always know what to do and why it matters.',
  },
  {
    key: 'TRACK',
    title: 'TRACK\n(PROGRESS)',
    icon: <TrackChangesOutlinedIcon />,
    body:
      'Track daily sessions and outcomes. Your plan can be adjusted based on your consistency and recovery signals.',
  },
  {
    key: 'ADVANCE',
    title: 'ADVANCE\n(RECOVERY)',
    icon: <TrendingUpOutlinedIcon />,
    body:
      'Graduate to the next level with clear milestones and confidence—guided support at every step.',
  },
];

function AIRecoverySection() {
  const theme = useTheme();

  return (
    <Box
      id="recovery-section"
      sx={{
        py: { xs: 7, md: 9 },
        bgcolor: '#fff',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          sx={{
            textAlign: 'center',
            fontWeight: 900,
            color: 'primary.main',
            mb: { xs: 4, md: 6 },
          }}
        >
          Precision Recovery
        </Typography>

        <Box sx={{ position: 'relative' }}>
          {/* dotted connector (hidden on mobile) */}
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              position: 'absolute',
              left: 0,
              right: 0,
              top: 38,
              borderTop: '2px dotted rgba(11,61,51,0.25)',
            }}
          />

          <Grid container spacing={{ xs: 4, md: 4 }}>
            {steps.map((s) => (
              <Grid key={s.key} item xs={12} md={3}>
                <Stack alignItems="center" spacing={2}>
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor: 'rgba(44, 122, 107, 0.65)',
                      color: theme.palette.primary.main,
                      border: '1px solid rgba(11,61,51,0.20)',
                    }}
                  >
                    {React.cloneElement(s.icon, { fontSize: 'medium' })}
                  </Avatar>

                  <Typography
                    sx={{
                      textAlign: 'center',
                      fontWeight: 900,
                      whiteSpace: 'pre-line',
                      letterSpacing: '0.02em',
                      color: 'primary.main',
                    }}
                  >
                    {s.title}
                  </Typography>

                  <Typography
                    sx={{
                      textAlign: 'center',
                      color: 'text.secondary',
                      fontSize: 13.5,
                      lineHeight: 1.7,
                      maxWidth: 260,
                    }}
                  >
                    {s.body}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default AIRecoverySection;
