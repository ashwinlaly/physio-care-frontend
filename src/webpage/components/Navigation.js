import React from 'react';
import { Button, Stack } from '@mui/material';

function Navigation() {
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Featured Blog', href: '/blog' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <Stack direction="row" spacing={4}>
      {navLinks.map((link) => (
        <Button 
          key={link.name} 
          href={link.href} 
          color="secondary" 
          sx={{ 
            textTransform: 'none', 
            fontSize: '1rem', 
            '&:hover': { 
              color: 'primary.light', // Lighter blue on hover
              bgcolor: 'transparent' 
            } 
          }}
        >
          {link.name}
        </Button>
      ))}
    </Stack>
  );
}

export default Navigation;
