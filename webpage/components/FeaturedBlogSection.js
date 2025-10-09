import React from 'react';
import { Box, Typography, Grid, Container, Button, Card, CardMedia, CardContent, Link, Stack } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CallToActionGradientButton from './CallToActionGradientButton'; // Import the new component

// Reusable component for blog cards
function BlogCard({ image, author, readTime, title, description, link }) {
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
      <CardMedia
        component="img"
        height="200"
        image={image}
        alt={title}
        sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12, objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, p: { xs: 3, md: 4 } }}>
        <Stack direction="row" spacing={2} alignItems="center" mb={2} color="text.secondary">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
            <Typography variant="body2">{author}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
            <Typography variant="body2">{readTime}</Typography>
          </Box>
        </Stack>
        <Typography variant="h6" component="h3" gutterBottom 
          sx={{ 
            fontWeight: 'bold', 
            color: 'primary.main', 
            textAlign: 'left',
            fontSize: { xs: '1.1rem', md: '1.25rem' }
          }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'left', mb: 3, fontSize: { xs: '0.9rem', md: '1rem' } }}>
          {description}
        </Typography>
        <Link href={link} underline="none" 
          sx={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            color: 'primary.main', 
            fontWeight: 'medium',
            '&:hover': {
              textDecoration: 'underline',
              color: 'primary.dark'
            }
          }}>
          Read More <ArrowForwardIcon sx={{ ml: 1, fontSize: '1rem' }} />
        </Link>
      </CardContent>
    </Card>
  );
}

function FeaturedBlogSection() {
  const blogPosts = [
    {
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99f232b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', // Example image URL
      author: 'Dr. Sarah Johnson',
      readTime: '5 min read',
      title: '5 Essential Exercises for Lower Back Pain Relief',
      description: 'Discover proven physiotherapy exercises that can help alleviate chronic lower back pain and improve your daily mobility.',
      link: '/blog/lower-back-pain-relief'
    },
    {
      image: 'https://images.unsplash.com/photo-1629904908999-53e778970423?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', // Example image URL
      author: 'Dr. Michael Chen',
      readTime: '8 min read',
      title: 'Recovery Tips After Knee Surgery: A Complete Guide',
      description: 'Learn about the essential recovery steps and physiotherapy techniques to ensure optimal healing after knee surgery.',
      link: '/blog/knee-surgery-recovery'
    },
  ];

  return (
    <Box sx={{ 
      py: { xs: 8, md: 12 }, 
      bgcolor: '#ffffff', 
      textAlign: 'center' ,
    pt: { xs: 10, md: 12 }
    }}
         id={"blog-section"}
    >
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" gutterBottom 
          sx={{ 
            fontWeight: 'bold', 
            color: 'primary.main', 
            mb: { xs: 2, md: 3 },
            fontSize: { xs: '2.5rem', md: '3.5rem' }
          }}>
          Featured Blog
        </Typography>
        <Typography variant="h6" component="p" sx={{ 
          color: 'text.secondary', 
          mb: { xs: 6, md: 8 },
          maxWidth: 700,
          mx: 'auto',
          fontSize: { xs: '1rem', md: '1.25rem' }
        }}>
          Stay informed with our latest insights on physiotherapy, wellness, and recovery tips from our expert team
        </Typography>

        <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
          {blogPosts.map((post, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <BlogCard {...post} />
            </Grid>
          ))}
        </Grid>

        <CallToActionGradientButton 
          text="View All Blog Posts" 
          icon={<ArrowForwardIcon />}
          sx={{ mt: { xs: 6, md: 8 } }}
        />
      </Container>
    </Box>
  );
}

export default FeaturedBlogSection;
