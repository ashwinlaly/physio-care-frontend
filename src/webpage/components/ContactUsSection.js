import React from 'react';
import {
  Box,
  Typography,
  Container,
  Stack,
  IconButton,
  Button,
  Link,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import StarIcon from '@mui/icons-material/Star';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

function InfoRow({ icon: Icon, children, href }) {
  const content = href ? (
    <Link
      href={href}
      underline="none"
      sx={{
        color: 'rgba(255,255,255,0.92)',
        fontSize: { xs: 15, md: 17 },
        lineHeight: 1.7,
        '&:hover': {
          color: '#fff',
        },
      }}
    >
      {children}
    </Link>
  ) : (
    <Typography
      sx={{
        color: 'rgba(255,255,255,0.92)',
        fontSize: { xs: 15, md: 17 },
        lineHeight: 1.7,
      }}
    >
      {children}
    </Typography>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
      }}
    >
      <Icon
        sx={{
          color: '#fff',
          fontSize: 18,
          mt: '6px',
          flexShrink: 0,
        }}
      />
      <Box>{content}</Box>
    </Box>
  );
}

function ContactUsSection() {
  return (
    <Box
      id="contact-section"
      sx={{
        bgcolor: '#EEF6F3',
        pt: { xs: 8, md: 10 },
        pb: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: '56px' } }}>
        {/* Top heading */}
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 6 } }}>
          <Typography
            sx={{
              color: '#123F39',
              fontWeight: 900,
              fontSize: { xs: '2rem', sm: '2.7rem', md: '3.6rem' },
              lineHeight: 1,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              mb: 2,
            }}
          >
            Contact Us
          </Typography>

          <Typography
            sx={{
              maxWidth: '980px',
              mx: 'auto',
              color: '#33413F',
              fontSize: { xs: 14.5, md: 17 },
              lineHeight: 1.8,
            }}
          >
            Get in touch with our clinic for expert physiotherapy care, appointment booking,
            recovery guidance, and personalized treatment support.
          </Typography>
        </Box>

        {/* Main split card */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.08fr 0.92fr' },
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            bgcolor: '#123F39',
          }}
        >
          {/* Left side - Google map */}
          <Box
            sx={{
              minHeight: { xs: 360, sm: 430, md: 560 },
              bgcolor: '#dfe7e2',
            }}
          >
            <Box
              component="iframe"
              src="https://maps.google.com/maps?q=iCure+Physiotherapy+clinic%2C1st+Floor%2C+Podhigai+Shopping+Centre%2C+No-5c%2C+Vadavalli-Thondamuthur+Rd%2C+Marutha+Nagar%2C+Vadavalli%2C+Coimbatore%2C+Tamil+Nadu+641041&t=&z=13&ie=UTF8&iwloc=&output=embed"
              title="iCure Physiotherapy Map"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              sx={{
                width: '100%',
                height: '100%',
                minHeight: { xs: 360, sm: 430, md: 560 },
                border: 0,
                display: 'block',
              }}
            />
          </Box>

          {/* Right side - clinic details */}
          <Box
            sx={{
              bgcolor: '#123F39',
              color: '#fff',
              px: { xs: 3, sm: 4, md: 5 },
              py: { xs: 4, md: 5 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: { xs: '1.8rem', sm: '2.1rem', md: '2.35rem' },
                lineHeight: 1.12,
                // textTransform: 'uppercase',
                mb: 1.5,
              }}
            >
              iCURE PHYSIOTHERAPY CLINIC
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{ mb: 1.25, flexWrap: 'wrap' }}
            >
              <Typography sx={{ color: '#fff', fontSize: { xs: 14, md: 16 } }}>
                4.9
              </Typography>

              <Stack direction="row" spacing={0.2}>
                {[1, 2, 3, 4, 5].map((item) => (
                  <StarIcon
                    key={item}
                    sx={{
                      color: '#FFC83D',
                      fontSize: { xs: 16, md: 18 },
                    }}
                  />
                ))}
              </Stack>

              <Typography
                sx={{
                  color: '#FFC83D',
                  fontSize: { xs: 14, md: 16 },
                }}
              >
                (18)
              </Typography>
            </Stack>

            <Typography
              sx={{
                color: '#fff',
                fontSize: { xs: 16, md: 18 },
                lineHeight: 1.6,
                mb: 3,
              }}
            >
              Ortho, Spine & Sports Physiotherapy Center
            </Typography>

            <Stack spacing={2.25}>
              <InfoRow icon={LocationOnIcon}>
                1st Floor, Podhigai Shopping Centre, No-5c, Vadavalli-Thondamuthur Rd,
                Marutha Nagar, Vadavalli, Coimbatore, Tamil Nadu 641041
              </InfoRow>

              <InfoRow icon={PhoneIcon} href="tel:6369929275">
                +91 63699 29275
              </InfoRow>

              <InfoRow icon={EmailIcon} href="mailto:icurephysiotherapy@gmail.com">
                icurephysiotherapy@gmail.com
              </InfoRow>

              <InfoRow icon={AccessTimeIcon}>
                Opening Hours: Monday - Friday 8am to 7pm, Saturday 9am to 5pm
              </InfoRow>
            </Stack>

            {/* Social icons */}
            <Stack direction="row" spacing={1} sx={{ mt: 4 }}>
              <IconButton
                component="a"
                href="#"
                sx={{
                  color: '#fff',
                  p: 0.5,
                  '&:hover': {
                    bgcolor: 'transparent',
                    color: '#dcefe9',
                  },
                }}
              >
                <FacebookIcon />
              </IconButton>

              <IconButton
                component="a"
                href="#"
                sx={{
                  color: '#fff',
                  p: 0.5,
                  '&:hover': {
                    bgcolor: 'transparent',
                    color: '#dcefe9',
                  },
                }}
              >
                <InstagramIcon />
              </IconButton>

              <IconButton
                component="a"
                href="#"
                sx={{
                  color: '#fff',
                  p: 0.5,
                  '&:hover': {
                    bgcolor: 'transparent',
                    color: '#dcefe9',
                  },
                }}
              >
                <LinkedInIcon />
              </IconButton>
            </Stack>

            {/* Action buttons */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              sx={{ mt: 4 }}
            >
              <Button
                variant="contained"
                href="tel:6369929275"
                startIcon={<PhoneIcon />}
                sx={{
                  bgcolor: '#fff',
                  color: '#123F39',
                  fontWeight: 700,
                  px: 2.5,
                  py: 1.2,
                  borderRadius: 999,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: '#f2f2f2',
                    boxShadow: 'none',
                  },
                }}
              >
                Call Now
              </Button>

              <Button
                variant="outlined"
                href="https://wa.me/6369929275"
                target="_blank"
                startIcon={<WhatsAppIcon />}
                sx={{
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.6)',
                  fontWeight: 700,
                  px: 2.5,
                  py: 1.2,
                  borderRadius: 999,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#fff',
                    bgcolor: 'rgba(255,255,255,0.08)',
                  },
                }}
              >
                WhatsApp Us
              </Button>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default ContactUsSection;
