import React from 'react';
import { Typography, Box } from '@mui/material';
import HealingIcon from '@mui/icons-material/Healing';

function Logo() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: 999,
          bgcolor: 'background.default',
          display: 'grid',
          placeItems: 'center',
          border: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <HealingIcon sx={{ color: 'primary.main', fontSize: 20 }} />
      </Box>

      <Typography
        variant="h6"
        component="a"
        href="/"
        sx={{
          color: 'text.primary',
          fontWeight: 800,
          textDecoration: 'none',
          letterSpacing: '-0.02em',
        }}
      >
        icure Physiotherapy
      </Typography>
    </Box>
  );
}

export default Logo;
