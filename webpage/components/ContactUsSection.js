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
      textAlign: 'center' 
    }}>
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
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'left', mb: { xs: 4, md: 0 } }}>
              <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
                Get In Touch
              </Typography>

              <ContactInfoItem 
                icon={LocationOnIcon} 
                title="Address" 
                content={['123 Health Street', 'Medical City, MC 12345', 'United States']} 
              />
              <ContactInfoItem 
                icon={PhoneIcon} 
                title="Phone" 
                content="+1 (555) 123-4567" 
              />
              <ContactInfoItem 
                icon={EmailIcon} 
                title="Email" 
                content="info@icurephysiotherapy.com" 
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
              >
                WhatsApp Us
              </Button>
            </Box>
          </Grid>

          {/* Right Column: Find Us */}
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
                Find Us
              </Typography>
              
              <Card sx={{ 
                height: 300, 
                mb: 4, 
                borderRadius: 3, 
                bgcolor: 'primary.light', 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center',
                color: 'white'
              }}>
                <LocationOnIcon sx={{ fontSize: 60, mb: 1 }} />
                <Typography variant="h6">Icure Physiotherapy</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>123 Health Street, Medical City</Typography>
                <Link href="https://maps.app.goo.gl/RTQBmQ3S7AGdqpfQ7" target="_blank" rel="noopener noreferrer" 
                  sx={{ color: 'white', textDecoration: 'underline', '&:hover': { color: 'white', textDecoration: 'none' } }}>
                  Click to view on Google Maps
                </Link>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ContactUsSection;
