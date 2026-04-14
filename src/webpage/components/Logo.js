import React from 'react';
import { Typography, Box } from '@mui/material';

function Logo() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, cursor: 'pointer' }}>
      <Box
        component="img"
        src="/images/logoimg.png"
        alt="iCure logo"
        sx={{
          width: 44,
          height: 44,
          objectFit: 'contain',
          display: 'block',
        }}
      />

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
       icure Physiotheraphy
      </Typography>
    </Box>
  );
}

export default Logo;
