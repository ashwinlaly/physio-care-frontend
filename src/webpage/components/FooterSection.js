import React from 'react';
import { Box, Typography, Stack, Link } from '@mui/material';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import PhoneIcon from '@mui/icons-material/Phone';

function FooterSection() {
  return (
    <Box component="footer" sx={{ width: '100%' }}>
      {/* Top city strip */}
      {/* <Box
        sx={{
          bgcolor: '#EAF3F1',
          borderTop: '1px solid rgba(18,63,57,0.04)',
          borderBottom: '1px solid rgba(18,63,57,0.04)',
        }}
      >
        <Box
          sx={{
            maxWidth: '1200px',
            mx: 'auto',
            px: { xs: 2, md: '56px' },
            py: { xs: 2, md: '16px' },
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: { xs: 'center', md: 'space-between' },
            gap: { xs: 1.5, md: 2 },
          }}
        >
         
        </Box>
      </Box> */}

      {/* Main footer */}
      <Box
        sx={{
          bgcolor: '#123F39',
          color: '#fff',
        }}
      >
        <Box
          sx={{
            maxWidth: '1200px',
            mx: 'auto',
            px: { xs: 3, sm: 4, md: '56px' },
            pt: { xs: 6, md: '78px' },
            pb: { xs: 6, md: '82px' },
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: '290px 1fr 180px 180px',
              },
              columnGap: { md: '48px' },
              rowGap: { xs: 5, md: 0 },
              alignItems: 'start',
            }}
          >
            {/* Left branding */}
            <Box>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  color: '#fff',
                  mb: { xs: 3, md: '28px' },
                  whiteSpace: 'nowrap',
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '0.5rem', sm: '0.3rem', md: '2rem' },
                    fontWeight: 800,
                    fontFamily: '"DM Sans", sans-serif',
                    lineHeight: 0.82,
                    letterSpacing: '-0.08em',
                    // textTransform: 'uppercase',
                    mr: { xs: 1.5, md: 2.25 },
                  }}
                >
                  iCURE
                </Typography>

                <Box
                  sx={{
                    width: '2px',
                    height: { xs: '10px', sm: '22px', md: '48px' },
                    bgcolor: '#fff',
                    opacity: 0.95,
                    mr: { xs: 1.5, md: 2.25 },
                    flexShrink: 0,
                  }}
                />

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: '0.5rem', sm: '0.3rem', md: '2rem' },
                      fontWeight: 800,
                      fontFamily: '"DM Sans", sans-serif',
                      lineHeight: 0.9,
                      letterSpacing: '-0.05em',
                      textTransform: 'uppercase',
                    }}
                  >
                    PHYSIO
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: { xs: '0.2rem', sm: '0.1rem', md: '1.5rem' },
                      fontWeight: 800,
                      fontFamily: '"DM Sans", sans-serif',
                      lineHeight: 0.9,
                      letterSpacing: '-0.05em',
                      textTransform: 'uppercase',
                    }}
                  >
                    THERAPY
                  </Typography>
                </Box>
              </Box>

              <Typography
                sx={{
                  fontSize: { xs: 14, md: 14 },
                  lineHeight: 1.8,
                  color: 'rgba(255,255,255,0.88)',
                  maxWidth: '235px',
                }}
              >
                New-age physio care delivering high-quality personalized treatments by seamlessly integrating clinic, home & tele-rehab.
              </Typography>
            </Box>

            {/* Spacer column to match layout */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }} />

            {/* More Services */}
            <Box>
              <Typography
                sx={{
                  fontSize: { xs: 24, md: 18 },
                  fontWeight: 700,
                  lineHeight: 1.2,
                  mb: { xs: 2.5, md: '22px' },
                }}
              >
                More Services
              </Typography>

              <Stack spacing={{ xs: 2, md: '16px' }}>
                <Link
                  href="#"
                  underline="none"
                  color="inherit"
                  sx={{
                    fontSize: { xs: 17, md: 15 },
                    lineHeight: 1.4,
                    color: 'rgba(255,255,255,0.95)',
                  }}
                >
                  About Us
                </Link>

                <Link
                  href="#"
                  underline="none"
                  color="inherit"
                  sx={{
                    fontSize: { xs: 17, md: 15 },
                    lineHeight: 1.4,
                    color: 'rgba(255,255,255,0.95)',
                  }}
                >
                  Blog
                </Link>

                <Link
                  href="#"
                  underline="none"
                  color="inherit"
                  sx={{
                    fontSize: { xs: 17, md: 15 },
                    lineHeight: 1.4,
                    color: 'rgba(255,255,255,0.95)',
                  }}
                >
                  For Physiotherapists
                </Link>
              </Stack>
            </Box>

            {/* Contact */}
            <Box>
              <Typography
                sx={{
                  fontSize: { xs: 24, md: 18 },
                  fontWeight: 700,
                  lineHeight: 1.2,
                  mb: { xs: 2.5, md: '22px' },
                }}
              >
                Contact
              </Typography>

              <Stack spacing={1.5}>
                <Box
                  component="a"
                  href="mailto:icurephysiotherapy@gmail.com"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'rgba(255,255,255,0.95)',
                    textDecoration: 'none',
                    '&:hover': { opacity: 0.9 },
                  }}
                >
                  <MailOutlineRoundedIcon sx={{ fontSize: 15 }} />
                  <Typography
                    sx={{
                      fontSize: { xs: 15, md: 14 },
                      lineHeight: 1.5,
                      color: 'inherit',
                    }}
                  >
                    icurephysiotherapy@gmail.com
                  </Typography>
                </Box>

                <Box
                  component="a"
                  href="tel:6369929275"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'rgba(255,255,255,0.95)',
                    textDecoration: 'none',
                    '&:hover': { opacity: 0.9 },
                  }}
                >
                  <PhoneIcon sx={{ fontSize: 15 }} />
                  <Typography
                    sx={{
                      fontSize: { xs: 15, md: 14 },
                      lineHeight: 1.5,
                      color: 'inherit',
                    }}
                  >
                    +91 63699 29275
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* Bottom bar */}
        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Box
            sx={{
              maxWidth: '1200px',
              mx: 'auto',
              px: { xs: 3, sm: 4, md: '56px' },
              py: { xs: 2.25, md: '17px' },
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              gap: 1.5,
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: 13, md: 14 },
                lineHeight: 1.5,
                color: 'rgba(255,255,255,0.92)',
              }}
            >
              Copyright © {new Date().getFullYear()} icure Physiotherapy Pvt. Ltd. All Rights Reserved.
            </Typography>

            <Link
              href="#"
              underline="none"
              color="inherit"
              sx={{
                fontSize: { xs: 13, md: 14 },
                lineHeight: 1.5,
                color: 'rgba(255,255,255,0.92)',
                whiteSpace: 'nowrap',
              }}
            >
              Terms And Conditions
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default FooterSection;
