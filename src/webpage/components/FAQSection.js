import React from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faqs = [
  {
    q: 'What is Precision Care / Precision Recovery?',
    a: 'It’s a structured approach that combines clinician guidance with assessment, planning, and tracking to support consistent recovery.',
  },
  {
    q: 'What are the services offered by icurephysiotherapy?',
    a: 'We provide orthopedic, sports, neuro, geriatric and home-care physiotherapy along with guided recovery programs.',
  },
  {
    q: 'Do you offer remote / virtual physiotherapy to overseas patients?',
    a: 'Yes — we can support selected cases virtually, with assessment and tailored plans, depending on your condition and equipment access.',
  },
  {
    q: 'How do I book an appointment for a icureclinic?',
    a: 'Use the “Book Now” button at the top to start your booking, or log in to schedule an appointment slot.',
  },
  {
    q: 'Are your physiotherapists certified and experienced?',
    a: 'Yes. Our experts are vetted for qualifications and clinical experience and follow evidence-based practice.',
  },
];

function FAQSection() {
  return (
    <Box id="faq-section" sx={{ py: { xs: 7, md: 9 }, bgcolor: '#fff' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 900, color: 'primary.main', mb: 1.5 }}>
          FAQ
        </Typography>
        <Typography
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            mb: { xs: 4, md: 6 },
            maxWidth: 760,
            mx: 'auto',
            lineHeight: 1.8,
          }}
        >
          Find answers to common questions about our physiotherapy services and guided recovery.
        </Typography>

        {faqs.map((f) => (
          <Accordion
            key={f.q}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              mb: 1.5,
              border: '1px solid rgba(11,61,51,0.12)',
              boxShadow: '0 10px 22px rgba(0,0,0,0.04)',
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 800, color: 'primary.main' }}>{f.q}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: 'text.secondary', lineHeight: 1.8 }}>{f.a}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </Box>
  );
}

export default FAQSection;
