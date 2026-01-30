import { PageHeader, DashboardContent } from '@asyml8/ui';

import {
  Box,
  Stack,
  Accordion,
  Typography,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import { useTranslation } from 'src/hooks/use-translation';

export function FaqsListView() {
  const { t } = useTranslation();

  const faqData = [
    {
      question: t('faqs.questions.submitDocuments.question'),
      answer: t('faqs.questions.submitDocuments.answer'),
    },
    {
      question: t('faqs.questions.fileFormats.question'),
      answer: t('faqs.questions.fileFormats.answer'),
    },
    {
      question: t('faqs.questions.trackStatus.question'),
      answer: t('faqs.questions.trackStatus.answer'),
    },
    {
      question: t('faqs.questions.recoveryPlan.question'),
      answer: t('faqs.questions.recoveryPlan.answer'),
    },
    {
      question: t('faqs.questions.planInstructions.question'),
      answer: t('faqs.questions.planInstructions.answer'),
    },
    {
      question: t('faqs.questions.designationLetter.question'),
      answer: t('faqs.questions.designationLetter.answer'),
    },
  ];

  return (
    <DashboardContent>
      <PageHeader
        title={t('faqs.title')}
        description={t('faqs.description')}
        breadcrumbs={[
          { label: t('faqs.breadcrumb.resources') },
          { label: t('faqs.breadcrumb.faqs') },
        ]}
      />

      <Stack spacing={2} sx={{ mt: 3 }}>
        {faqData.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={
                <Box sx={{ transform: 'rotate(0deg)', transition: 'transform 0.2s' }}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6,9 12,15 18,9" />
                  </svg>
                </Box>
              }
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Typography variant="h6" component="h3">
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" color="text.secondary">
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </DashboardContent>
  );
}
