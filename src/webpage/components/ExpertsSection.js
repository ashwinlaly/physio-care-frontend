import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  IconButton,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const experts = [
  {
    name: 'Dr.T Krishnaveni',
    role: 'Cardio Respiratory Physiotherapist',
    gender: 'female',
    headline: 'icure Physiotherapist',
    bio: 'Certified Antenatal Postnatal Excercise Specialist, CAPES Fitness and Pilates Consultant.',
    socials: { facebook: '#', linkedin: '#', google: '#' },
  },
  {
    name: 'Dr.Samuel Lenis Clifford',
    role: 'Orthopedic Specialist',
    gender: 'male',
    headline: 'icure Orthopedic Specialist',
    bio: 'Certified Dry Needling Specialist and Fascial Manipulation Practitioner with 8+ years of experience in orthopedic physiotherapy.',
    socials: { facebook: '#', linkedin: '#', google: '#' },
  },
   {
    name: 'Dr.B Lakshmi Narayanan',
    role: 'Cardio Respiratory Specialist',
    gender: 'female',
    headline: 'icure Sports Specialist',
    bio: 'Certified Neuro Kinetic Therapist with 10+ years of experience in physiotherapy, helping patients recover and perform at their best.',
    socials: { facebook: '#', linkedin: '#', google: '#' },
  },
  {
    name: 'Dr.N Sabarish',
    role: 'Neurologic Specialist',
    gender: 'male',
    headline: 'icure Senior Physiotherapist',
    bio: 'Certified Manual Therapist with expertise in personalized physiotherapy plans tailored to your condition, schedule, and recovery goals.',
    socials: { facebook: '#', linkedin: '#', google: '#' },
  },
 
];

function ExpertsSection() {
  const scrollerRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [stepPx, setStepPx] = useState(320);

  const items = useMemo(() => {
    // Duplicate for seamless looping
    return [...experts, ...experts];
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const measure = () => {
      const firstCard = scroller.querySelector('[data-expert-card="true"]');
      if (!firstCard) return;
      const cardRect = firstCard.getBoundingClientRect();

      // Gap is driven by sx below (24px). Keep it in sync.
      const gapPx = 24;
      setStepPx(Math.round(cardRect.width + gapPx));
    };

    // Measure after paint
    const raf = requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
    };
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    if (isHovering) return;

    const interval = setInterval(() => {
      scroller.scrollBy({ left: stepPx, behavior: 'smooth' });
    }, 2000);

    return () => clearInterval(interval);
  }, [isHovering, stepPx]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const onScroll = () => {
      // When we pass the midpoint (end of the first list), jump back by that width.
      const resetAt = scroller.scrollWidth / 2;
      if (scroller.scrollLeft >= resetAt) {
        scroller.scrollLeft -= resetAt;
      }
    };

    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => scroller.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Box id="experts-section" sx={{ py: { xs: 7, md: 9 }, bgcolor: '#fff' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{
            textAlign: 'center',
            fontWeight: 900,
            color: 'primary.main',
            letterSpacing: '0.08em',
          }}
        >
          THOROUGHLY VETTED EXPERTS
        </Typography>
        <Typography
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            mt: 1.5,
            mb: { xs: 4, md: 6 },
            maxWidth: 820,
            mx: 'auto',
            lineHeight: 1.8,
          }}
        >
          Meet our specialists dedicated to evidence-based physiotherapy and personalized recovery.
        </Typography>

        <Box
          ref={scrollerRef}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          sx={{
            // Keep scroll enabled for auto-slide (and touch), but hide scrollbars.
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              pb: 1,
              px: 0.5,
            }}
          >
            {items.map((e, idx) => {
              const placeholderImages = [
                '/images/femaledoc1.png',
                '/images/femaledoc2.png',
                '/images/lak.png',
                '/images/sam.png',
              ];
              const placeholder = placeholderImages[idx % placeholderImages.length];
              return (
                <Box
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${e.name}-${idx}`}
                  data-expert-card="true"
                  sx={{
                    flex: '0 0 auto',
                    width: { xs: 260, sm: 280, md: 300 },
                  }}
                >
                  <Box
                    sx={{
                      borderRadius: 6,
                      overflow: 'hidden',
                      border: '1px solid rgba(11,61,51,0.10)',
                      boxShadow: '0 14px 30px rgba(0,0,0,0.06)',
                      bgcolor: '#fff',
                      '&:hover .expertOverlay': {
                        opacity: 1,
                        transform: 'translateY(0px)',
                      },
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <Box
                        sx={{
                          bgcolor: 'background.default',
                        }}
                      >
                      <Box
                        component="img"
                        src={placeholder}
                        alt={e.name}
                        sx={{
                          width: '100%',
                          height: 280,
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                      </Box>

                      <Stack
                        className="expertOverlay"
                        spacing={1.2}
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          p: 2.5,
                          justifyContent: 'center',
                          alignItems: 'center',
                          textAlign: 'center',
                          bgcolor: 'rgba(0,0,0,0.55)',
                          color: '#fff',
                          opacity: 0,
                          transform: 'translateY(6px)',
                          transition: 'opacity 180ms ease, transform 180ms ease',
                        }}
                      >
                        <Typography sx={{ fontWeight: 800, lineHeight: 1.4 }}>
                          {e.headline}: {e.name}
                        </Typography>
                        <Typography sx={{ opacity: 0.95, fontSize: 13.5, lineHeight: 1.6, maxWidth: 240 }}>
                          {e.bio}
                        </Typography>

                        <Stack direction="row" spacing={1} sx={{ pt: 0.5 }}>
                          <IconButton
                            size="small"
                            component="a"
                            href={e.socials?.facebook || '#'}
                            sx={{ bgcolor: '#fff', color: 'primary.main', '&:hover': { bgcolor: '#fff' } }}
                            aria-label="Facebook"
                          >
                            <FacebookIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            component="a"
                            href={e.socials?.linkedin || '#'}
                            sx={{ bgcolor: '#fff', color: 'primary.main', '&:hover': { bgcolor: '#fff' } }}
                            aria-label="LinkedIn"
                          >
                            <LinkedInIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            component="a"
                            href={e.socials?.google || '#'}
                            sx={{ bgcolor: '#fff', color: 'primary.main', '&:hover': { bgcolor: '#fff' } }}
                            aria-label="Google"
                          >
                            <Box component="span" sx={{ fontWeight: 900, fontSize: 14, lineHeight: 1 }}>
                              G
                            </Box>
                          </IconButton>
                        </Stack>
                      </Stack>
                    </Box>

                    <Box sx={{ py: 2.2, px: 1.5 }}>
                      <Typography sx={{ textAlign: 'center', fontWeight: 900, color: 'primary.main' }}>
                        {e.name}
                      </Typography>
                      <Typography sx={{ textAlign: 'center', color: 'text.secondary', fontSize: 13.5 }}>
                        {e.role}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default ExpertsSection;
