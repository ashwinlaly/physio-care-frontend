import React from 'react';
import { Button, Stack } from '@mui/material';

function Navigation() {
  const navLinks = [
    { name: 'Home', target: 'home-section' },
    { name: 'Services', target: 'services-section' },
    { name: 'Featured Blog', target: 'blog-section' },
    { name: 'Contact Us', target: 'contact-section' },
  ];

  const handleScroll = (target) => {
    const section = document.getElementById(target);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
          onClick={() => handleScroll(link.target)}
        >
          {link.name}
        </Button>
      ))}
    </Stack>
  );
}

export default Navigation;
