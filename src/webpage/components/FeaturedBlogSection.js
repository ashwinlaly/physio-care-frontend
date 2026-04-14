import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function BlogCard({ image, title, link }) {
  return (
    <Box
      sx={{
        flex: '0 0 auto',
        width: { xs: '280px', sm: '320px', md: '360px' },
        minWidth: 0,
      }}
    >
      <Box
        component="img"
        src={image}
        alt={title}
        sx={{
          width: '100%',
          height: { xs: 220, md: 255 },
          display: 'block',
          objectFit: 'cover',
          borderRadius: '28px',
        }}
      />

      <Typography
        sx={{
          mt: { xs: 2.5, md: 3 },
          color: '#123F39',
          fontWeight: 700,
          fontSize: { xs: 16.5, md: 18 },
          lineHeight: 1.45,
          letterSpacing: '-0.01em',
          textAlign: 'left',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: { xs: '48px', md: '56px' },
          maxWidth: '95%',
        }}
      >
        {title}
      </Typography>

      <Link
        href={link}
        underline="none"
        sx={{
          mt: { xs: 2, md: 2.5 },
          display: 'inline-flex',
          alignItems: 'center',
          color: '#123F39',
          fontWeight: 700,
          fontSize: { xs: 15.5, md: 16 },
          lineHeight: 1.3,
          '&:hover': {
            opacity: 0.85,
            textDecoration: 'none',
          },
        }}
      >
        Read More
        <ArrowForwardIcon
          sx={{
            ml: 1,
            fontSize: 18,
          }}
        />
      </Link>
    </Box>
  );
}

function FeaturedBlogSection() {
  const blogPosts = [
    {
      image: '/images/sarah.png',
      title: 'Mild Knee Pain Today, Serious Problem Tomorrow: Fix It Early With Phys...',
      link: '#',
    },
    {
      image: '/images/micheal.png',
      title: 'Are You ‘fit’ But Still In Pain? Hidden Mobility Crisis – A Physiother...',
      link: '#',
    },
    {
      image: '/images/image1.png',
      title: 'From Movement To Circulation: The Vital Role Of Calf Muscles And Physi...',
      link: '#',
    },
  ];

  return (
    <Box
      id="blog-section"
      sx={{
        bgcolor: '#FFFFFF',
        pt: { xs: 7, md: '88px' },
        pb: { xs: 7, md: '96px' },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          px: { xs: 2.5, sm: 3, md: '56px' },
        }}
      >
        {/* Header */}
        <Box sx={{ mb: { xs: 4.5, md: 6.5 } }}>
          <Typography
            component="h2"
            sx={{
              color: '#123F39',
              fontWeight: 900,
              fontSize: { xs: '2.0rem', sm: '2.1rem', md: '3.2rem' },
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              textAlign: 'left',
              mb: { xs: 2, md: 2.5 },
            }}
          >
            Latest Blogs
          </Typography>

          <Typography
            sx={{
              color: '#33413F',
              fontSize: { xs: 14.5, md: 17 },
              lineHeight: 1.8,
              maxWidth: '980px',
              textAlign: 'left',
            }}
          >
            Stay updated with the latest trends, expert insights, and news in physiotherapy — plus updates and highlights from icure Physiotherapy clinics.
          </Typography>
        </Box>

        {/* Blogs row */}
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 2.5, md: '26px' },
            overflowX: 'auto',
            overflowY: 'hidden',
            pb: 1,
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          {blogPosts.map((post, index) => (
            <BlogCard key={index} {...post} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default FeaturedBlogSection;
