import React from 'react';
import { Button } from '@mui/material';

function CallToActionGradientButton({ text, icon, fullWidth, sx, ...props }) {
  return (
    <Button
      variant="contained"
      startIcon={icon}
      fullWidth={fullWidth}
      sx={{
        textTransform: 'none',
        fontSize: '1.1rem',
        px: 4,
        py: 1.5,
        borderRadius: 2,
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', // Gradient color
        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
        color: 'white',
        '&:hover': {
          background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)', // Slightly darker gradient on hover
          boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .5)',
        },
        ...sx // Allow custom sx overrides
      }}
      {...props}
    >
      {text}
    </Button>
  );
}

export default CallToActionGradientButton;
