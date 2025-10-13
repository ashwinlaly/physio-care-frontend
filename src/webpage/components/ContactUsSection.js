import React from 'react';
import { Box, Typography, Grid, Container, Button, Stack, IconButton, Card, CardContent, Link } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import CallToActionGradientButton from './CallToActionGradientButton';

// Reusable component for contact details
function ContactInfoItem({ icon: Icon, title, content }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
      <Icon sx={{ color: 'primary.main', fontSize: 24, mr: 2, mt: 0.5 }} />
      <Box sx={{ textAlign: 'left' }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 0.5 }}>
          {title}
        </Typography>
        {Array.isArray(content) ? (
          content.map((line, index) => (
            <Typography key={index} variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
              {line}
            </Typography>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
            {content}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

function ContactUsSection() {
  return (
    <Box sx={{ 
      py: { xs: 8, md: 12 }, 
      bgcolor: '#f5f7fa', 
      textAlign: 'center',
      pt: { xs: 10, md: 12 },
    }}
    id="contact-section"
    >
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" gutterBottom 
          sx={{ 
            fontWeight: 'bold', 
            color: 'primary.main', 
            mb: { xs: 2, md: 3 },
            fontSize: { xs: '2.5rem', md: '3.5rem' }
          }}>
          Contact Us
        </Typography>
        <Typography variant="h6" component="p" sx={{ 
          color: 'text.secondary', 
          mb: { xs: 6, md: 8 },
          maxWidth: 700,
          mx: 'auto',
          fontSize: { xs: '1rem', md: '1.25rem' }
        }}>
          Get in touch with our team to schedule your appointment or learn more about our services
        </Typography>

        <Grid container spacing={{ xs: 5, md: 8 }}>
          {/* Left Column: Get In Touch */}
          <Grid item size={6} xs={12} md={6}>
            <Box sx={{ textAlign: 'left', mb: { xs: 4, md: 0 } }}>
              <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
                Get In Touch
              </Typography>

              <ContactInfoItem 
                icon={LocationOnIcon} 
                title="Address" 
                content={['1st Floor, Podhigai Shopping Centre,', 'No-5c, Vadavalli-Thondamuthur Rd,', 'Marutha Nagar, Vadavalli,', 'Coimbatore, Tamil Nadu 641041']}
              />
              <ContactInfoItem 
                icon={PhoneIcon} 
                title="Phone"
                href="tel:7639991387"
                content="+91 7639991387"
              />
              <ContactInfoItem 
                icon={EmailIcon} 
                title="Email" 
                content="icurephysiotherapy@gmail.com"
              />
              <ContactInfoItem 
                icon={AccessTimeIcon} 
                title="Hours" 
                content={['Monday - Friday: 8:00 AM - 7:00 PM', 'Saturday: 9:00 AM - 5:00 PM', 'Sunday: Closed']} 
              />

              <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mt: 5, mb: 3 }}>
                Follow Us
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                <IconButton color="primary" sx={{ 
                  bgcolor: 'white', 
                  border: '1px solid #e0e0e0', 
                  '&:hover': { bgcolor: 'primary.main', color: 'white' } 
                }}>
                  <FacebookIcon />
                </IconButton>
                <IconButton color="primary" sx={{ 
                  bgcolor: 'white', 
                  border: '1px solid #e0e0e0', 
                  '&:hover': { bgcolor: 'primary.main', color: 'white' } 
                }}>
                  <InstagramIcon />
                </IconButton>
                <IconButton color="primary" sx={{ 
                  bgcolor: 'white', 
                  border: '1px solid #e0e0e0', 
                  '&:hover': { bgcolor: 'primary.main', color: 'white' } 
                }}>
                  <TwitterIcon />
                </IconButton>
              </Stack>

              <CallToActionGradientButton 
                text="Call Now for Appointment" 
                icon={<PhoneIcon />} 
                fullWidth 
                sx={{ mb: 2 }}
                href="tel:7639991387"
              />
              <Button 
                variant="contained" 
                fullWidth 
                sx={{ 
                  textTransform: 'none', 
                  fontSize: '1.1rem', 
                  py: 1.5, 
                  borderRadius: 2, 
                  bgcolor: 'white', 
                  color: 'primary.main',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                  '&:hover': {
                    bgcolor: '#f0f0f0',
                  }
                }}
                href="https://wa.me/7639991387"
                target="_blank"
              >
                WhatsApp Us
              </Button>
            </Box>
          </Grid>

          {/* Right Column: Find Us */}
          <Grid item size={6} xs={12} md={6}>
          <Box sx={{
            position: 'relative',
            textAlign: 'right',
            height: 560,
            width: 820,
            maxWidth: '100%',
            mx: 'auto',
            mb: 2,
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 2,
          }}>
            <Box sx={{
              overflow: 'hidden',
              background: 'none',
              height: 560,
              width: 820,
              maxWidth: '100%',
            }}>
              <iframe
                  width="100%"
                  height="560"
                  id="gmap_canvas"
                  src="https://maps.google.com/maps?q=iCure+Physiotherapy+clinic%2C1st+Floor%2C+Podhigai+Shopping+Centre%2C+No-5c%2C+Vadavalli-Thondamuthur+Rd%2C+Marutha+Nagar%2C+Vadavalli%2C+Coimbatore%2C+Tamil+Nadu+641041&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                  style={{ border: 0, borderRadius: '8px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Map"
              />
            </Box>
          </Box>
        </Grid>


        </Grid>
      </Container>
    </Box>
  );
}

export default ContactUsSection;
