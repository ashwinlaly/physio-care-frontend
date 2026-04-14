import React from 'react';
import { Button, Stack, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function Navigation() {
  const [offeringsEl, setOfferingsEl] = React.useState(null);
  const offeringsOpen = Boolean(offeringsEl);

  const [educationEl, setEducationEl] = React.useState(null);
  const educationOpen = Boolean(educationEl);

  const [whyEl, setWhyEl] = React.useState(null);
  const whyOpen = Boolean(whyEl);

  const handleScroll = (target) => {
    const section = document.getElementById(target);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  const menuPaperSx = {
    mt: 1,
    borderRadius: 2,
    bgcolor: 'rgba(44,122,107,0.78)',
    color: '#fff',
    boxShadow: '0 14px 30px rgba(0,0,0,0.22)',
    border: '1px solid rgba(255,255,255,0.16)',
    minWidth: 220,
  };

  const menuListSx = {
    py: 0.75,
  };

  const menuItemSx = {
    color: '#fff',
    fontWeight: 600,
    px: 2.5,
    py: 1.15,
    mx: 0,
    borderRadius: 0,
    '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
    '&.Mui-selected': { bgcolor: 'rgba(255,255,255,0.16)' },
    '&.Mui-selected:hover': { bgcolor: 'rgba(255,255,255,0.18)' },
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Button onClick={() => handleScroll('home-section')} sx={{ color: 'text.primary', fontWeight: 700 }}>
        Home
      </Button>

      <Button onClick={() => handleScroll('recovery-section')} sx={{ color: 'text.primary', fontWeight: 700 }}>
        About Us
      </Button>

      <Button
        onClick={(e) => setOfferingsEl(e.currentTarget)}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{ color: 'text.primary', fontWeight: 700 }}
      >
        Our Offerings
      </Button>
      <Menu
        anchorEl={offeringsEl}
        open={offeringsOpen}
        onClose={() => setOfferingsEl(null)}
        slotProps={{ paper: { sx: menuPaperSx } }}
        MenuListProps={{ sx: menuListSx }}
      >
        <MenuItem
          sx={menuItemSx}
          onClick={() => {
            setOfferingsEl(null);
            handleScroll('specialities-section');
          }}
        >
          Specialities
        </MenuItem>
        <MenuItem
          sx={menuItemSx}
          onClick={() => {
            setOfferingsEl(null);
            handleScroll('treat-section');
          }}
        >
          What We Treat
        </MenuItem>
      </Menu>

      <Button
        onClick={(e) => setEducationEl(e.currentTarget)}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{ color: 'text.primary', fontWeight: 700 }}
      >
        Patient Education
      </Button>
      <Menu
        anchorEl={educationEl}
        open={educationOpen}
        onClose={() => setEducationEl(null)}
        slotProps={{ paper: { sx: menuPaperSx } }}
        MenuListProps={{ sx: menuListSx }}
      >
        <MenuItem
          sx={menuItemSx}
          onClick={() => {
            setEducationEl(null);
            handleScroll('blog-section');
          }}
        >
          Latest Blogs
        </MenuItem>
        <MenuItem
          sx={menuItemSx}
          onClick={() => {
            setEducationEl(null);
            handleScroll('faq-section');
          }}
        >
          FAQ
        </MenuItem>
      </Menu>

      <Button
        onClick={(e) => setWhyEl(e.currentTarget)}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{ color: 'text.primary', fontWeight: 700 }}
      >
        Why We?
      </Button>
      <Menu
        anchorEl={whyEl}
        open={whyOpen}
        onClose={() => setWhyEl(null)}
        slotProps={{ paper: { sx: menuPaperSx } }}
        MenuListProps={{ sx: menuListSx }}
      >
        <MenuItem
          sx={menuItemSx}
          onClick={() => {
            setWhyEl(null);
            handleScroll('experts-section');
          }}
        >
          Experts
        </MenuItem>
        <MenuItem
          sx={menuItemSx}
          onClick={() => {
            setWhyEl(null);
            handleScroll('clinics-section');
          }}
        >
          Clinics
        </MenuItem>
      </Menu>
    </Stack>
  );
}

export default Navigation;
