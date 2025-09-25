import React from 'react';
import { Typography, Box } from '@mui/material';
import HealingIcon from '@mui/icons-material/Healing'; // Example icon

function Logo() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
      <HealingIcon sx={{ color: 'white', fontSize: 30, mr: 1, bgcolor: 'primary.main', p: 0.5, borderRadius: 1 }} />
      <Typography variant="h6" component="a" href="/" 
        sx={{ 
          color: 'white', 
          fontWeight: 'bold', 
          textDecoration: 'none',
          fontSize: { xs: '1.1rem', md: '1.25rem' } 
        }}>
        Icure Physiotherapy
      </Typography>
    </Box>
  );
}

export default Logo;
