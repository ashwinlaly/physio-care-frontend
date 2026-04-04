import React from 'react';
import { Button, Stack, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function Navigation() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const pageMenuOpen = Boolean(anchorEl);

  const handleScroll = (target) => {
    const section = document.getElementById(target);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Button onClick={() => handleScroll('home-section')} sx={{ color: 'text.primary' }}>
        Home
      </Button>
      <Button onClick={() => handleScroll('services-section')} sx={{ color: 'text.primary' }}>
        Services
      </Button>
      <Button onClick={() => handleScroll('blog-section')} sx={{ color: 'text.primary' }}>
        Blog
      </Button>

      <Menu anchorEl={anchorEl} open={pageMenuOpen} onClose={() => setAnchorEl(null)}>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            handleScroll('blog-section');
          }}
        >
          Blog
        </MenuItem>
      </Menu>
    </Stack>
  );
}

export default Navigation;
