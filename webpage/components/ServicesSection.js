import React from 'react';
import { Box, Typography, Grid, Container, Card, CardContent, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // For the dropdown arrow

// Reusable component for service cards
function ServiceCard({ title, description }) {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 3, 
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)', 
        border: '1px solid #e0e0e0', 
        '&:hover': {
          boxShadow: '0 6px 25px rgba(0,0,0,0.1)', 
          transform: 'translateY(-5px)', 
          transition: 'all 0.3s ease-in-out',
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: { xs: 3, md: 4 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h3" 
            sx={{ 
              fontWeight: 'bold', 
              color: 'primary.main', 
              textAlign: 'left',
              fontSize: { xs: '1.1rem', md: '1.25rem' }
            }}>
            {title}
          </Typography>
          <IconButton aria-label="show more" size="small" sx={{ color: 'primary.main' }}>
            <ExpandMoreIcon />
          </IconButton>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'left', fontSize: { xs: '0.9rem', md: '1rem' } }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}


function ServicesSection() {
  const services = [
    {
      title: 'Orthopedic Physiotherapy',
      description: 'Specialized treatment for musculoskeletal conditions and injuries.',
    },
    {
      title: 'Geriatric Physiotherapy',
      description: 'Comprehensive care for age-related mobility and health concerns.',
    },
    {
      title: 'Neuro Physiotherapy',
      description: 'Specialized rehabilitation for neurological conditions and disorders.',
    },
    {
      title: 'Pediatric Physiotherapy',
      description: 'Developmental and therapeutic care for children and adolescents.',
    },
    {
      title: 'Women\'s Health',
      description: 'Specialized physiotherapy addressing unique women\'s health needs.',
    },
  ];

  return (
    <Box sx={{
      pt: { xs: 10, md: 12 },
      py: { xs: 8, md: 12 }, 
      bgcolor: '#f5f7fa', 
      textAlign: 'center' 
    }}
    id='services-section'
    >
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" gutterBottom 
          sx={{ 
            fontWeight: 'bold', 
            color: 'primary.main', 
            mb: { xs: 2, md: 3 },
            fontSize: { xs: '2.5rem', md: '3.5rem' }
          }}>
          Our Services
        </Typography>
        <Typography variant="h6" component="p" sx={{ 
          color: 'text.secondary', 
          mb: { xs: 6, md: 8 },
          maxWidth: 700,
          mx: 'auto',
          fontSize: { xs: '1rem', md: '1.25rem' }
        }}>
          Comprehensive physiotherapy services tailored to meet your specific needs and recovery goals
        </Typography>

        <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ServiceCard title={service.title} description={service.description} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default ServicesSection;
